import { takeLatest, put, all } from 'redux-saga/effects';
import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import orderBy from 'lodash/orderBy';
import merge from 'lodash/merge';
import { getMarketsAssetFilter } from './ui';

import { getRatesExchangeRates, Rates } from './rates';
import { getExchangeRatesForCurrencies } from 'utils/rates';

import { PERIOD_IN_HOURS } from 'constants/period';

import { fetchSynthRateUpdates, fetchSynthVolumeInUSD } from 'services/rates/rates';

import { getAvailableMarketNames, CurrencyKey } from 'constants/currency';
import { RootState } from './types';
import { HistoricalRatesData } from './historicalRates';

export type MarketPair = {
	pair: string;
	baseCurrencyKey: CurrencyKey;
	quoteCurrencyKey: CurrencyKey;
	lastPrice: number | null;
	rates: HistoricalRatesData[];
	rates24hChange: number | null;
	rates24hLow: number | null;
	rates24hHigh: number | null;
	rates24hVol: number | null;
	isLoaded: boolean;
	lastUpdated: number | null;
};

export type MarketPairsMap = Record<string, MarketPair>;
export type MarketPairs = MarketPair[];

const getMarketDefaults = (
	marketPairs: Array<Pick<MarketPair, 'baseCurrencyKey' | 'quoteCurrencyKey' | 'pair'>>
) =>
	marketPairs.reduce((markets: MarketPairsMap, marketPair) => {
		const { baseCurrencyKey, quoteCurrencyKey, pair } = marketPair;

		markets[pair] = {
			pair,
			baseCurrencyKey,
			quoteCurrencyKey,
			lastPrice: null,
			rates: [],
			rates24hChange: null,
			rates24hLow: null,
			rates24hHigh: null,
			rates24hVol: null,
			isLoaded: false,
			lastUpdated: null,
		};

		return markets;
	}, {});

export type MarketsSliceState = {
	markets: MarketPairsMap;
	loadingError: null | string;
	isLoading: boolean;
};

const sliceName = 'markets';

const initialState: MarketsSliceState = {
	markets: getMarketDefaults(getAvailableMarketNames()),
	loadingError: null,
	isLoading: false,
};

export const marketsSlice = createSlice({
	name: sliceName,
	initialState,
	reducers: {
		fetchMarketsRequest: (state) => {
			state.loadingError = null;
			state.isLoading = true;
		},
		fetchMarketsFailure: (state, action: PayloadAction<{ error: string }>) => {
			state.loadingError = action.payload.error;
			state.isLoading = false;
		},
		fetchMarketSuccess: (state, action: PayloadAction<{ market: Partial<MarketPair> }>) => {
			const { market } = action.payload;

			state.markets = merge(state.markets, market);
			state.isLoading = false;
		},
	},
});

export const getMarketsState = (state: RootState) => state[sliceName];
export const getMarketsMap = (state: RootState) => getMarketsState(state).markets;
export const getMarketsLoadingError = (state: RootState) => getMarketsState(state).loadingError;
export const getMarketsList = createSelector(getMarketsMap, (marketsMap) =>
	Object.values(marketsMap)
);

const mapExchangeRatesToMarkets = (markets: MarketPairs, exchangeRates: Rates | null) =>
	markets.map((market) => ({
		...market,
		lastPrice:
			exchangeRates == null
				? null
				: getExchangeRatesForCurrencies(
						exchangeRates,
						market.baseCurrencyKey,
						market.quoteCurrencyKey
				  ) || 0,
	}));

export const getFilteredMarkets = createSelector(
	getMarketsList,
	getMarketsAssetFilter,
	getRatesExchangeRates,
	(marketsList, assetFilter, exchangeRates) =>
		mapExchangeRatesToMarkets(
			marketsList.filter((market) => market.quoteCurrencyKey === assetFilter),
			exchangeRates
		)
);

export const getAllMarkets = createSelector(
	getMarketsList,
	getRatesExchangeRates,
	(marketsList, exchangeRates) => mapExchangeRatesToMarkets(marketsList, exchangeRates)
);

export const getIsLoadedFilteredMarkets = createSelector(getFilteredMarkets, (filteredMarkets) =>
	filteredMarkets.every((market) => market.isLoaded)
);

export const getOrderedMarkets = createSelector(
	getFilteredMarkets,
	getIsLoadedFilteredMarkets,
	(filteredMarkets, filteredMarketsLoaded) =>
		filteredMarketsLoaded ? orderBy(filteredMarkets, 'rates24hVol', 'desc') : filteredMarkets
);

const { fetchMarketsRequest, fetchMarketSuccess, fetchMarketsFailure } = marketsSlice.actions;

// @ts-ignore
function* fetchMarket(marketPair: MarketPair) {
	const { baseCurrencyKey, quoteCurrencyKey, pair } = marketPair;

	const [rates24H, volume24H] = yield all([
		fetchSynthRateUpdates(baseCurrencyKey, quoteCurrencyKey, PERIOD_IN_HOURS.ONE_DAY),
		fetchSynthVolumeInUSD(baseCurrencyKey, quoteCurrencyKey, PERIOD_IN_HOURS.ONE_DAY),
	]);

	const market = {
		rates: rates24H.rates,
		rates24hChange: rates24H.change,
		rates24hLow: rates24H.low,
		rates24hHigh: rates24H.high,
		rates24hVol: volume24H,
		isLoaded: true,
		lastUpdated: Date.now(),
	} as Partial<MarketPair>;

	yield put(fetchMarketSuccess({ market: { [pair]: market } }));
}

function* fetchMarkets(action: PayloadAction<{ pairs: MarketPairs }>) {
	const { pairs: marketPairs } = action.payload;

	try {
		yield all(marketPairs.map((marketPair) => fetchMarket(marketPair)));
	} catch (e) {
		yield put(fetchMarketsFailure({ error: e.message }));
	}
}

export function* watchFetchMarketsRequest() {
	yield takeLatest(fetchMarketsRequest.type, fetchMarkets);
}

export default marketsSlice.reducer;

export { fetchMarketsRequest };
