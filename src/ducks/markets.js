import { takeLatest, put } from 'redux-saga/effects';
import { createSlice, createSelector } from '@reduxjs/toolkit';
import orderBy from 'lodash/orderBy';
import merge from 'lodash/merge';

import { getRatesExchangeRates } from './rates';
import { getExchangeRatesForCurrencies } from 'src/utils/rates';

import {
	fetchSynthRateUpdates,
	fetchSynthVolumeInUSD,
	PERIOD_IN_HOURS,
} from 'src/services/rates/rates';

import { PAIRS as SPLASH_MARKET_PAIRS } from 'src/pages/Home/Markets/constants';

export const marketsSlice = createSlice({
	name: 'markets',
	initialState: {
		markets: {},
		lastUpdated: null,
		loadingError: null,
		isLoading: false,
		isLoaded: false,
		isRefreshing: false,
	},
	reducers: {
		fetchMarketsRequest: state => {
			state.loadingError = null;
			state.isLoading = true;
			if (state.isLoaded) {
				state.isRefreshing = true;
			}
		},
		fetchMarketsFailure: (state, action) => {
			state.loadingError = action.payload.error;
			state.isLoading = false;
			state.isRefreshing = false;
		},
		fetchMarketsSuccess: (state, action) => {
			const { markets } = action.payload;

			state.markets = merge(state.markets, markets);
			state.lastUpdated = Date.now();
			state.isLoading = false;
			state.isRefreshing = false;
			state.isLoaded = true;
		},
	},
});

export const getMarketsState = state => state.markets;
export const getMarketsMap = state => getMarketsState(state).markets;
export const getIsLoadingMarkets = state => getMarketsState(state).isLoading;
export const getIsRefreshingMarkets = state => getMarketsState(state).isRefreshing;
export const getIsLoadedMarkets = state => getMarketsState(state).isLoaded;
export const getMarketsLoadingError = state => getMarketsState(state).loadingError;

export const getMarkets = createSelector(
	getMarketsMap,
	getRatesExchangeRates,
	(marketsMap, exchangeRates) =>
		Object.values(marketsMap).map(market => ({
			...market,
			lastPrice:
				exchangeRates == null
					? null
					: getExchangeRatesForCurrencies(
							exchangeRates,
							market.baseCurrencyKey,
							market.quoteCurrencyKey
					  ) || 0,
		}))
);

export const getMarketsForSplashPage = createSelector(getMarkets, markets =>
	orderBy(markets, 'rates24hVol', 'desc').slice(
		0,
		Math.min(SPLASH_MARKET_PAIRS.length, markets.length)
	)
);

const { fetchMarketsRequest, fetchMarketsSuccess, fetchMarketsFailure } = marketsSlice.actions;

function* fetchMarkets(action) {
	const { pairs } = action.payload;

	try {
		const markets = {};

		for (const pair of pairs) {
			const { baseCurrencyKey, quoteCurrencyKey } = pair;
			const rates24H = yield fetchSynthRateUpdates(
				baseCurrencyKey,
				quoteCurrencyKey,
				PERIOD_IN_HOURS.ONE_DAY
			);
			const volume24H = yield fetchSynthVolumeInUSD(
				baseCurrencyKey,
				quoteCurrencyKey,
				PERIOD_IN_HOURS.ONE_DAY
			);

			const marketPair = `${baseCurrencyKey}-${quoteCurrencyKey}`;

			markets[marketPair] = {
				pair: marketPair,
				baseCurrencyKey,
				quoteCurrencyKey,
				lastPrice: null,
				rates: rates24H.rates,
				rates24hChange: rates24H.change,
				rates24hLow: rates24H.low,
				rates24hHigh: rates24H.high,
				rates24hVol: volume24H,
				isLoaded: true,
			};
		}
		yield put({ type: fetchMarketsSuccess.type, payload: { markets } });
	} catch (e) {
		yield put({ type: fetchMarketsFailure.type, payload: { error: e.message } });
	}
}

export function* watchFetchMarketsRequest() {
	yield takeLatest(fetchMarketsRequest.type, fetchMarkets);
}

export default marketsSlice.reducer;

export { fetchMarketsRequest };
