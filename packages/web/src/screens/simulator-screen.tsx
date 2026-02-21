import type { SimulatorApp } from "@flux/simulator";
import React from "react";
import { Dialog } from "../components/dialog";
import { Popover } from "../components/popover";
import {
	SimulatorCanvas,
	SimulatorOverlayView,
} from "../components/simulator-canvas";
import { StartSimulatorAction } from "../components/start-simulator-action";
import { Toolbar } from "../components/toolbar";
import { WebGpuErrorBanner } from "../components/webgpu-error-banner";
import { SettingsProvider } from "../contexts/settings-context";
import { SimulatorAppProvider } from "../contexts/simulator-app-context";
import { useStateRef } from "../utils";
import { MultiplayerBridge } from "../components/multiplayer-bridge";
import { useRealtimeClient } from "../contexts/realtime-client-context";

export const SimulatorScreen: React.FC = () => {
	const [simulatorApp, setSimulatorApp] = React.useState<SimulatorApp | null>(
		null,
	);

	const [canvas, setCanvas, canvasRef] = useStateRef<HTMLCanvasElement | null>(
		null,
	);

	const [startSimError, setStartSimError] = React.useState<boolean>(false);

	const { realtimeClient } = useRealtimeClient();

	return startSimError ? (
		<WebGpuErrorBanner />
	) : (
		<>
			<SimulatorCanvas canvasRef={canvasRef} onCanvasReady={setCanvas} />

			{canvas && !simulatorApp && realtimeClient.sessionId && (
				<StartSimulatorAction
					canvas={canvas}
					sessionId={realtimeClient.sessionId}
					onSimulatorAppStartSuccess={setSimulatorApp}
					onSimulatorAppStartFailure={() => setStartSimError(true)}
				/>
			)}

			{simulatorApp && (
				<SimulatorAppProvider simulatorApp={simulatorApp}>
					<SettingsProvider>
						<MultiplayerBridge />
						<Toolbar />
						<SimulatorOverlayView />
						<Dialog />
						<Popover />
					</SettingsProvider>
				</SimulatorAppProvider>
			)}
		</>
	);
};
