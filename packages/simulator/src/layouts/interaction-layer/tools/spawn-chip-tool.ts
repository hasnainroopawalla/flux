import type { Renderable } from "@flux/render-engine";
import { Tool, type ToolArgs } from "./tool";
import {
	ButtonEvent,
	type KeyboardButtonType,
	type MouseButtonType,
} from "../../../managers/input-manager";
import type { MousePosition } from "../../../types";
import type { Entity } from "../../../entities/entity";
import type { ChipDefinition } from "../../../services/chip-library-service";
import { SimActionType } from "@flux/shared-types";
import { entityIdService } from "../../../entity-id-service";

type SpawnChipToolArgs = ToolArgs & {
	chipDefinition: ChipDefinition;
};

export class SpawnChipTool extends Tool {
	private chipDefinition: ChipDefinition;

	private ghostChipId: string;

	constructor(args: SpawnChipToolArgs) {
		super(args);

		this.chipDefinition = args.chipDefinition;

		this.ghostChipId = this.generateGhostId();

		this.sim.applyLocalAction({
			kind: SimActionType.GhostChipSpawn,
			ghostChipId: this.ghostChipId,
			chipDefinition: args.chipDefinition,
			position: args.mousePositionService.getMousePosition().world,
		});
	}

	public getRenderables(): Renderable[] {
		return [];
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
		const ghostChip = this.sim.ghostChipManager.getChip(this.ghostChipId);

		if (!ghostChip) {
			return;
		}

		this.sim.applyLocalAction({
			kind: SimActionType.GhostChipMove,
			ghostChipId: this.ghostChipId,
			position: mousePosition.world,
		});
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

	private handleLeftMouseButtonClick(): void {
		const ghostChip = this.sim.ghostChipManager.getChip(this.ghostChipId);

		if (!ghostChip) {
			return;
		}

		this.sim.applyLocalAction({
			kind: SimActionType.ChipSpawn,
			chipDefinition: this.chipDefinition,
			chipId: entityIdService.generateId(),
			position: ghostChip.renderState.position,
		});

		this.sim.applyLocalAction({
			kind: SimActionType.GhostChipDestroy,
			ghostChipId: ghostChip.id,
		});

		this.deactivate();
	}

	private generateGhostId(): string {
		// return `${this.userId}:${entityIdService.generateId()}`;
		// TODO: use userId
		return `ghost:${entityIdService.generateId()}`;
	}
}
