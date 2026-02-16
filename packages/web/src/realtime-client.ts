import {
	type WsClientCommand,
	WsClientCommandType,
} from "@digital-logic-sim/shared-types";

export class RealtimeClient {
	private ws: WebSocket;
	private isConnected = false;

	constructor(socketUrl: string) {
		this.ws = new WebSocket(socketUrl);
	}

	public connect(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.ws.onopen = () => {
				this.isConnected = true;
				console.log("Connected to server");

				this.ws.onmessage = (c) => {
					console.log(c);
				};

				resolve();
			};

			this.ws.onerror = (err) => reject(err);
		});
	}

	public createRoom(): void {
		this.sendClientCommand({ kind: WsClientCommandType.CreateRoom });
	}

	private sendClientCommand(message: WsClientCommand): void {
		if (!this.isConnected) {
			console.log("WebSocket not connected.");
		}

		this.ws.send(JSON.stringify(message));
	}

	private on() {}
}
