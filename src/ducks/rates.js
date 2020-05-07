import { createSlice, createSelector } from '@reduxjs/toolkit';
import get from 'lodash/get';

import snxJSConnector from '../utils/snxJSConnector';
import { bigNumberFormatter, parseBytes32String } from '../utils/formatters';
import { SYNTHS_MAP } from '../constants/currency';

export const ratesSlice = createSlice({
	name: 'rates',
	initialState: {
		exchangeRates: null,
		loadingError: null,
		isLoading: false,
		isLoaded: false,
		isRefreshing: false,
		isRefreshed: false,
	},
	reducers: {
		fetchRatesRequest: state => {
			state.loadingError = null;
			state.isLoading = true;
			if (state.isLoaded) {
				state.isRefreshing = true;
			}
		},
		fetchRatesFailure: (state, action) => {
			state.loadingError = action.payload.error;
			state.isLoading = false;
			state.isRefreshing = false;
		},
		fetchRatesSuccess: (state, action) => {
			state.exchangeRates = action.payload.exchangeRates;
			state.isLoading = false;
			state.isRefreshing = false;
			state.isLoaded = true;
		},
		updateRate: (state, action) => {
			if (state.exchangeRates && state.exchangeRates[action.payload.synth]) {
				state.exchangeRates[action.payload.synth] = action.payload.rate;
			}
		},
	},
});

export const getRatesState = state => state.rates;
export const getIsLoadingRates = state => getRatesState(state).isLoading;
export const getIsRefreshingRates = state => getRatesState(state).isRefreshing;
export const getIsLoadedRates = state => getRatesState(state).isLoaded;
export const getRatesLoadingError = state => getRatesState(state).loadingError;
export const getRatesExchangeRates = state => getRatesState(state).exchangeRates;
export const getEthRate = createSelector(getRatesExchangeRates, exchangeRates =>
	get(exchangeRates, SYNTHS_MAP.sETH, null)
);

export const {
	updateRate,
	fetchRatesRequest,
	fetchRatesSuccess,
	fetchRatesFailure,
} = ratesSlice.actions;

export const fetchRates = () => async dispatch => {
	const { synthSummaryUtilContract } = snxJSConnector;

	dispatch(fetchRatesRequest());

	try {
		let exchangeRates = {};
		const [keys, rates] = await synthSummaryUtilContract.synthsRates();
		keys.forEach((key, i) => {
			const synthName = parseBytes32String(key);
			exchangeRates[synthName] = bigNumberFormatter(rates[i]);
		});
		dispatch(fetchRatesSuccess({ exchangeRates }));
	} catch (e) {
		dispatch(fetchRatesFailure({ error: e.message }));
	}
};

export default ratesSlice.reducer;
