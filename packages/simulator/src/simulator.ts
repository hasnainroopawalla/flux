// managers
import { ChipManager } from "./managers/chip-manager/chip-manager";
import { WireManager } from "./managers/wire-manager";
import { PinManager } from "./managers/pin-manager";
import { GhostChipManager } from "./managers/ghost-chip-manager";

// services
import { ChipLibraryService } from "./services/chip-library-service";
import { BlueprintService } from "./services/blueprint-service";
import {
	EventingService,
	SimEventSource,
	type IEvents,
	type Unsubscribe,
} from "./services/eventing-service";

import { SimActionType, type SimAction } from "@flux/shared-types";
import { EntityIdService } from "./services/entity-id-service";

const simulatorConfig = {
	maxIterations: 1000,
};

export class Simulator {
	// services
	public eventingService: EventingService;
	public chipLibraryService: ChipLibraryService;
	public blueprintService: BlueprintService;
	public entityIdService: EntityIdService;

	// managers
	public chipManager: ChipManager;
	public pinManager: PinManager;
	public wireManager: WireManager;
	public ghostChipManager: GhostChipManager;

	constructor(sessionId: string) {
		// services
		this.eventingService = new EventingService();
		this.chipLibraryService = new ChipLibraryService();
		this.blueprintService = new BlueprintService(this);
		this.entityIdService = new EntityIdService(sessionId);

		// managers
		this.wireManager = new WireManager(this);
		this.chipManager = new ChipManager(this);
		this.pinManager = new PinManager(this);
		this.ghostChipManager = new GhostChipManager(this);
	}

	public on<K extends keyof IEvents>(
		event: K,
		handler: (data: IEvents[K]) => void,
	): Unsubscribe {
		return this.eventingService.subscribe(event, handler);
	}

	public emit<K extends keyof IEvents>(event: K, data: IEvents[K]): void {
		this.eventingService.publish(event, data);
	}

	public applyLocalAction(action: SimAction) {
		this.applyAction(action, SimEventSource.Local);
	}

	public applyRemoteAction(action: SimAction) {
		this.applyAction(action, SimEventSource.Remote);
	}

	public update(): void {
		const state = {
			shouldRunLoop: true,
			iterations: 0,
		};

		while (
			state.shouldRunLoop &&
			state.iterations < simulatorConfig.maxIterations
		) {
			state.iterations += 1;

			const chipsChanged = this.chipManager.executeChips();
			const wiresChanged = this.wireManager.propagateWires();
			const pinsChanged = this.chipManager.commitAllPinValues();

			state.shouldRunLoop = chipsChanged || wiresChanged || pinsChanged;
		}
	}

	private applyAction(action: SimAction, source: SimEventSource) {
		switch (action.kind) {
			case SimActionType.ChipSpawn: {
				this.chipManager.spawnChip(action.chipDefinition, {
					chipId: action.chipId,
					position: action.position,
				});
				break;
			}
			case SimActionType.GhostChipSpawn: {
				this.ghostChipManager.createChip(
					action.ghostChipId,
					action.chipDefinition,
					action.position,
				);
				break;
			}
			case SimActionType.GhostChipMove:
				this.ghostChipManager.moveChip(action.ghostChipId, action.position);
				break;
			case SimActionType.GhostChipDestroy:
				this.ghostChipManager.destroyChip(action.ghostChipId);
				break;
		}
		this.emit("sim.action", { action, source });
	}
}
