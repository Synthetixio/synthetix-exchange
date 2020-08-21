import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../types';
import { OptionsTransactions, OptionsTransaction } from 'pages/Options/types';

const sliceName = 'pendingTransaction';

const initialState: OptionsTransactions = [];

export const pendingTransactionsSlice = createSlice({
	name: sliceName,
	initialState,
	reducers: {
		addOptionsPendingTransaction: (
			state,
			action: PayloadAction<{
				optionTransaction: Omit<OptionsTransaction, 'status' | 'timestamp'>;
			}>
		) => {
			const { optionTransaction } = action.payload;

			const optionTransactionWithStatus: OptionsTransaction = {
				...optionTransaction,
				status: 'pending',
				timestamp: Date.now(),
			};

			state.unshift(optionTransactionWithStatus);
		},
		updateOptionsPendingTransactionStatus: (
			state,
			action: PayloadAction<{
				hash: OptionsTransaction['hash'];
				status: OptionsTransaction['status'];
			}>
		) => {
			const { hash, status } = action.payload;

			state.forEach((optionTransaction, idx) => {
				if (optionTransaction.hash === hash) {
					state[idx].status = status;
				}
			});
		},
	},
});

export const getOptionsPendingTransactions = (state: RootState) => state.options[sliceName];

export const {
	addOptionsPendingTransaction,
	updateOptionsPendingTransactionStatus,
} = pendingTransactionsSlice.actions;

export default pendingTransactionsSlice.reducer;
