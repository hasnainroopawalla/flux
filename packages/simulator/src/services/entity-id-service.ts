import type { PinType } from "../entities/pin";

const ENTITY_ID_START_INDEX = -1;

export class EntityIdService {
	private sessionId: string;
	current: number;

	constructor(sessionId: string) {
		this.sessionId = sessionId;
		this.current = ENTITY_ID_START_INDEX;
	}

	public reset(): void {
		this.current = ENTITY_ID_START_INDEX;
	}

	public generateId(): string {
		this.current += 1;
		return `${this.sessionId}:${this.current.toString()}`;
	}

	public generatePinId(
		chipId: string,
		chipPinIndex: number,
		pinType: PinType,
	): string {
		return `${chipId}.${pinType}.${chipPinIndex}`;
	}
}
