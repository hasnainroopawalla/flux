import type { WebSocket } from "ws";

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

	private generateRoomId(): string {
		return this.rooms.size.toString();
	}
}
