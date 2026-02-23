import * as React from "react";
import { useRealtimeClient } from "../contexts/realtime-client-context";
import {
	type SimAction,
	SimActionType,
	WsClientCommandType,
	WsServerEventType,
} from "@flux/shared-types";
import { useSimulatorApp } from "../contexts/simulator-app-context";
import { type Room, useRoom } from "../contexts/room-context";
import { SimEventSource } from "@flux/simulator";
import { throttle } from "../utils";

export const MultiplayerBridge: React.FC = () => {
	const { realtimeClient } = useRealtimeClient();

	const simulatorApp = useSimulatorApp();

	const { room } = useRoom();

	const sendGhostMoveThrottled = React.useMemo(
		() =>
			throttle((action: SimAction, room: Room) => {
				realtimeClient.sendClientCommand({
					kind: WsClientCommandType.SimAction,
					roomId: room.roomId,
					action,
				});
			}, 30),
		[realtimeClient],
	);

	React.useEffect(() => {
		const disposeLocalSimEventSubscription = simulatorApp.sim.on(
			"sim.action",
			({ action, source }) => {
				if (!room || source === SimEventSource.Remote) {
					return;
				}

				switch (action.kind) {
					case SimActionType.GhostChipMove:
						sendGhostMoveThrottled(action, room);
						break;
					default:
						realtimeClient.sendClientCommand({
							kind: WsClientCommandType.SimAction,
							roomId: room.roomId,
							action,
						});
				}
			},
		);

		const disposeRemoteSimEventSubscription = realtimeClient.on(
			WsServerEventType.SimAction,
			({ action }) => {
				simulatorApp.sim.applyRemoteAction(action);
			},
		);

		return () => {
			disposeRemoteSimEventSubscription();
			disposeLocalSimEventSubscription();
		};
	}, [realtimeClient, room, simulatorApp, sendGhostMoveThrottled]);

	return null;
};
