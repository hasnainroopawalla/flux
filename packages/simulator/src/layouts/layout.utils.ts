import {
	ChipRenderableType,
	RenderableType,
	type Renderable,
	type ChipRenderable,
	type PinRenderable,
} from "@flux/render-engine";
import { type Chip, ChipType, type GhostChip } from "../entities/chips";
import { type Pin, PinType } from "../entities/pin";
import { COLORS } from "../services/color-service";

export const LayoutUtils = {
	chipToRenderable: (chip: Chip, hoveredEntityId?: string): ChipRenderable => {
		const chipRenderState = chip.getRenderState();

		return {
			type: RenderableType.Chip,
			chipRenderableType: LayoutUtils.getChipRenderableType(chip.chipType),
			dimensions: chip.layout.dimensions,
			inputPins: getPinRenderables(chip.inputPins, hoveredEntityId),
			outputPins: getPinRenderables(chip.outputPins, hoveredEntityId),
			color: chipRenderState.color,
			position: chipRenderState.position,
		};
	},

	ghostChipToRenderable: (ghostChip: GhostChip): Renderable => {
		const createPinRenderable = (
			numPins: number,
			pinType: PinType,
		): PinRenderable[] =>
			Array.from({ length: numPins }, (_, pinIdx) => ({
				type: RenderableType.Pin,
				value: false,
				position: ghostChip.layout.getPinPosition(pinIdx, pinType),
				color: COLORS.Ghost,
			}));

		return {
			type: RenderableType.Chip,
			chipRenderableType: LayoutUtils.getChipRenderableType(
				ghostChip.spec.chipType,
			),
			color: ghostChip.renderState.color,
			position: ghostChip.renderState.position,
			dimensions: ghostChip.layout.dimensions,
			inputPins: createPinRenderable(ghostChip.spec.numInputPins, PinType.In),
			outputPins: createPinRenderable(
				ghostChip.spec.numOutputPins,
				PinType.Out,
			),
		};
	},

	getChipRenderableType: (chipType: ChipType): ChipRenderableType => {
		return chipType === ChipType.IO
			? ChipRenderableType.Circle
			: ChipRenderableType.Rect;
	},
};

function getPinRenderables(
	pins: Pin[],
	hoveredEntityId?: string,
): PinRenderable[] {
	return pins.map((pin) => ({
		type: RenderableType.Pin,
		position: pin.getPosition(),
		color: hoveredEntityId === pin.id ? COLORS.White : pin.renderState.color,
	}));
}
