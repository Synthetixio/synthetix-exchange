import { takeLatest, put } from 'redux-saga/effects';
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { L2_API_URL } from 'src/constants/l2';
import keyBy from 'lodash/keyBy';

export const holdersSlice = createSlice({
	name: 'holders',
	initialState: {
		data: {
			holders: [],
			byAddress: {},
			total: 0,
		},
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

export const getHoldersState = state => state.holders;
export const getIsLoadingHolders = state => getHoldersState(state).isLoading;
export const getIsRefreshingHolders = state => getHoldersState(state).isRefreshing;
export const getIsLoadedHolders = state => getHoldersState(state).isLoaded;
export const getHoldersLoadingError = state => getHoldersState(state).loadingError;
export const getHoldersData = state => getHoldersState(state).data;

export const {
	fetchRequest: fetchHoldersRequest,
	fetchSuccess: fetchHoldersSuccess,
	fetchFailure: fetchHoldersFailure,
} = holdersSlice.actions;

function* fetchHolders() {
	try {
		const holdersResult = yield axios.get(`${L2_API_URL}/api/holders`);
		const holders = holdersResult.data;

		yield put(
			fetchHoldersSuccess({
				data: {
					holders,
					byAddress: keyBy(holders, 'address'),
					total: holders.length,
				},
			})
		);
	} catch (e) {
		console.log(e);
		yield put(fetchHoldersFailure({ error: e.message }));
	}
}

export function* watchFetchHoldersRequest() {
	yield takeLatest(fetchHoldersRequest.type, fetchHolders);
}

export default holdersSlice.reducer;
