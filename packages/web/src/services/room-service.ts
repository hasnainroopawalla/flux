import {
	WsClientCommandType,
	WsServerEventType,
} from "@digital-logic-sim/shared-types";
import type { RealtimeClient } from "./realtime-client";

export class RoomService {
	private realtimeClient: RealtimeClient;

	constructor(realtimeClient: RealtimeClient) {
		this.realtimeClient = realtimeClient;
	}

	public async createRoom(): Promise<string> {
		await this.realtimeClient.ensureConnected();

		return new Promise((resolve) => {
			this.realtimeClient.sendClientCommand({
				kind: WsClientCommandType.CreateRoom,
			});

			const unsubscribe = this.realtimeClient.on(
				WsServerEventType.RoomCreated,
				({ roomId }) => {
					unsubscribe();
					resolve(roomId);
				},
			);
		});
	}

	public async joinRoom(roomId: string): Promise<void> {
		await this.realtimeClient.ensureConnected();

		return new Promise((resolve) => {
			this.realtimeClient.sendClientCommand({
				kind: WsClientCommandType.JoinRoom,
				roomId,
			});

			const unsubscribe = this.realtimeClient.on(
				WsServerEventType.RoomJoined,
				() => {
					unsubscribe();
					resolve();
				},
			);
		});
	}
}
