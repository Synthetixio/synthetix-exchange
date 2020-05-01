import { PayloadAction, createSlice, createSelector } from '@reduxjs/toolkit';
import { takeLatest, put, all } from 'redux-saga/effects';
import set from 'lodash/set';
import get from 'lodash/get';
import merge from 'lodash/merge';
import chunk from 'lodash/chunk';

import { CurrencyKey } from 'constants/currency';
import { RateUpdates } from 'constants/rates';
import { Period, PERIOD_IN_HOURS } from 'constants/period';
import { fetchSynthRateUpdate } from 'services/rates/rates';

import { RootState } from './types';
import { SynthDefinition } from './synths';

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
			action: PayloadAction<{ synths: SynthDefinition[]; periods: Period[] }>
		) => {
			const { synths, periods } = action.payload;

			synths.forEach((synth) => {
				periods.forEach((period) => {
					set(
						state,
						[synth.name, period],
						merge(get(state, [synth.name, period], {}), {
							loadingError: null,
							isLoading: true,
						})
					);
				});
			});
		},
		fetchHistoricalRateFailure: (
			state,
			action: PayloadAction<{ synth: SynthDefinition; period: Period; error: string }>
		) => {
			const { synth, period, error } = action.payload;

			set(
				state,
				[synth.name, period],
				merge(get(state, [synth.name, period], {}), {
					loadingError: error,
					isLoading: false,
					isRefreshing: false,
				})
			);
		},
		fetchHistoricalRateSuccess: (
			state,
			action: PayloadAction<{
				synth: SynthDefinition;
				period: Period;
				data: HistoricalRatesData;
			}>
		) => {
			const { synth, period, data } = action.payload;

			set(
				state,
				[synth.name, period],
				merge(get(state, [synth.name, period], {}), {
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

function* fetchHistoricalRate(synth: SynthDefinition, period: Period) {
	try {
		const ratesData = yield fetchSynthRateUpdate(synth.name, PERIOD_IN_HOURS[period]);
		yield put(
			fetchHistoricalRateSuccess({
				synth,
				data: ratesData,
				period,
			})
		);
	} catch (e) {
		yield put(
			fetchHistoricalRateFailure({
				synth,
				period,
				error: e,
			})
		);
	}
}

const MAX_CONCURRENT_REQUESTS = 30;

function* fetchHistoricalRates(
	action: PayloadAction<{ synths: SynthDefinition[]; periods: Period[] }>
) {
	const { synths, periods } = action.payload;
	const chunks = chunk(synths, MAX_CONCURRENT_REQUESTS);

	for (const period of periods) {
		for (const chunk of chunks) {
			yield all(chunk.map((synth) => fetchHistoricalRate(synth, period)));
		}
	}
}

export function* watchFetchHistoricalRatesRequest() {
	yield takeLatest(fetchHistoricalRatesRequest.type, fetchHistoricalRates);
}

export default historicalRatesSlice.reducer;
