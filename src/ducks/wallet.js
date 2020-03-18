import { createSlice, createSelector } from '@reduxjs/toolkit';
import { takeLatest, put, select } from 'redux-saga/effects';
import orderBy from 'lodash/orderBy';

import { LOCAL_STORAGE_KEYS } from 'src/constants/storage';
import { CRYPTO_CURRENCY_MAP } from 'src/constants/currency';

import { setSigner } from '../utils/snxJSConnector';
import { getAddress, toBigNumber } from '../utils/formatters';
import { defaultNetwork } from '../utils/networkUtils';

import { fetchSynthsBalance, fetchEthBalance } from '../dataFetcher';
import { getAvailableSynths } from './synths';

const initialState = {
	walletType: '',
	unlocked: false,
	unlockError: null,
	walletPaginatorIndex: 0,
	availableWallets: [],
	currentWallet: null,
	derivationPath: localStorage.getItem(LOCAL_STORAGE_KEYS.WALLET_DERIVATION_PATH),
	balances: null,
	networkId: defaultNetwork.networkId,
	networkName: defaultNetwork.name,
	// TODO: move balances into their own slice
	isFetchingWalletBalances: false,
	isRefreshingWalletBalances: false,
	isLoadedWalletBalances: false,
};

export const walletSlice = createSlice({
	name: 'wallet',
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
		fetchWalletBalancesRequest: state => {
			state.isFetchingWalletBalances = true;
			if (state.isLoadedWalletBalances) {
				state.isRefreshingWalletBalances = true;
			}
		},
		fetchWalletBalancesSuccess: (state, action) => {
			const { balances } = action.payload;

			state.balances = balances;
			state.isFetchingWalletBalances = false;
			state.isRefreshingWalletBalances = false;
			state.isLoadedWalletBalances = true;
		},
		fetchWalletBalancesFailure: state => {
			state.isFetchingWalletBalances = false;
		},
	},
});

export const getWalletState = state => state.wallet;
export const getNetworkId = state => getWalletState(state).networkId;
export const getNetworkName = state => getWalletState(state).networkName;
export const getNetwork = state => ({
	networkId: getNetworkId(state),
	networkName: getNetworkName(state),
});
export const getCurrentWalletAddress = state => getWalletState(state).currentWallet;
export const getWalletBalancesMap = state => getWalletState(state).balances;

export const getIsFetchingWalletBalances = state => getWalletState(state).isFetchingWalletBalances;
export const getIsRefreshingWalletBalances = state =>
	getWalletState(state).isRefreshingWalletBalances;
export const getIsLoadedWalletBalances = state => getWalletState(state).isLoadedWalletBalances;

export const getIsLoggedIn = createSelector(getCurrentWalletAddress, currentWallet =>
	currentWallet != null ? true : false
);

export const getTotalETHBalanceUSD = createSelector(getWalletBalancesMap, walletBalancesMap =>
	walletBalancesMap == null ? 0 : walletBalancesMap.eth.usdBalance
);

export const getTotalETHBalance = createSelector(getWalletBalancesMap, walletBalancesMap =>
	walletBalancesMap == null ? 0 : walletBalancesMap.eth.balance
);

export const getTotalSynthsBalanceUSD = createSelector(getWalletBalancesMap, walletBalancesMap =>
	walletBalancesMap == null ? 0 : walletBalancesMap.synths.usdBalance
);

export const getTotalWalletBalanceUSD = createSelector(
	getTotalETHBalanceUSD,
	getTotalSynthsBalanceUSD,
	(totalWalletETHBalanceUSD, totalSynthsBalanceUSD) =>
		toBigNumber(totalWalletETHBalanceUSD)
			.plus(totalSynthsBalanceUSD)
			.toNumber()
);

export const getWalletBalances = createSelector(getWalletBalancesMap, walletBalancesMap => {
	if (walletBalancesMap == null) {
		return [];
	}

	const { eth, synths } = walletBalancesMap;

	let assets = [];

	if (eth) {
		assets.push({
			...eth,
			name: CRYPTO_CURRENCY_MAP.ETH,
		});
	}

	return orderBy(
		Object.entries(synths.balances)
			.filter(([, walletBalance]) => walletBalance.balance > 0)
			.map(([currencyKey, walletBalance]) => ({
				...walletBalance,
				name: currencyKey,
				portfolioPercent: walletBalance.usdBalance / synths.usdBalance,
			}))
			.concat(assets),
		'usdBalance',
		'desc'
	);
});

// filter ETH from synth wallet balances
export const getSynthsWalletBalances = createSelector(getWalletBalances, walletBalances =>
	walletBalances.filter(asset => asset.name !== CRYPTO_CURRENCY_MAP.ETH)
);

const {
	addAvailableWallets,
	updateNetworkSettings,
	resetWalletReducer,
	updateWalletReducer,
	setDerivationPath,
	updateWalletPaginatorIndex,
	fetchWalletBalancesRequest,
	fetchWalletBalancesSuccess,
	fetchWalletBalancesFailure,
} = walletSlice.actions;

function* fetchWalletBalances() {
	const synths = yield select(getAvailableSynths);

	const currentWalletAddress = yield select(getCurrentWalletAddress);

	if (currentWalletAddress != null) {
		try {
			const [synthsBalance, ethBalance] = yield Promise.all([
				fetchSynthsBalance(currentWalletAddress, synths),
				fetchEthBalance(currentWalletAddress),
			]);

			const balances = { synths: synthsBalance, eth: ethBalance };

			yield put(fetchWalletBalancesSuccess({ balances }));

			return true;
		} catch (e) {
			yield put(fetchWalletBalancesFailure({ error: e.message }));

			return false;
		}
	}
	return false;
}

export function* watchFetchWalletBalancesRequest() {
	yield takeLatest(fetchWalletBalancesRequest.type, fetchWalletBalances);
}

export default walletSlice.reducer;

export {
	addAvailableWallets,
	updateNetworkSettings,
	setDerivationPath,
	resetWalletReducer,
	updateWalletReducer,
	updateWalletPaginatorIndex,
	fetchWalletBalancesRequest,
	fetchWalletBalancesSuccess,
	fetchWalletBalancesFailure,
};
