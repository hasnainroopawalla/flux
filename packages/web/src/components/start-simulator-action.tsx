import type * as React from "react";
import { SimulatorApp } from "@flux/simulator";
import { useEffectOnce } from "../utils";

type StartSimulatorActionProps = {
	canvas: HTMLCanvasElement;
	sessionId: string;
	onSimulatorAppStartSuccess: (simulatorApp: SimulatorApp) => void;
	onSimulatorAppStartFailure: (simulatorApp: SimulatorApp) => void;
};

export const StartSimulatorAction: React.FC<StartSimulatorActionProps> = ({
	canvas,
	sessionId,
	onSimulatorAppStartSuccess,
	onSimulatorAppStartFailure,
}) => {
	useEffectOnce(() => {
		const simulatorApp = new SimulatorApp({ canvas, sessionId });
		simulatorApp
			.start()
			.then(() => {
				onSimulatorAppStartSuccess(simulatorApp);
			})
			.catch(() => {
				onSimulatorAppStartFailure(simulatorApp);
			});

		// TODO: cleanup and stop simulator
		return () => {
			//simulatorApp.stop()
		};
	});

	return null;
};
