import type { Position, SimAction } from "@flux/shared-types";
import type { ChipType } from "../../entities/chips";
import type { Pin, PinType } from "../../entities/pin";
import type { ChipDefinition } from "../chip-library-service";
import type { EntityType } from "../../entities/entity";

export type IEntitySecondaryActionEvent = {
	entityId: string;
	mousePosition: Position;
} & {
	entityType: EntityType.Chip;
	chipType: ChipType;
};

export type IChipSpawnFinishEvent = {
	chipId: string;
	chipName: string;
	chipType: ChipType;
	pins: { id: string; name: string; pinType: PinType }[];
};

export enum SimEventSource {
	Local = "Local",
	Remote = "Remote",
}

export type IEvents = {
	"sim.action": {
		action: SimAction;
		source: SimEventSource;
	};

	"sim.save-chip.start": { chipName: string };
	"sim.save-chip.finish": undefined;

	"sim.import-blueprint.start": { blueprintString: string };

	"sim.reset": undefined;

	"overlay.changed": undefined;

	"wire.spawn.start": { startPin: Pin };

	"chip.spawn.start": { chipDefinition: ChipDefinition };
	"chip.spawn.finish": IChipSpawnFinishEvent;

	"entity.secondaryAction": IEntitySecondaryActionEvent;

	"composite-chip.view": {
		compositeChipId: string;
	};

	"chip.delete.start": {
		chipId: string;
	};
	"chip.delete.finish": {
		chipId: string;
	};
};
