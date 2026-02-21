import { COLORS } from "../../services/color-service";
import { type ChipLayout, ChipLayoutFactory } from "./chip-layout-factory";
import type { ChipInitParams, ChipRenderState } from "./chip.interface";
import type { Position } from "@flux/shared-types";
import type { ChipMetadata } from "./chip.utils";

export type GhostChipSpec = ChipMetadata;

export class GhostChip {
	public spec: GhostChipSpec;
	public layout: ChipLayout;
	public renderState: ChipRenderState;
	public id: string;

	constructor(spec: GhostChipSpec, chipInitParams: ChipInitParams) {
		this.renderState = {
			color: COLORS.Ghost,
			position: chipInitParams.position,
		};
		this.spec = spec;
		this.id = chipInitParams.chipId;

		this.layout = new ChipLayoutFactory(this.renderState, this.spec);
	}

	public setPosition(position: Position): void {
		this.renderState.position = position;
	}
}
