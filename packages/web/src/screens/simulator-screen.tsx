import type { SimulatorApp } from "@digital-logic-sim/simulator";
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

export const SimulatorScreen: React.FC = () => {
	const [simulatorApp, setSimulatorApp] = React.useState<SimulatorApp | null>(
		null,
	);

	const [canvas, setCanvas, canvasRef] = useStateRef<HTMLCanvasElement | null>(
		null,
	);

	const [startSimError, setStartSimError] = React.useState<boolean>(false);

	return startSimError ? (
		<WebGpuErrorBanner />
	) : (
		<>
			<SimulatorCanvas canvasRef={canvasRef} onCanvasReady={setCanvas} />

			{canvas && !simulatorApp && (
				<StartSimulatorAction
					canvas={canvas}
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
