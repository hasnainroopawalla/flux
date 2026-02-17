import * as React from "react";
import { RealtimeClient } from "../realtime-client";
import { config } from "../config";

type RealtimeContextValue = {
	realtimeClient: RealtimeClient;
};

const RealtimeContext = React.createContext<RealtimeContextValue>(
	{} as RealtimeContextValue,
);

export const RealtimeClientProvider = ({
	children,
}: React.PropsWithChildren) => {
	const realtimeClient = React.useMemo(
		() => new RealtimeClient(config.realtimeClientSocketUrl),
		[],
	);

	return (
		<RealtimeContext.Provider value={{ realtimeClient }}>
			{children}
		</RealtimeContext.Provider>
	);
};

export const useRealtimeClient = (): RealtimeContextValue =>
	React.useContext(RealtimeContext);
