import * as React from "react";
import { ParticipantRole, useRoom } from "../contexts/room-context";
import { useRealtimeClient } from "../contexts/realtime-client-context";

type MainMenuScreenProps = {
	onNewRoomCreated: () => void;
	onLoadClick: () => void;
	onJoinRoomClick: () => void;
};

export const MainMenuScreen: React.FC<MainMenuScreenProps> = ({
	onJoinRoomClick,
	onLoadClick,
	onNewRoomCreated,
}) => {
	const { setRoom } = useRoom();
	const { realtimeClient } = useRealtimeClient();

	const onNewRoomClick = React.useCallback(async () => {
		try {
			await realtimeClient.ensureConnected();
			const roomId = await realtimeClient.createRoom();

			setRoom({
				role: ParticipantRole.Host,
				roomId,
			});

			onNewRoomCreated();
		} catch (_) {}
	}, [onNewRoomCreated, realtimeClient, setRoom]);

	return (
		<div className="flex flex-col gap-2">
			<button onClick={onNewRoomClick}>New Room</button>
			<button onClick={onJoinRoomClick}>Join Room</button>
			<button onClick={onLoadClick}>Load</button>
		</div>
	);
};
