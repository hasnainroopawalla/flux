import type { Position } from "@flux/shared-types";
import { ChipType, GhostChip, type GhostChipSpec } from "../entities/chips";
import { BlueprintUtils } from "../services/blueprint-service";
import {
	ChipLibraryUtils,
	type ChipDefinition,
} from "../services/chip-library-service";
import type { Simulator } from "../simulator";

export class GhostChipManager {
	private sim: Simulator;

	private ghostChips: Map<string /* ghostChipId */, GhostChip>;

	constructor(sim: Simulator) {
		this.sim = sim;
		this.ghostChips = new Map();
	}

	public createChip(
		ghostChipId: string,
		chipDefinition: ChipDefinition,
		position: Position,
	): GhostChip {
		const ghostChip = new GhostChip(this.getGhostChipSpec(chipDefinition), {
			chipId: ghostChipId,
			position,
		});

		this.ghostChips.set(ghostChipId, ghostChip);

		return ghostChip;
	}

	public moveChip(ghostChipId: string, position: Position): void {
		const ghostChip = this.ghostChips.get(ghostChipId);

		if (ghostChip) {
			ghostChip.setPosition(position);
		}
	}

	public destroyChip(ghostChipId: string): void {
		this.ghostChips.delete(ghostChipId);
	}

	public getChip(ghostChipId: string): GhostChip | undefined {
		return this.ghostChips.get(ghostChipId);
	}

	public getAll(): GhostChip[] {
		return Array.from(this.ghostChips.values());
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
