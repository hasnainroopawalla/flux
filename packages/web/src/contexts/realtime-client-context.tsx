import * as React from "react";
import { RealtimeClient } from "../services/realtime-client";

type RealtimeClientContextValue = {
	realtimeClient: RealtimeClient;
};

type RealtimeClientProviderProps = {
	socketUrl: string;
};

const RealtimeClientContext = React.createContext<RealtimeClientContextValue>(
	{} as RealtimeClientContextValue,
);

export const RealtimeClientProvider = ({
	children,
	socketUrl,
}: React.PropsWithChildren<RealtimeClientProviderProps>) => {
	const realtimeClient = React.useMemo(
		() => new RealtimeClient(socketUrl),
		[socketUrl],
	);

	return (
		<RealtimeClientContext.Provider
			value={{
				realtimeClient,
			}}
		>
			{children}
		</RealtimeClientContext.Provider>
	);
};

export const useRealtimeClient = (): RealtimeClientContextValue =>
	React.useContext(RealtimeClientContext);
