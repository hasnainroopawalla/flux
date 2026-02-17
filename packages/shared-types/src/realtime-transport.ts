export enum WsClientCommandType {
	JoinRoom = "JoinRoom",
	CreateRoom = "CreateRoom",
	LeaveRoom = "LeaveRoom",
}

export enum WsServerEventType {
	RoomJoined = "RoomJoined",
	RoomCreated = "RoomCreated",
	LeftRoom = "LeftRoom",
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
	  };

export type WsServerEvent =
	| {
			kind: WsServerEventType.RoomCreated;
			roomId: string;
	  }
	| {
			kind: WsServerEventType.RoomJoined;
	  }
	| {
			kind: WsServerEventType.LeftRoom;
	  };

export type WsEventOf<K extends WsServerEvent["kind"]> = Extract<
	WsServerEvent,
	{ kind: K }
>;
