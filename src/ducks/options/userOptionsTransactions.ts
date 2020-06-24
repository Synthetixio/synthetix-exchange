import { PayloadAction, ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { takeLatest, put, select } from 'redux-saga/effects';

import { RootState } from 'ducks/types';

import { createRequestSliceFactory, RequestSliceFactoryState } from '../requestSliceFactory';
import { OptionsTransactionsMap } from './types';

import snxData from 'synthetix-data';
import { getCurrentWalletAddress } from 'ducks/wallet/walletDetails';

export type UserOptionsTransactionsSliceState = RequestSliceFactoryState<OptionsTransactionsMap>;

const userOptionsTransactionsSliceName = 'userOptionsTransactions';

const userOptionsTransactionsSlice = createRequestSliceFactory<OptionsTransactionsMap>({
	name: userOptionsTransactionsSliceName,
	initialState: {
		data: {},
	},
	options: {
		mergeData: true,
	},
});

export const {
	fetchFailure: fetchUserOptionsTransactionsFailure,
	fetchSuccess: fetchUserOptionsTransactionsSuccess,
	fetchRequest,
} = userOptionsTransactionsSlice.actions;

export const fetchUserOptionsTransactionsRequest = (fetchRequest as unknown) as ActionCreatorWithPayload<
	{
		marketAddress: string;
		max?: number;
	},
	string
>;

export const getUserOptionsTransactionsState = (state: RootState) =>
	state.options[userOptionsTransactionsSliceName];
export const getIsLoadingUserOptionsTransactions = (state: RootState) =>
	state.options[userOptionsTransactionsSliceName].isLoading;
export const getIsLoadedUserOptionsTransactions = (state: RootState) =>
	state.options[userOptionsTransactionsSliceName].isLoaded;
export const getUserOptionsTransactionsMap = (state: RootState) =>
	getUserOptionsTransactionsState(state).data;

function* fetchUserOptionsTransactions(
	action: PayloadAction<{ marketAddress: string; max?: number }>
) {
	try {
		const { marketAddress } = action.payload;
		const currentWalletAddress = yield select(getCurrentWalletAddress);

		const transactions = yield snxData.binaryOptions.optionTransactions({
			market: marketAddress,
			account: currentWalletAddress,
		});

		yield put(
			fetchUserOptionsTransactionsSuccess({
				data: { [marketAddress]: transactions },
			})
		);
	} catch (e) {
		yield put(fetchUserOptionsTransactionsFailure({ error: e.message }));
	}
}

export function* watchFetchUserOptionsTransactionsRequest() {
	yield takeLatest(fetchUserOptionsTransactionsRequest.type, fetchUserOptionsTransactions);
}

export default userOptionsTransactionsSlice.reducer;
