import { takeLatest, put, select } from 'redux-saga/effects';
import { createSlice } from '@reduxjs/toolkit';
import snxData from 'synthetix-data';

import { SYNTHS_MAP } from 'constants/currency';

import { getCurrentWalletAddress } from '../wallet/walletDetails';

export const myTradesSlice = createSlice({
	name: 'myTrades',
	initialState: {
		trades: [],
		lastUpdated: null,
		loadingError: null,
		isLoading: false,
		isLoaded: false,
		isRefreshing: false,
	},
	reducers: {
		fetchMyTradesRequest: state => {
			state.loadingError = null;
			state.isLoading = true;
			if (state.isLoaded) {
				state.isRefreshing = true;
			}
		},
		fetchMyTradesFailure: (state, action) => {
			state.loadingError = action.payload.error;
			state.isLoading = false;
			state.isRefreshing = false;
		},
		fetchMyTradesSuccess: (state, action) => {
			const { trades } = action.payload;

			state.trades = trades;
			state.lastUpdated = Date.now();
			state.isLoading = false;
			state.isRefreshing = false;
			state.isLoaded = true;
		},
	},
});

export const getMyTradesState = state => state.trades.myTrades;
export const getIsLoadingMyTrades = state => getMyTradesState(state).isLoading;
export const getIsRefreshingMyTrades = state => getMyTradesState(state).isRefreshing;
export const getIsLoadedMyTrades = state => getMyTradesState(state).isLoaded;
export const getMyTradesLoadingError = state => getMyTradesState(state).loadingError;
export const getMyTrades = state => getMyTradesState(state).trades;

const { fetchMyTradesRequest, fetchMyTradesSuccess, fetchMyTradesFailure } = myTradesSlice.actions;

function* fetchMyTrades() {
	const currentWalletAddress = yield select(getCurrentWalletAddress);

	if (!currentWalletAddress) {
		yield put(fetchMyTradesFailure({ error: 'you need to be connected to a wallet' }));
	} else {
		try {
			const transactions = yield snxData.exchanges.since({
				fromAddress: currentWalletAddress,
				maxBlock: Number.MAX_SAFE_INTEGER,
				max: 100,
			});

			const trades = transactions.map(tx => ({
				...tx,
				price:
					tx.toCurrencyKey === SYNTHS_MAP.sUSD
						? tx.fromAmountInUSD / tx.fromAmount
						: tx.toAmountInUSD / tx.toAmount,
				amount: tx.toCurrencyKey === SYNTHS_MAP.sUSD ? tx.fromAmountInUSD : tx.toAmountInUSD,
			}));

			yield put(fetchMyTradesSuccess({ trades }));
		} catch (e) {
			yield put(fetchMyTradesFailure({ error: e.message }));
		}
	}
}

export function* watchFetchMyTradesRequest() {
	yield takeLatest(fetchMyTradesRequest.type, fetchMyTrades);
}

export default myTradesSlice.reducer;

export { fetchMyTradesRequest };
