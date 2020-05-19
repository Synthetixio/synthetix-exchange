import { createSlice } from '@reduxjs/toolkit';
import { RootState } from './types';

export const appSlice = createSlice({
	name: 'app',
	initialState: {
		isReady: false,
	},
	reducers: {
		setAppReady: (state) => {
			state.isReady = true;
		},
	},
});

export const getAppState = (state: RootState) => state.app;
export const getIsAppReady = (state: RootState) => getAppState(state).isReady;

export const { setAppReady } = appSlice.actions;

export default appSlice.reducer;
