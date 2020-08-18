import { NetworkId } from 'utils/networkUtils';

interface RequestArguments {
	method: string;
	params?: unknown[] | object;
}

declare global {
	interface Window {
		web3?: {
			eth?: {
				net: {
					getId: () => NetworkId;
				};
			};
			version: {
				getNetwork(cb: (err: Error | undefined, networkId: string) => void): void;
				network: NetworkId;
			};
		};
		ethereum?: {
			on: (event: string, cb: () => void) => void;
			networkVersion: NetworkId;
			request: (args: RequestArguments) => Promise<unknown>;
		};
	}
}
