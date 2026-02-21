import * as React from "react";
import { useRealtimeClient } from "../contexts/realtime-client-context";
import { WsClientCommandType, WsServerEventType } from "@flux/shared-types";
import { useSimulatorApp } from "../contexts/simulator-app-context";
import { useRoom } from "../contexts/room-context";
import { SimEventSource } from "@flux/simulator";

export const MultiplayerBridge: React.FC = () => {
	const { realtimeClient } = useRealtimeClient();

	const simulatorApp = useSimulatorApp();

	const { room } = useRoom();

	React.useEffect(() => {
		const disposeLocalSimEventSubscription = simulatorApp.sim.on(
			"sim.action",
			({ action, source }) => {
				if (!room || source === SimEventSource.Remote) {
					return;
				}

				realtimeClient.sendClientCommand({
					kind: WsClientCommandType.SimAction,
					roomId: room.roomId,
					action,
				});
			},
		);

		const unsubscribe = realtimeClient.on(
			WsServerEventType.SimAction,
			({ action }) => {
				simulatorApp.sim.applyRemoteAction(action);
			},
		);

		return () => {
			unsubscribe();
			disposeLocalSimEventSubscription();
		};
	}, [realtimeClient, room, simulatorApp]);

	return null;
};
