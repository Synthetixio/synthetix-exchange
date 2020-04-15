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
	twitterFaucet: 0,
	twitterId: null,
	twitterHandle: null,
	permissionSignature: null,
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

export const balances = {
	synths: {
		balances: {
			sBTC: {
				balance: 0.000628320060412509,
				usdBalance: 6.50700536879026,
			},
		},
		usdBalance: 6.50700536879026,
	},
	eth: {
		balance: 0.04243316499453552,
		usdBalance: 11.380247270217652,
	},
};

export const loggedInUserWithBalances = {
	...loggedInUser,
	balances,
};
