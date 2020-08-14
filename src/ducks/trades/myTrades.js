import { all, takeLatest, put, select } from 'redux-saga/effects';
import { createSlice } from '@reduxjs/toolkit';
import snxData from 'synthetix-data';
import { SYNTHS_MAP } from 'constants/currency';

import { normalizeTrades } from './utils';

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
		fetchMyTradesRequest: (state) => {
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

export const getMyTradesState = (state) => state.trades.myTrades;
export const getIsLoadingMyTrades = (state) => getMyTradesState(state).isLoading;
export const getIsRefreshingMyTrades = (state) => getMyTradesState(state).isRefreshing;
export const getIsLoadedMyTrades = (state) => getMyTradesState(state).isLoaded;
export const getMyTradesLoadingError = (state) => getMyTradesState(state).loadingError;
export const getMyTrades = (state) => getMyTradesState(state).trades;

const { fetchMyTradesRequest, fetchMyTradesSuccess, fetchMyTradesFailure } = myTradesSlice.actions;

const MAX_TRADES = 100;

function* fetchMyTrades() {
	const currentWalletAddress = yield select(getCurrentWalletAddress);

	if (!currentWalletAddress) {
		yield put(fetchMyTradesFailure({ error: 'you need to be connected to a wallet' }));
	} else {
		try {
			const [trades, settledTrades] = yield all([
				snxData.exchanges.since({
					fromAddress: currentWalletAddress,
					maxBlock: Number.MAX_SAFE_INTEGER,
					max: MAX_TRADES,
				}),
				snxData.exchanger.exchangeEntriesSettled({
					from: currentWalletAddress,
					max: MAX_TRADES,
				}),
			]);

			const normalizedTrades = normalizeTrades(trades);

			normalizedTrades.forEach((trade, idx) => {
				// if the input size gets large, a binary search could be used.
				const settledTrade = settledTrades.find(
					(settledTrade) =>
						trade.timestamp === settledTrade.exchangeTimestamp &&
						settledTrade.dest === trade.toCurrencyKey &&
						settledTrade.src === trade.fromCurrencyKey &&
						trade.fromAmount === settledTrade.amount
				);

				normalizedTrades[idx].isSettled = false;

				if (settledTrade) {
					normalizedTrades[idx].rebate = settledTrade.rebate;
					normalizedTrades[idx].reclaim = settledTrade.reclaim;

					// special case for when the currency is priced in sUSD
					const feeReclaimRebateAmount =
						trade.toCurrencyKey === SYNTHS_MAP.sUSD
							? settledTrade.rebate - settledTrade.reclaim
							: settledTrade.reclaim - settledTrade.rebate;

					// ( shiftAmount / amount ) * price -> gets us the price shift
					// to get the new price, we just add the price shift (which might be a negative or positive number)
					normalizedTrades[idx].settledPrice =
						(feeReclaimRebateAmount / trade.toAmount) * trade.price + trade.price;
					normalizedTrades[idx].isSettled = true;
					normalizedTrades[idx].amount = feeReclaimRebateAmount;
				}
			});

			yield put(fetchMyTradesSuccess({ trades: normalizedTrades }));
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
