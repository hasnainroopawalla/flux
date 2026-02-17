import * as React from "react";
import { DialogProvider } from "./dialog";
import { Footer } from "./footer";
import { MainMenuScreen } from "../screens/main-menu-screen";
import { SimulatorScreen } from "../screens/simulator-screen";
import { RoomIndicator } from "./room-indicator";
import { RoomProvider } from "../contexts/room-context";
import { RealtimeClientProvider } from "../contexts/realtime-client-context";
import { config } from "../config";

enum ScreenType {
	MainMenu,
	Simulator,
}

const App: React.FC = () => {
	const [screen, setScreen] = React.useState<ScreenType>(ScreenType.MainMenu);

	const transitionToSimulatorScreen = React.useCallback(() => {
		setScreen(ScreenType.Simulator);
	}, []);

	switch (screen) {
		case ScreenType.MainMenu:
			return (
				<MainMenuScreen
					onNewRoomCreated={transitionToSimulatorScreen}
					onRoomJoined={transitionToSimulatorScreen}
					onLoadClick={() => {}}
				/>
			);
		case ScreenType.Simulator:
			return <SimulatorScreen />;
	}
};

export const ContextualApp: React.FC = () => {
	return (
		<DialogProvider>
			<RealtimeClientProvider socketUrl={config.realtimeClientSocketUrl}>
				<RoomProvider>
					<App />
					<Footer />
					<RoomIndicator />
				</RoomProvider>
			</RealtimeClientProvider>
		</DialogProvider>
	);
};
