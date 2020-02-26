import { createSlice } from '@reduxjs/toolkit';
import snxJSConnector from '../utils/snxJSConnector';
import { bigNumberFormatter, parseBytes32String } from '../utils/formatters';

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
	},
});

export const getRatesState = state => state.rates;
export const getIsLoadingRates = state => getRatesState(state).isLoading;
export const getIsRefreshingRates = state => getRatesState(state).isRefreshing;
export const getIsLoadedRates = state => getRatesState(state).isLoaded;
export const getRatesLoadingError = state => getRatesState(state).loadingError;
export const getRatesExchangeRates = state => getRatesState(state).exchangeRates;
export const getEthRate = state => {
	const exchangeRates = getRatesState(state).exchangeRates;
	if (!exchangeRates) return null;
	return exchangeRates['sETH'];
};

const { fetchRatesRequest, fetchRatesSuccess, fetchRatesFailure } = ratesSlice.actions;

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
