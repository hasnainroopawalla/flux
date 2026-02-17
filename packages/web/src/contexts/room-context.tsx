import * as React from "react";

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
};

const RoomContext = React.createContext<RoomContextValue>({
	room: null,
	setRoom: () => {},
});

export const RoomProvider = ({ children }: React.PropsWithChildren) => {
	const [room, setRoom] = React.useState<Room | null>(null);

	return (
		<RoomContext.Provider value={{ room, setRoom }}>
			{children}
		</RoomContext.Provider>
	);
};

export const useRoom = (): RoomContextValue => React.useContext(RoomContext);
