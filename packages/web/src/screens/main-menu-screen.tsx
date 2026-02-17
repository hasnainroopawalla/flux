import * as React from "react";
import { ParticipantRole, useRoom } from "../contexts/room-context";

type MainMenuScreenProps = {
	onNewRoomCreated: () => void;
	onRoomJoined: () => void;
	onLoadClick: () => void;
};

export const MainMenuScreen: React.FC<MainMenuScreenProps> = ({
	onNewRoomCreated,
	onRoomJoined,
	onLoadClick,
}) => {
	const { setRoom, createRoom, joinRoom } = useRoom();

	const createNewRoom = React.useCallback(async () => {
		try {
			const roomId = await createRoom();

			setRoom({
				role: ParticipantRole.Host,
				roomId,
			});

			onNewRoomCreated();
		} catch (_) {}
	}, [onNewRoomCreated, setRoom, createRoom]);

	const requestJoinRoom = React.useCallback(async () => {
		try {
			const roomId = "1";
			await joinRoom(roomId);

			setRoom({
				role: ParticipantRole.Member,
				roomId,
			});

			onRoomJoined();
		} catch (_) {}
	}, [onRoomJoined, setRoom, joinRoom]);

	return (
		<div className="flex flex-col gap-2">
			<button onClick={createNewRoom}>New Room</button>
			<button onClick={requestJoinRoom}>Join Room</button>
			<button onClick={onLoadClick}>Load</button>
		</div>
	);
};
