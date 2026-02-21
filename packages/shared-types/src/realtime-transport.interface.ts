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
	GhostChipDestroy = "GhostChipDestroy",
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
			ghostChipId: string;
			position: Position;
			chipDefinition: ChipDefinition;
	  }
	| {
			kind: SimActionType.GhostChipMove;
			ghostChipId: string;
			position: Position;
	  }
	| {
			kind: SimActionType.GhostChipDestroy;
			ghostChipId: string;
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
