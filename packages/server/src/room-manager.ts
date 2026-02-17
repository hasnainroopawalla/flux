import type { WebSocket } from "ws";

const config = {
	roomIdLength: 4,
};

type Room = {
	clients: Set<WebSocket>;
};

export class RoomManager {
	private rooms: Map<string /* roomId */, Room>;

	constructor() {
		this.rooms = new Map();
	}

	public createRoom(client: WebSocket): string {
		const roomId = this.generateRoomId();
		this.rooms.set(roomId, { clients: new Set([client]) });

		return roomId;
	}

	public deleteRoom(roomId: string) {
		this.rooms.delete(roomId);
	}

	public joinRoom(roomId: string, client: WebSocket): void {
		const room = this.rooms.get(roomId);

		if (!room) {
			throw new Error("Room does not exist.");
		}

		room.clients.add(client);
	}

	public leaveRoom(roomId: string, client: WebSocket): void {
		const room = this.rooms.get(roomId);

		if (!room) {
			throw new Error("Room does not exist.");
		}

		room.clients.delete(client);
	}

	public getRoom(roomId: string): Room | undefined {
		return this.rooms.get(roomId);
	}

	private generateRoomId(): string {
		return "1";
		return Math.random()
			.toString(36)
			.substring(2 /* skip `0.` */, 2 + config.roomIdLength);
	}
}
