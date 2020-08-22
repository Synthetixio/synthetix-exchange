import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './types';

export const appSlice = createSlice({
	name: 'app',
	initialState: {
		isReady: false,
		systemSuspended: false,
	},
	reducers: {
		setAppReady: (state) => {
			state.isReady = true;
		},
		setSystemSuspended: (state, action: PayloadAction<{ status: boolean }>) => {
			state.systemSuspended = action.payload.status;
		},
	},
});

export const getAppState = (state: RootState) => state.app;
export const getIsAppReady = (state: RootState) => getAppState(state).isReady;
export const getIsSystemSuspended = (state: RootState) => getAppState(state).systemSuspended;

export const { setSystemSuspended, setAppReady } = appSlice.actions;

export default appSlice.reducer;
