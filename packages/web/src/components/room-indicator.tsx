import type * as React from "react";
import { useRoom } from "../contexts/room-context";

export const RoomIndicator: React.FC = () => {
	const { room } = useRoom();

	if (!room) {
		return null;
	}

	return (
		<div className="fixed top-0 right-0 flex justify-center p-1 pointer-events-none">
			<div className="flex items-center gap-2 px-2 py-1 text-xs text-gray-300 rounded pointer-events-auto bg-black/40 backdrop-blur">
				<span className="text-[10px] text-white">
					🟢 {room.role} • {room.roomId}
				</span>
			</div>
		</div>
	);
};
