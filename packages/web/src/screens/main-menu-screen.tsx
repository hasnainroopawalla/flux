import type * as React from "react";
import { MainMenu } from "../components/main-menu";

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
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-neutral-900">
			<MainMenu
				onNewRoomCreated={onNewRoomCreated}
				onRoomJoined={onRoomJoined}
				onLoadClick={onLoadClick}
			/>
		</div>
	);
};
