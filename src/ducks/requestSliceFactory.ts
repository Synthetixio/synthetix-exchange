import merge from 'lodash/merge';
import { createSlice, PayloadAction, Draft } from '@reduxjs/toolkit';

interface RequestSliceState {
	lastUpdated: number | null;
	loadingError: string | null;
	isLoading: boolean;
	isLoaded: boolean;
	isRefreshing: boolean;
}

export interface RequestSliceFactoryState<T> extends RequestSliceState {
	data: T;
}

const requestSliceInitialState: RequestSliceState = {
	lastUpdated: null,
	loadingError: null,
	isLoading: false,
	isLoaded: false,
	isRefreshing: false,
};

interface RequestSliceFactoryProps<T> {
	name: string;
	initialState: {
		data: T;
	};
	options?: {
		mergeData: boolean;
	};
}

export const createRequestSliceFactory = <T>({
	name,
	initialState,
	options,
}: RequestSliceFactoryProps<T>) =>
	createSlice({
		name,
		initialState: {
			...requestSliceInitialState,
			...initialState,
		} as RequestSliceFactoryState<T>,
		reducers: {
			fetchRequest: (state) => {
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
			fetchSuccess: (state, action: PayloadAction<{ data: Draft<T> }>) => {
				const { data } = action.payload;

				if (options && options.mergeData) {
					state.data = merge(state.data, data);
				} else {
					state.data = data;
				}
				state.lastUpdated = Date.now();
				state.isLoading = false;
				state.isRefreshing = false;
				state.isLoaded = true;
			},
		},
	});
