import { defaultNetwork } from '../../../src/utils/networkUtils';

export const walletReducerDefaults = {
	unlocked: false,
	unlockError: null,
	walletPaginatorIndex: 0,
	availableWallets: [],
	currentWallet: null,
	derivationPath: null,
	balances: null,
	networkId: defaultNetwork.networkId,
	networkName: defaultNetwork.name,
};

export const loggedOutUser = {
	...walletReducerDefaults,
};

export const loggedInUser = {
	...walletReducerDefaults,
	unlocked: true,
	currentWallet: '0x1BC4230d996286ffD1dD4DC649AAd47Fa08cadc4',
	walletType: 'Metamask',
};

export const loggedInUserWithBalances = {
	...loggedInUser,
	balances: {
		eth: {
			balance: 0.04243316499453552,
			usdBalance: 10.121873108624278,
		},
	},
};
