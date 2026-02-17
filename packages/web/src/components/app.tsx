import * as React from "react";
import { DialogProvider } from "./dialog";
import { Footer } from "./footer";
import { MainMenuScreen } from "../screens/main-menu-screen";
import { SimulatorScreen } from "../screens/simulator-screen";
import { RoomIndicator } from "./room-indicator";
import { RoomProvider } from "../contexts/room-context";
import { RealtimeClientProvider } from "../contexts/realtime-client-context";

enum ScreenType {
	MainMenu,
	Simulator,
}

const App: React.FC = () => {
	const [screen, setScreen] = React.useState<ScreenType>(ScreenType.MainMenu);

	switch (screen) {
		case ScreenType.MainMenu:
			return (
				<MainMenuScreen
					onNewRoomCreated={() => setScreen(ScreenType.Simulator)}
					onLoadClick={() => {}}
					onJoinRoomClick={() => {}}
				/>
			);
		case ScreenType.Simulator:
			return <SimulatorScreen />;
	}
};

export const ContextualApp: React.FC = () => {
	return (
		<DialogProvider>
			<RealtimeClientProvider>
				<RoomProvider>
					<App />
					<Footer />
					<RoomIndicator />
				</RoomProvider>
			</RealtimeClientProvider>
		</DialogProvider>
	);
};
