import { takeLatest, put, all } from 'redux-saga/effects';
import { createSlice } from '@reduxjs/toolkit';
import snxData from 'synthetix-data';
import axios from 'axios';

import { L2_API_URL } from 'src/constants/l2';

import { calculateTimestampForPeriod } from 'src/services/rates/utils';

export const dashboardSlice = createSlice({
	name: 'dashboard',
	initialState: {
		data: {},
		lastUpdated: null,
		loadingError: null,
		isLoading: false,
		isLoaded: false,
		isRefreshing: false,
	},
	reducers: {
		fetchRequest: state => {
			state.loadingError = null;
			state.isLoading = true;
			if (state.isLoaded) {
				state.isRefreshing = true;
			}
		},
		fetchFailure: (state, action) => {
			state.loadingError = action.payload.error;
			state.isLoading = false;
			state.isRefreshing = false;
		},
		fetchSuccess: (state, action) => {
			const { data } = action.payload;

			state.data = data;
			state.lastUpdated = Date.now();
			state.isLoading = false;
			state.isRefreshing = false;
			state.isLoaded = true;
		},
	},
});

export const getDashboardState = state => state.dashboard;
export const getIsLoadingDashboard = state => getDashboardState(state).isLoading;
export const getIsRefreshingDashboard = state => getDashboardState(state).isRefreshing;
export const getIsLoadedDashboard = state => getDashboardState(state).isLoaded;
export const getDashboardLoadingError = state => getDashboardState(state).loadingError;
export const getDashboardData = state => getDashboardState(state).data;

export const {
	fetchRequest: fetchDashboardRequest,
	fetchSuccess: fetchDashboardSuccess,
	fetchFailure: fetchDashboardFailure,
} = dashboardSlice.actions;

const getExchangeStats = exchanges => {
	return {
		trades: exchanges.length,
		volume: exchanges.reduce((totalVolume, exchange) => {
			totalVolume += exchange.fromAmountInUSD;
			return totalVolume;
		}, 0),
	};
};

function* fetchDashboard() {
	const now = new Date().getTime();

	try {
		const [holders, dailyExchanges, totalExchanges] = yield all([
			axios.get(`${L2_API_URL}/api/holders`),
			snxData.exchanges.since({
				minTimestamp: calculateTimestampForPeriod(24),
				maxTimestamp: Math.trunc(now / 1000),
			}),
			snxData.exchanges.since(),
		]);

		yield put(
			fetchDashboardSuccess({
				data: {
					totalWallets: (holders.data && holders.data.length) || 0,
					daily: getExchangeStats(dailyExchanges),
					total: getExchangeStats(totalExchanges),
				},
			})
		);
	} catch (e) {
		console.log(e);
		yield put(fetchDashboardFailure({ error: e.message }));
	}
}

export function* watchFetchDashboardRequest() {
	yield takeLatest(fetchDashboardRequest.type, fetchDashboard);
}

export default dashboardSlice.reducer;
