import * as React from "react";
import { useRealtimeClient } from "../contexts/realtime-client-context";
import {
	SimActionEventType,
	WsClientCommandType,
	WsServerEventType,
} from "@digital-logic-sim/shared-types";
import { useSimulatorApp } from "../contexts/simulator-app-context";
import { useRoom } from "../contexts/room-context";

export const MultiplayerBridge: React.FC = () => {
	const { realtimeClient } = useRealtimeClient();

	const simulatorApp = useSimulatorApp();

	const { room } = useRoom();

	React.useEffect(() => {
		const disposeChipSpawnSubscription = simulatorApp.sim.on(
			"chip.spawn.finish",
			(d) => {
				if (!room) {
					return;
				}

				realtimeClient.sendClientCommand({
					roomId: room.roomId,
					kind: WsClientCommandType.SimAction,
					action: SimActionEventType.ChipMove,
				});
			},
		);

		const unsubscribe = realtimeClient.on(
			WsServerEventType.SimAction,
			({ action }) => {
				console.log("SimAction:", action);
			},
		);

		return () => {
			unsubscribe();
			disposeChipSpawnSubscription();
		};
	}, [realtimeClient, room, simulatorApp]);

	return null;
};
