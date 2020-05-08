import { takeLatest, put } from 'redux-saga/effects';
import axios from 'axios';
import isEmpty from 'lodash/isEmpty';
import orderBy from 'lodash/orderBy';
import { createSlice, createSelector } from '@reduxjs/toolkit';

import { getRatesExchangeRates } from './rates';
import { L2_API_URL } from 'src/constants/l2';

const TOP_SYNTHS_LIMIT = 4;

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
export const getDashboardDataState = state => getDashboardState(state).data;

export const {
	fetchRequest: fetchDashboardRequest,
	fetchSuccess: fetchDashboardSuccess,
	fetchFailure: fetchDashboardFailure,
} = dashboardSlice.actions;

export const getDashboardData = createSelector(
	getDashboardDataState,
	getRatesExchangeRates,
	(dashboardData, rates) => {
		if (isEmpty(dashboardData) || !rates) return {};

		const { totalSupplyPerSynth } = dashboardData;
		let topSynths = [];
		let totalRemainingSynths = 0;
		const topSynthsInUSD = orderBy(
			totalSupplyPerSynth.map(synth => {
				return {
					name: synth.name,
					total: synth.total * rates[synth.name],
				};
			}),
			'total',
			'desc'
		);
		topSynthsInUSD.forEach((synth, i) => {
			if (i <= TOP_SYNTHS_LIMIT) {
				topSynths.push(synth);
			} else {
				totalRemainingSynths += synth.total;
			}
		});
		topSynths.push({ name: 'Other', total: totalRemainingSynths });
		return { ...dashboardData, topSynths };
	}
);

function* fetchDashboard() {
	try {
		const dashboardData = yield axios.get(`${L2_API_URL}/api/dashboard`);

		yield put(
			fetchDashboardSuccess({
				data: {
					...dashboardData.data,
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
