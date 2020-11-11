import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { takeLatest, put, all } from 'redux-saga/effects';

import { RootState } from './types';
import snxJSConnector from 'utils/snxJSConnector';

export type AppSliceState = {
	isReady: boolean;
	isFetching: boolean;
	isFetched: boolean;
	isRefreshing: boolean;
	fetchError: string | null;
	isSystemSuspended: boolean;
	isPVT: boolean;
};

const initialState: AppSliceState = {
	isReady: false,
	isSystemSuspended: false,
	isPVT: false,
	isFetching: false,
	isFetched: false,
	isRefreshing: false,
	fetchError: null,
};

export const appSlice = createSlice({
	name: 'app',
	initialState,
	reducers: {
		setAppReady: (state) => {
			state.isReady = true;
		},
		fetchAppStatusRequest: (state) => {
			state.fetchError = null;
			state.isFetching = true;
			if (state.isFetched) {
				state.isRefreshing = true;
			}
		},
		fetchAppStatusFailure: (state, action: PayloadAction<{ error: string }>) => {
			state.fetchError = action.payload.error;
			state.isFetching = false;
			state.isRefreshing = false;
		},
		fetchAppStatusSuccess: (
			state,
			action: PayloadAction<{ isSystemSuspended: boolean; isPVT: boolean }>
		) => {
			const { isSystemSuspended, isPVT } = action.payload;
			state.isSystemSuspended = isSystemSuspended;
			state.isPVT = isPVT;
			state.isFetching = false;
			state.isRefreshing = false;
			state.isFetched = true;
		},
	},
});

export const getAppState = (state: RootState) => state.app;
export const getIsAppReady = (state: RootState) => getAppState(state).isReady;
export const getIsSystemSuspended = (state: RootState) =>
	!!getAppState(state).isSystemSuspended ||
	(!!getAppState(state).isPVT && process.env.REACT_APP_IS_PROD === 'true');

export const {
	setAppReady,
	fetchAppStatusRequest,
	fetchAppStatusFailure,
	fetchAppStatusSuccess,
} = appSlice.actions;

function* fetchSystemStatus() {
	const {
		snxJS: { SystemStatus, DappMaintenance },
	} = snxJSConnector as any;
	try {
		const [isSystemSuspended, isPVT] = yield all([
			SystemStatus.isSystemUpgrading(),
			DappMaintenance.isPausedSX(),
		]);
		yield put(fetchAppStatusSuccess({ isSystemSuspended, isPVT }));
		return true;
	} catch (e) {
		yield put(fetchAppStatusFailure({ error: e.message }));
		return false;
	}
}

export function* watchFetchSystemStatusRequest() {
	yield takeLatest(fetchAppStatusRequest.type, fetchSystemStatus);
}

export default appSlice.reducer;
