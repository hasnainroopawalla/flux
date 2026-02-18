import type * as React from "react";
import { NewRoomButton, JoinRoomButton } from "./main-menu-buttons";

type MainMenuProps = {
	onNewRoomCreated: () => void;
	onRoomJoined: () => void;
	onLoadClick: () => void;
};

export const MainMenu: React.FC<MainMenuProps> = ({
	onNewRoomCreated,
	onRoomJoined,
	onLoadClick,
}) => {
	return (
		<div className="flex flex-col items-center gap-8">
			<Header />
			<div className="flex flex-col gap-2 w-56">
				<NewRoomButton onNewRoomCreated={onNewRoomCreated} />
				<JoinRoomButton onRoomJoined={onRoomJoined} />
				<button
					onClick={onLoadClick}
					className="cursor-pointer w-full rounded-xl bg-white/5 px-4 py-2.5 text-sm text-white/80 ring-1 ring-white/10 hover:bg-white/10 hover:text-white transition"
				>
					Load
				</button>
			</div>
		</div>
	);
};

const Header: React.FC = () => {
	return (
		<div className="flex flex-col items-center gap-1">
			<h1 className="text-2xl font-semibold text-white tracking-wide">flux</h1>
			<p className="text-sm text-white/40">Digital Logic Simulator</p>
		</div>
	);
};
