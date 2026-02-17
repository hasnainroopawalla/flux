import {
	type WsClientCommand,
	type WsServerEvent,
	type WsEventOf,
	WsClientCommandType,
	WsServerEventType,
} from "@digital-logic-sim/shared-types";

type SubscriptionCallback = (event: WsServerEvent) => void;

export class RealtimeClient {
	private socketUrl: string;
	private ws!: WebSocket;
	private isConnected = false;

	private subscriptions: Map<WsServerEvent["kind"], Set<SubscriptionCallback>>;

	constructor(socketUrl: string) {
		this.socketUrl = socketUrl;
		this.subscriptions = new Map();
	}

	public async ensureConnected(): Promise<void> {
		if (this.isConnected) {
			return;
		}

		await this.connect();
	}

	public createRoom(): Promise<string> {
		return new Promise((resolve) => {
			this.sendClientCommand({
				kind: WsClientCommandType.CreateRoom,
			});

			const unsubscribe = this.on(
				WsServerEventType.RoomCreated,
				({ roomId }) => {
					unsubscribe();
					resolve(roomId);
				},
			);
		});
	}

	private connect(): Promise<void> {
		if (this.ws) {
			throw new Error("WebSocket already created");
		}

		this.ws = new WebSocket(this.socketUrl);

		return new Promise((resolve, reject) => {
			this.ws.onopen = () => {
				this.isConnected = true;

				this.ws.onmessage = (event) => {
					this.handleNewMessage(event);
				};

				resolve();
			};

			this.ws.onerror = (err) => reject(err);
		});
	}

	private sendClientCommand(message: WsClientCommand): void {
		if (!this.isConnected) {
			console.log("WebSocket not connected");
		}

		this.ws.send(JSON.stringify(message));
	}

	private on<K extends WsServerEvent["kind"]>(
		kind: K,
		handler: (event: WsEventOf<K>) => void,
	) {
		let subscription = this.subscriptions.get(kind);

		if (!subscription) {
			subscription = new Set();
			this.subscriptions.set(kind, subscription);
		}

		subscription.add(handler as SubscriptionCallback);

		return () => {
			subscription?.delete(handler as SubscriptionCallback);
		};
	}

	private handleNewMessage(event: MessageEvent): void {
		const data: WsServerEvent = JSON.parse(event.data);

		this.subscriptions.get(data.kind)?.forEach((callback) => {
			callback(data);
		});
	}
}
