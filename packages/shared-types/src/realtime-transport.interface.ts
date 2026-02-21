import type { Position } from "./common.interface";
import type { ChipDefinition } from "../../simulator"; // TODO: fix import

export enum WsClientCommandType {
	JoinRoom = "JoinRoom",
	CreateRoom = "CreateRoom",
	LeaveRoom = "LeaveRoom",
	SimAction = "SimAction",
}

export enum WsServerEventType {
	RoomJoined = "RoomJoined",
	RoomCreated = "RoomCreated",
	LeftRoom = "LeftRoom",
	SimAction = "SimAction",
}

export enum SimActionType {
	ChipSpawn = "ChipSpawn",

	// Ghost
	GhostChipSpawn = "GhostChipSpawn",
	GhostChipMove = "GhostChipMove",
	GhostChipEnd = "GhostChipEnd",
}

export type SimAction =
	| {
			kind: SimActionType.ChipSpawn;
			chipDefinition: ChipDefinition;
			chipId: string;
			position: Position;
	  }
	| {
			kind: SimActionType.GhostChipSpawn;
	  }
	| {
			kind: SimActionType.GhostChipMove;
	  }
	| {
			kind: SimActionType.GhostChipEnd;
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
			kind: WsClientCommandType.SimAction;
			roomId: string;
			action: SimAction;
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
			kind: WsServerEventType.SimAction;
			action: SimAction;
	  };

export type WsEventOf<K extends WsServerEvent["kind"]> = Extract<
	WsServerEvent,
	{ kind: K }
>;
