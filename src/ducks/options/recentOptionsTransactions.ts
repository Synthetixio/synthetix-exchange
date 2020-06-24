import { PayloadAction, ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { takeLatest, put } from 'redux-saga/effects';

import { RootState } from 'ducks/types';

import { createRequestSliceFactory, RequestSliceFactoryState } from '../requestSliceFactory';
import { OptionsTransactionsMap } from './types';

import snxData from 'synthetix-data';

export type RecentOptionsTransactionsSliceState = RequestSliceFactoryState<OptionsTransactionsMap>;

const recentOptionsTransactionsSliceName = 'recentOptionsTransactions';

const recentOptionsTransactionsSlice = createRequestSliceFactory<OptionsTransactionsMap>({
	name: recentOptionsTransactionsSliceName,
	initialState: {
		data: {},
	},
	options: {
		mergeData: true,
	},
});

export const {
	fetchFailure: fetchRecentOptionsTransactionsFailure,
	fetchSuccess: fetchRecentOptionsTransactionsSuccess,
	fetchRequest,
} = recentOptionsTransactionsSlice.actions;

export const fetchRecentOptionsTransactionsRequest = (fetchRequest as unknown) as ActionCreatorWithPayload<
	{
		marketAddress: string;
		max?: number;
	},
	string
>;

export const getRecentOptionsTransactionsState = (state: RootState) =>
	state.options[recentOptionsTransactionsSliceName];
export const getIsLoadingRecentOptionsTransactions = (state: RootState) =>
	state.options[recentOptionsTransactionsSliceName].isLoading;
export const getIsLoadedRecentOptionsTransactions = (state: RootState) =>
	state.options[recentOptionsTransactionsSliceName].isLoaded;
export const getRecentOptionsTransactionsMap = (state: RootState) =>
	getRecentOptionsTransactionsState(state).data;

function* fetchRecentOptionsTransactions(
	action: PayloadAction<{ marketAddress: string; max?: number }>
) {
	try {
		const { marketAddress } = action.payload;
		const transactions = yield snxData.binaryOptions.optionTransactions({ market: marketAddress });

		yield put(
			fetchRecentOptionsTransactionsSuccess({
				data: { [marketAddress]: transactions },
			})
		);
	} catch (e) {
		yield put(fetchRecentOptionsTransactionsFailure({ error: e.message }));
	}
}

export function* watchFetchRecentOptionsTransactionsRequest() {
	yield takeLatest(fetchRecentOptionsTransactionsRequest.type, fetchRecentOptionsTransactions);
}

export default recentOptionsTransactionsSlice.reducer;
