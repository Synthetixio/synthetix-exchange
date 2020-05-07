import { takeLatest, put } from 'redux-saga/effects';
import { createSlice, createSelector } from '@reduxjs/toolkit';
import get from 'lodash/get';
import snxData from 'synthetix-data';
import { SYNTHS_MAP } from 'src/constants/currency';

import { getHoldersData } from '../holders';
import { getAddress } from 'src/utils/formatters';

export const allTradesSlice = createSlice({
	name: 'allTrades',
	initialState: {
		trades: [],
		lastUpdated: null,
		loadingError: null,
		isLoading: false,
		isLoaded: false,
		isRefreshing: false,
	},
	reducers: {
		fetchAllTradesRequest: state => {
			state.loadingError = null;
			state.isLoading = true;
			if (state.isLoaded) {
				state.isRefreshing = true;
			}
		},
		fetchAllTradesFailure: (state, action) => {
			state.loadingError = action.payload.error;
			state.isLoading = false;
			state.isRefreshing = false;
		},
		fetchAllTradesSuccess: (state, action) => {
			const { trades } = action.payload;

			state.trades = trades;
			state.lastUpdated = Date.now();
			state.isLoading = false;
			state.isRefreshing = false;
			state.isLoaded = true;
		},
	},
});

export const getAllTradesState = state => state.trades.allTrades;
export const getIsLoadingAllTrades = state => getAllTradesState(state).isLoading;
export const getIsRefreshingAllTrades = state => getAllTradesState(state).isRefreshing;
export const getIsLoadedAllTrades = state => getAllTradesState(state).isLoaded;
export const getAllTradesLoadingError = state => getAllTradesState(state).loadingError;
export const getAllTrades = state => getAllTradesState(state).trades;

export const getAllTradesWithTwitterHandles = createSelector(
	getAllTrades,
	getHoldersData,
	(trades, holdersData) =>
		holdersData.total > 0
			? trades.map(trade => ({
					...trade,
					twitterHandle: get(holdersData.byAddress, [
						getAddress(trade.fromAddress),
						'twitterHandle',
					]),
			  }))
			: trades
);

const {
	fetchAllTradesRequest,
	fetchAllTradesSuccess,
	fetchAllTradesFailure,
} = allTradesSlice.actions;

function* fetchAllTrades() {
	try {
		const transactions = yield snxData.exchanges.since({
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

		yield put(fetchAllTradesSuccess({ trades }));
	} catch (e) {
		yield put(fetchAllTradesFailure({ error: e.message }));
	}
}

export function* watchFetchAllTradesRequest() {
	yield takeLatest(fetchAllTradesRequest.type, fetchAllTrades);
}

export default allTradesSlice.reducer;

export { fetchAllTradesRequest };
