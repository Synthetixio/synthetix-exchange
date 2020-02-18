import React from 'react';
import { CreateLoanCard } from './CreateLoanCard';
import { loggedInUserWithBalances } from '../../../../../../.storybook/mocks/reducers/wallet';
import { action } from '@storybook/addon-actions';

export default {
	title: 'Loans/Cards',
};

export const createLoan = () => (
	<CreateLoanCard
		gasInfo={{ gasLimit: 0, gasPrice: 0 }}
		ethRate={0}
		toggleGweiPopup={action('open gwei popup')}
		walletInfo={loggedInUserWithBalances}
	/>
);
