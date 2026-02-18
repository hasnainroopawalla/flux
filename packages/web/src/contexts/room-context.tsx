import * as React from "react";
import { RoomService } from "../services/room-service";
import { useRealtimeClient } from "./realtime-client-context";

export enum ParticipantRole {
	Host = "Host",
	Member = "Member",
}

type Room = {
	role: ParticipantRole;
	roomId: string;
};

type RoomContextValue = {
	room: Room | null;
	setRoom: (room: Room) => void;
	createRoom: () => Promise<string>;
	joinRoom: (roomId: string) => Promise<string>;
};

const RoomContext = React.createContext<RoomContextValue>(
	{} as RoomContextValue,
);

export const RoomProvider = ({ children }: React.PropsWithChildren) => {
	const [room, setRoom] = React.useState<Room | null>(null);

	const { realtimeClient } = useRealtimeClient();

	const roomService = React.useMemo(() => {
		return new RoomService(realtimeClient);
	}, [realtimeClient]);

	const createRoom = React.useCallback(
		() => roomService.createRoom(),
		[roomService],
	);

	const joinRoom = React.useCallback(
		(roomId: string) => roomService.joinRoom(roomId),
		[roomService],
	);

	return (
		<RoomContext.Provider
			value={{
				room,
				setRoom,
				createRoom,
				joinRoom,
			}}
		>
			{children}
		</RoomContext.Provider>
	);
};

export const useRoom = (): RoomContextValue => React.useContext(RoomContext);
