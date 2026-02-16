import { WebSocketServer, type WebSocket, type Server } from "ws";
import { RoomManager } from "./room-manager";
import { WsClientCommand, WsClientCommandType, WsServerEvent, WsServerEventType } from "@digital-logic-sim/shared-types";

const WS_PORT = 8081;

const roomManager = new RoomManager();

class RealtimeServer {
	private server: Server;

	constructor(port: number) {
		this.server = new WebSocketServer({
			port,
		});

		console.log("WebSocket server running on ws://localhost:8081");

		this.server.on("connection", (socket) => this.onNewConnection(socket));
	}

	public stop(): void {
		this.server.close();
	}

	public onNewConnection(socket: WebSocket): void {
		console.log("Client connected");

		socket.on("message", (raw) => {
			const clientCommand: WsClientCommand = JSON.parse(raw.toString());

			console.log("Received message:", clientCommand);

			switch (clientCommand.kind) {
				case WsClientCommandType.CreateRoom:
					this.onCreateRoom(socket);
					break;
				case WsClientCommandType.JoinRoom:
					this.onJoinRoom(clientCommand.roomId, socket);
					break;
				case WsClientCommandType.LeaveRoom:
					this.onLeaveRoom(clientCommand.roomId, socket);
					break;
				default:
					break;
			}
		});
	}

	private onCreateRoom(socket: WebSocket): void {
		const roomId = roomManager.createRoom(socket);
		this.sendServerEvent(socket, { kind: WsServerEventType.RoomCreated, roomId });
	}

	private onJoinRoom(roomId: string, socket: WebSocket): void {
		roomManager.joinRoom(roomId, socket);
		this.sendServerEvent(socket, { kind: WsServerEventType.RoomJoined });
	}

	private onLeaveRoom(roomId: string, socket: WebSocket): void {
		roomManager.leaveRoom(roomId, socket);
		this.sendServerEvent(socket, { kind: WsServerEventType.LeftRoom });
	}

	private sendServerEvent(socket: WebSocket, serverEvent: WsServerEvent): void {
		socket.send(JSON.stringify(serverEvent));
	}
}

new RealtimeServer(WS_PORT);
