import * as React from "react";
import { useRealtimeClient } from "../contexts/realtime-client-context";
import {
	SimActionEventType,
	WsClientCommandType,
	WsServerEventType,
} from "@flux/shared-types";
import { useSimulatorApp } from "../contexts/simulator-app-context";
import { useRoom } from "../contexts/room-context";
import { ChipType } from "@flux/simulator";
import { AtomicChipType } from "@flux/simulator/src/entities/chips";

export const MultiplayerBridge: React.FC = () => {
	const { realtimeClient } = useRealtimeClient();

	const simulatorApp = useSimulatorApp();

	const { room } = useRoom();

	React.useEffect(() => {
		const disposeChipSpawnSubscription = simulatorApp.sim.on(
			"chip.spawn.finish",
			({ chipId, chipName, chipType, pins }) => {
				if (!room) {
					return;
				}

				realtimeClient.sendClientCommand({
					roomId: room.roomId,
					kind: WsClientCommandType.SimCommand,
					command: {
						action: SimActionEventType.ChipSpawn,
						chipDefinition: "chipDefinitionName",
						position: { x: 0, y: 0 },
					},
				});
			},
		);

		const unsubscribe = realtimeClient.on(
			WsServerEventType.SimEvent,
			({ event }) => {
				const factory = simulatorApp.sim.chipLibraryService.getChipFactory({
					kind: ChipType.Atomic,
					name: AtomicChipType.And,
				});
				console.log("Spawning chip from sim event", event, factory);
				simulatorApp.sim.chipManager.spawnChip(
					factory,
					{ position: event.position },
					{ remoteChipId: event.chipId },
				);
			},
		);

		return () => {
			unsubscribe();
			disposeChipSpawnSubscription();
		};
	}, [realtimeClient, room, simulatorApp]);

	return null;
};
