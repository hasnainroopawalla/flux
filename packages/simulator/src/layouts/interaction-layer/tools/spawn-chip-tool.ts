import {
	type ChipRenderable,
	type Renderable,
	type PinRenderable,
	RenderableType,
} from "@flux/render-engine";
import { Tool, type ToolArgs } from "./tool";
import {
	ChipType,
	GhostChip,
	type GhostChipSpec,
} from "../../../entities/chips";
import {
	ButtonEvent,
	type KeyboardButtonType,
	type MouseButtonType,
} from "../../../managers/input-manager";
import type { MousePosition } from "../../../types";
import type { Entity } from "../../../entities/entity";
import { PinType } from "../../../entities/pin";
import {
	ChipLibraryUtils,
	type ChipDefinition,
} from "../../../services/chip-library-service";
import { BlueprintUtils } from "../../../services/blueprint-service";
import { COLORS } from "../../../services/color-service";
import { LayoutUtils } from "../../layout.utils";
import { SimActionType } from "@flux/shared-types";
import { SimEventSource } from "../../../services/eventing-service";
import { entityIdService } from "../../../entity-id-service";

type SpawnChipToolArgs = ToolArgs & {
	chipDefinition: ChipDefinition;
};

export class SpawnChipTool extends Tool {
	private chipDefinition: ChipDefinition;

	private ghostChip: GhostChip;

	constructor(args: SpawnChipToolArgs) {
		super(args);

		this.chipDefinition = args.chipDefinition;

		this.ghostChip = new GhostChip(this.getGhostChipSpec(this.chipDefinition), {
			chipId: "0",
			position: args.mousePositionService.getMousePosition().world,
		});
	}

	public getRenderables(): Renderable[] {
		if (!this.ghostChip) {
			return [];
		}

		return [this.createGhostChipRenderable()];
	}

	public onMouseButtonEvent(
		event: MouseButtonType,
		nature: ButtonEvent,
		_mousePosition: MousePosition,
	): void {
		switch (event) {
			case "leftMouseButton": {
				switch (nature) {
					case ButtonEvent.Click: {
						this.handleLeftMouseButtonClick();
						break;
					}
				}
			}
		}
	}

	public onMouseMoveEvent(
		mousePosition: MousePosition,
		_hoveredEntity: Entity | null,
	): void {
		this.ghostChip.setPosition(mousePosition.world);
	}

	public onKeyboardEvent(
		event: KeyboardButtonType,
		_nature: ButtonEvent,
	): void {
		switch (event) {
			case "Escape":
				this.deactivate();
				break;
		}
	}

	private createGhostChipRenderable(): ChipRenderable {
		const createPinRenderable = (
			numPins: number,
			pinType: PinType,
		): PinRenderable[] =>
			Array.from({ length: numPins }, (_, pinIdx) => ({
				type: RenderableType.Pin,
				value: false,
				position: this.ghostChip.layout.getPinPosition(pinIdx, pinType),
				color: COLORS.Ghost,
			}));

		return {
			type: RenderableType.Chip,
			chipRenderableType: LayoutUtils.getChipRenderableType(
				this.chipDefinition.kind,
			),
			color: this.ghostChip.renderState.color,
			position: this.ghostChip.renderState.position,
			dimensions: this.ghostChip.layout.dimensions,
			inputPins: createPinRenderable(
				this.ghostChip.spec.numInputPins,
				PinType.In,
			),
			outputPins: createPinRenderable(
				this.ghostChip.spec.numOutputPins,
				PinType.Out,
			),
		};
	}

	private handleLeftMouseButtonClick(): void {
		this.sim.applyLocalAction({
			kind: SimActionType.ChipSpawn,
			chipDefinition: this.chipDefinition,
			chipId: entityIdService.generateId(),
			position: this.ghostChip.renderState.position,
		});

		this.deactivate();
	}

	private getGhostChipSpec(chipDefinition: ChipDefinition): GhostChipSpec {
		const chipFactory =
			this.sim.chipLibraryService.getChipFactory(chipDefinition);

		const chipSpec = ChipLibraryUtils.getChipSpec(chipFactory);

		const { inputPins, outputPins } =
			chipSpec.chipType === ChipType.Composite
				? BlueprintUtils.getIOPinSpecs(chipSpec.definition)
				: chipSpec;

		return {
			name: chipSpec.name,
			chipType: chipSpec.chipType,
			numInputPins: inputPins.length,
			numOutputPins: outputPins.length,
		};
	}
}
