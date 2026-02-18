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

export enum SimActionEventType {
	ChipMove = "ChipMove",
}

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
			action: SimActionEventType;
			roomId: string;
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
			action: SimActionEventType;
	  };

export type WsEventOf<K extends WsServerEvent["kind"]> = Extract<
	WsServerEvent,
	{ kind: K }
>;
