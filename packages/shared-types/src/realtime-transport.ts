import type { Position } from "./shared-types";

export enum WsClientCommandType {
	JoinRoom = "JoinRoom",
	CreateRoom = "CreateRoom",
	LeaveRoom = "LeaveRoom",
	SimCommand = "SimCommand",
}

export enum WsServerEventType {
	RoomJoined = "RoomJoined",
	RoomCreated = "RoomCreated",
	LeftRoom = "LeftRoom",
	SimEvent = "SimEvent",
}

export enum SimActionEventType {
	ChipSpawn = "ChipSpawn",
}

export type SimCommand = {
	action: SimActionEventType.ChipSpawn;
	chipDefinition: string;
	position: Position;
};

export type SimEvent = {
	action: SimActionEventType.ChipSpawn;
	chipDefinition: string;
	position: Position;
	chipId: string;
};

export type WsClientCommand =
	| {
			kind: WsClientCommandType.CreateRoom;
	  }
	| {
			kind: WsClientCommandType.JoinRoom;
			roomId: string;
	  }
	| {
			kind: WsClientCommandType.LeaveRoom;
			roomId: string;
	  }
	| {
			kind: WsClientCommandType.SimCommand;
			roomId: string;
			command: SimCommand;
	  };

export type WsServerEvent =
	| {
			kind: WsServerEventType.RoomCreated;
			roomId: string;
	  }
	| {
			kind: WsServerEventType.RoomJoined;
			roomId: string;
	  }
	| {
			kind: WsServerEventType.LeftRoom;
	  }
	| {
			kind: WsServerEventType.SimEvent;
			event: SimEvent;
	  };

export type WsEventOf<K extends WsServerEvent["kind"]> = Extract<
	WsServerEvent,
	{ kind: K }
>;
