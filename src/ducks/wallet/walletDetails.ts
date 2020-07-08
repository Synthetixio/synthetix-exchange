import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';

import { LOCAL_STORAGE_KEYS } from 'constants/storage';

import { setSigner } from 'utils/snxJSConnector';
import { getAddress } from 'utils/formatters';
import { defaultNetwork } from 'utils/networkUtils';
import { RootState } from 'ducks/types';

export type WalletDetailsSliceState = {
	walletType: string;
	unlocked: boolean;
	currentWallet: string | null;
	unlockError: string | null;
	walletPaginatorIndex: number;
	availableWallets: string[];
	derivationPath: string | null;
	networkId: string | number;
	networkName: string;
};

const initialState: WalletDetailsSliceState = {
	walletType: '',
	unlocked: false,
	unlockError: null,
	walletPaginatorIndex: 0,
	availableWallets: [],
	currentWallet: null,
	derivationPath: localStorage.getItem(LOCAL_STORAGE_KEYS.WALLET_DERIVATION_PATH),
	networkId: defaultNetwork.networkId,
	networkName: defaultNetwork.name,
};

const sliceName = 'walletDetails';

export const walletDetailsSlice = createSlice({
	name: sliceName,
	initialState,
	reducers: {
		resetWalletReducer: () => {
			return initialState;
		},
		updateWalletReducer: (state, action: PayloadAction<Partial<WalletDetailsSliceState>>) => {
			const { payload } = action;

			return {
				...state,
				...payload,
				currentWallet: payload.currentWallet
					? getAddress(payload.currentWallet)
					: state.currentWallet,
			};
		},
		updateWalletPaginatorIndex: (state, action: PayloadAction<number>) => {
			state.walletPaginatorIndex = action.payload;
		},
		updateNetworkSettings: (
			state,
			action: PayloadAction<{
				networkId: string | number;
				networkName: string;
			}>
		) => {
			const { networkId, networkName } = action.payload;

			state.networkId = networkId;
			state.networkName = networkName;
		},
		setDerivationPath: (
			state,
			action: PayloadAction<{
				signerOptions: {
					type: string;
					networkId: string;
					derivationPath: string;
					networkName: string;
				};
				derivationPath: string;
			}>
		) => {
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

export const getWalletState = (state: RootState) => state.wallet[sliceName];
export const getNetworkId = (state: RootState) => getWalletState(state).networkId;
export const getNetworkName = (state: RootState) => getWalletState(state).networkName;
export const getNetwork = (state: RootState) => ({
	networkId: getNetworkId(state),
	networkName: getNetworkName(state),
});
export const getCurrentWalletAddress = (state: RootState) => getWalletState(state).currentWallet;
export const getIsWalletConnected = createSelector(getCurrentWalletAddress, (currentWallet) =>
	currentWallet != null ? true : false
);
export const getWalletInfo = (state: RootState) => getWalletState(state);

export const {
	updateNetworkSettings,
	resetWalletReducer,
	updateWalletReducer,
	setDerivationPath,
	updateWalletPaginatorIndex,
} = walletDetailsSlice.actions;

export default walletDetailsSlice.reducer;
