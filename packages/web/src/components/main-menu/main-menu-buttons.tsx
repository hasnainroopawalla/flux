import * as React from "react";
import { ParticipantRole, useRoom } from "../../contexts/room-context";

export const NewRoomButton: React.FC<{ onNewRoomCreated: () => void }> = ({
	onNewRoomCreated,
}) => {
	const { setRoom, createRoom } = useRoom();

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

	return (
		<button
			onClick={createNewRoom}
			className="cursor-pointer w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm  text-white hover:bg-blue-500 transition"
		>
			New Room
		</button>
	);
};

export const JoinRoomButton: React.FC<{ onRoomJoined: () => void }> = ({
	onRoomJoined,
}) => {
	const [joiningRoom, setJoiningRoom] = React.useState(false);
	const inputRef = React.useRef<HTMLInputElement>(null);

	const { setRoom, joinRoom } = useRoom();

	const requestJoinRoom = React.useCallback(async () => {
		const roomCode = inputRef.current?.value.trim();
		if (!roomCode) {
			return;
		}
		try {
			await joinRoom(roomCode);

			setRoom({
				role: ParticipantRole.Member,
				roomId: roomCode,
			});

			onRoomJoined();
		} catch (_) {}
	}, [onRoomJoined, setRoom, joinRoom]);

	return joiningRoom ? (
		<div className="flex gap-1.5">
			<input
				ref={inputRef}
				placeholder="Room code"
				autoFocus
				className="min-w-0 flex-1 rounded-xl bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 ring-1 ring-white/10 focus:outline-none focus:ring-blue-500"
			/>
			<button
				onClick={requestJoinRoom}
				className="cursor-pointer rounded-xl bg-blue-600 px-3 py-2.5 text-sm text-white hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition"
			>
				Join
			</button>
		</div>
	) : (
		<button
			onClick={() => setJoiningRoom(true)}
			className="cursor-pointer w-full rounded-xl bg-white/5 px-4 py-2.5 text-sm text-white/80 ring-1 ring-white/10 hover:bg-white/10 hover:text-white transition"
		>
			Join Room
		</button>
	);
};
