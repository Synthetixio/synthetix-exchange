import { createSlice, createSelector } from '@reduxjs/toolkit';

import { Wallet } from '@ethersproject/wallet';
import { LOCAL_STORAGE_KEYS } from 'src/constants/storage';

import { setSigner } from '../../utils/snxJSConnector';
import { getAddress } from '../../utils/formatters';
import { defaultNetwork } from '../../utils/networkUtils';

let account = localStorage.getItem(LOCAL_STORAGE_KEYS.L2_ACCOUNT);

if (account == null) {
	account = Wallet.createRandom().mnemonic;
	localStorage.setItem(LOCAL_STORAGE_KEYS.L2_ACCOUNT, account.phrase);
}

const wallet = Wallet.fromMnemonic(account);

const initialState = {
	wallet,
	twitterUsername: '',
	walletType: '',
	unlocked: true,
	unlockError: null,
	walletPaginatorIndex: 0,
	availableWallets: [],
	currentWallet: wallet.address,
	derivationPath: localStorage.getItem(LOCAL_STORAGE_KEYS.WALLET_DERIVATION_PATH),
	networkId: defaultNetwork.networkId,
	networkName: defaultNetwork.name,
};

export const walletDetailsSlice = createSlice({
	name: 'walletDetails',
	initialState,
	reducers: {
		resetWalletReducer: () => {
			return initialState;
		},
		updateWalletReducer: (state, action) => {
			const { payload } = action;

			return {
				...state,
				...payload,
				currentWallet: payload.currentWallet
					? getAddress(payload.currentWallet)
					: state.currentWallet,
			};
		},
		updateWalletPaginatorIndex: (state, action) => {
			state.walletPaginatorIndex = action.payload;
		},
		updateNetworkSettings: (state, action) => {
			const { networkId, networkName } = action.payload;

			state.networkId = networkId;
			state.networkName = networkName;
		},
		setDerivationPath: (state, action) => {
			const { signerOptions, derivationPath } = action.payload;

			/* TODO: move this side effect to a saga */
			setSigner(signerOptions);
			localStorage.setItem(LOCAL_STORAGE_KEYS.WALLET_DERIVATION_PATH, derivationPath);

			state.derivationPath = derivationPath;
			state.availableWallets = [];
			state.walletPaginatorIndex = 0;
		},
	},
});

export const getWalletState = state => state.wallet.walletDetails;
export const getNetworkId = state => getWalletState(state).networkId;
export const getNetworkName = state => getWalletState(state).networkName;
export const getNetwork = state => ({
	networkId: getNetworkId(state),
	networkName: getNetworkName(state),
});
export const getCurrentWalletAddress = state => getWalletState(state).currentWallet;
export const getIsLoggedIn = createSelector(getCurrentWalletAddress, currentWallet =>
	currentWallet != null ? true : false
);
export const getTwitterUsername = state => getWalletState(state).twitterUsername;
export const getWalletInfo = state => getWalletState(state);

const {
	addAvailableWallets,
	updateNetworkSettings,
	resetWalletReducer,
	updateWalletReducer,
	setDerivationPath,
	updateWalletPaginatorIndex,
} = walletDetailsSlice.actions;

export {
	addAvailableWallets,
	updateNetworkSettings,
	setDerivationPath,
	resetWalletReducer,
	updateWalletReducer,
	updateWalletPaginatorIndex,
};

export default walletDetailsSlice.reducer;
