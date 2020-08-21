import { PayloadAction, createSlice, createSelector } from '@reduxjs/toolkit';
import { takeLatest, put, all } from 'redux-saga/effects';
import set from 'lodash/set';
import get from 'lodash/get';
import merge from 'lodash/merge';
import chunk from 'lodash/chunk';

import { CurrencyKey, CurrencyKeys } from 'constants/currency';
import { RateUpdates } from 'constants/rates';
import { Period, PERIOD_IN_HOURS } from 'constants/period';
import { fetchSynthRateUpdate } from 'services/rates/rates';

import { RootState } from './types';

export type HistoricalRatesData = {
	rates: RateUpdates;
	low: number;
	high: number;
	change: number;
};

export type HistoricalRates = {
	data: HistoricalRatesData;
	isLoaded: boolean;
	isLoading: boolean;
	isRefreshing: boolean;
	lastUpdated: number;
	loadingError: string;
};

export type HistoricalRatesSliceState = Record<
	CurrencyKey,
	Record<Period, Partial<HistoricalRates>>
>;

const sliceName = 'historicalRates';

const initialState: HistoricalRatesSliceState = {};

export const historicalRatesSlice = createSlice({
	name: sliceName,
	initialState,
	reducers: {
		fetchHistoricalRatesRequest: (
			state,
			action: PayloadAction<{ currencyKeys: CurrencyKeys; periods: Period[] }>
		) => {
			const { currencyKeys, periods } = action.payload;

			currencyKeys.forEach((currencyKey) => {
				periods.forEach((period) => {
					set(
						state,
						[currencyKey, period],
						merge(get(state, [currencyKey, period], {}), {
							loadingError: null,
							isLoading: true,
						})
					);
				});
			});
		},
		fetchHistoricalRateFailure: (
			state,
			action: PayloadAction<{ currencyKey: CurrencyKey; period: Period; error: string }>
		) => {
			const { currencyKey, period, error } = action.payload;

			set(
				state,
				[currencyKey, period],
				merge(get(state, [currencyKey, period], {}), {
					loadingError: error,
					isLoading: false,
					isRefreshing: false,
				})
			);
		},
		fetchHistoricalRateSuccess: (
			state,
			action: PayloadAction<{
				currencyKey: CurrencyKey;
				period: Period;
				data: HistoricalRatesData;
			}>
		) => {
			const { currencyKey, period, data } = action.payload;

			set(
				state,
				[currencyKey, period],
				merge(get(state, [currencyKey, period], {}), {
					data,
					isLoading: false,
					isRefreshing: false,
					isLoaded: true,
				})
			);
		},
	},
});

export const {
	fetchHistoricalRatesRequest,
	fetchHistoricalRateFailure,
	fetchHistoricalRateSuccess,
} = historicalRatesSlice.actions;

export const getHistoricalRatesState = (state: RootState) => state[sliceName];
export const getHistoricalRatesList = createSelector(
	getHistoricalRatesState,
	(historicalRatesState) => Object.values(historicalRatesState)
);

export const getHistoricalRatesIsOneDayPeriodLoaded = createSelector(
	getHistoricalRatesList,
	(historicalRatesList) =>
		historicalRatesList.length > 0 && historicalRatesList.every((rate) => rate.ONE_DAY.isLoaded)
);

function* fetchHistoricalRate(currencyKey: CurrencyKey, period: Period) {
	try {
		const ratesData = yield fetchSynthRateUpdate(currencyKey, PERIOD_IN_HOURS[period]);
		yield put(
			fetchHistoricalRateSuccess({
				currencyKey,
				data: ratesData,
				period,
			})
		);
	} catch (e) {
		yield put(
			fetchHistoricalRateFailure({
				currencyKey,
				period,
				error: e,
			})
		);
	}
}

const MAX_CONCURRENT_REQUESTS = 30;

function* fetchHistoricalRates(
	action: PayloadAction<{ currencyKeys: CurrencyKeys; periods: Period[] }>
) {
	const { currencyKeys, periods } = action.payload;
	const chunks = chunk(currencyKeys, MAX_CONCURRENT_REQUESTS);

	for (const period of periods) {
		for (const chunk of chunks) {
			yield all(chunk.map((currencyKey) => fetchHistoricalRate(currencyKey, period)));
		}
	}
}

export function* watchFetchHistoricalRatesRequest() {
	yield takeLatest(fetchHistoricalRatesRequest.type, fetchHistoricalRates);
}

export default historicalRatesSlice.reducer;
