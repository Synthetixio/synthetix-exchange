import { takeLatest, put } from 'redux-saga/effects';
import { createSlice, createSelector } from '@reduxjs/toolkit';
import orderBy from 'lodash/orderBy';
import { L2_API_URL } from 'src/constants/l2';
import snxJSConnector from 'src/utils/snxJSConnector';
import axios from 'axios';

export const leaderboardSlice = createSlice({
	name: 'leaderboard',
	initialState: {
		data: [],
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

export const getLeaderboardState = state => state.leaderboard;
export const getIsLoadingLeaderboard = state => getLeaderboardState(state).isLoading;
export const getIsRefreshingLeaderboard = state => getLeaderboardState(state).isRefreshing;
export const getIsLoadedLeaderboard = state => getLeaderboardState(state).isLoaded;
export const getLeaderboardLoadingError = state => getLeaderboardState(state).loadingError;
export const getLeaderboardData = state => getLeaderboardState(state).data;

export const getSortedLeaderboard = createSelector(getLeaderboardData, leaderboardData =>
	orderBy(leaderboardData, 'assetValue', 'desc').map((d, idx) => ({ rank: idx + 1, ...d }))
);

export const getTop10Leaders = createSelector(getSortedLeaderboard, sortedLeaderboardData =>
	sortedLeaderboardData.slice(0, 10)
);

const {
	fetchRequest: fetchLeaderboardRequest,
	fetchSuccess: fetchLeaderboardSuccess,
	fetchFailure: fetchLeaderboardFailure,
} = leaderboardSlice.actions;

function* fetchLeaderboard() {
	const {
		snxJS: { sUSD },
	} = snxJSConnector;
	try {
		const results = yield axios.get(`${L2_API_URL}/api/holders`);
		const holders = results.data;

		// Logic to be replaced with utility smart contract
		const balances = yield Promise.all(holders.map(holder => sUSD.balanceOf(holder.address)));

		yield put(
			fetchLeaderboardSuccess({
				data: holders.map((holder, idx) => ({
					...holder,
					assetValue: balances[idx] / 1e18,
				})),
			})
		);
	} catch (e) {
		yield put(fetchLeaderboardFailure({ error: e.message }));
	}
}

export function* watchFetchLeaderboardRequest() {
	yield takeLatest(fetchLeaderboardRequest.type, fetchLeaderboard);
}

export default leaderboardSlice.reducer;

export { fetchLeaderboardRequest };
