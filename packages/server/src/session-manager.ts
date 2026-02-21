import type { WebSocket } from "ws";

type Session = {
	id: string;
	socket: WebSocket;
};

export class SessionManager {
	private sessions: Map<string /* sessionId */, Session>;

	constructor() {
		this.sessions = new Map();
	}

	public create(socket: WebSocket): Session {
		const sessionId = this.generateSessionId();

		const session = {
			id: sessionId,
			socket,
		};

		this.sessions.set(sessionId, session);

		return session;
	}

	public destroy(sessionId: string): void {
		this.sessions.delete(sessionId);
	}

	public get(sessionId: string): Session | undefined {
		return this.sessions.get(sessionId);
	}

	private generateSessionId(): string {
		return `session-${this.sessions.size}`;
	}
}
