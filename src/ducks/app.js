import { createSlice } from '@reduxjs/toolkit';

export const appSlice = createSlice({
	name: 'app',
	initialState: {
		isReady: false,
	},
	reducers: {
		setAppReady: state => {
			state.isReady = true;
		},
	},
});

export const getAppState = state => state.app;
export const getIsAppReady = state => getAppState(state).isReady;

const { setAppReady } = appSlice.actions;

export default appSlice.reducer;

export { setAppReady };
