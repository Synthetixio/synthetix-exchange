import React from 'react';
import { CreateLoanCard } from './CreateLoanCard';
import { connectedWalletWithBalances } from '../../../../../../.storybook/mocks/reducers/wallet';

export default {
	title: 'Loans/Cards',
};

export const createLoan = () => (
	<CreateLoanCard
		gasInfo={{ gasLimit: 0, gasPrice: 0 }}
		ethRate={0}
		walletInfo={connectedWalletWithBalances}
	/>
);
