import {
	type WsClientCommand,
	type WsServerEvent,
	type WsEventOf,
	WsServerEventType,
} from "@flux/shared-types";

type SubscriptionCallback = (event: WsServerEvent) => void;

export class RealtimeClient {
	public sessionId: string | undefined;

	private socketUrl: string;
	private isConnected = false;

	private subscriptions: Map<WsServerEvent["kind"], Set<SubscriptionCallback>>;

	private ws!: WebSocket;

	constructor(socketUrl: string) {
		this.socketUrl = socketUrl;
		this.subscriptions = new Map();
	}

	public async ensureConnected(): Promise<void> {
		if (this.isConnected) {
			return Promise.resolve();
		}

		await this.connect();
	}

	public sendClientCommand(message: WsClientCommand): void {
		if (!this.isConnected) {
			console.log("WebSocket not connected");
		}

		this.ws.send(JSON.stringify(message));
	}

	public on<K extends WsServerEvent["kind"]>(
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

	private connect(): Promise<void> {
		if (this.ws) {
			throw new Error("WebSocket already created");
		}

		this.ws = new WebSocket(this.socketUrl);

		return new Promise((resolve, reject) => {
			this.ws.onopen = () => {
				this.isConnected = true;

				this.ws.onmessage = (event) => {
					const data: WsServerEvent = JSON.parse(event.data);

					if (data.kind === WsServerEventType.Welcome) {
						this.sessionId = data.sessionId;
						resolve();
					}

					this.handleNewMessage(data);
				};
			};

			this.ws.onerror = (err) => reject(err);
		});
	}

	private handleNewMessage(data: WsServerEvent): void {
		this.subscriptions.get(data.kind)?.forEach((callback) => {
			callback(data);
		});
	}
}
