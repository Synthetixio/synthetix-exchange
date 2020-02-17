import React from 'react';
import { LoanCard } from './LoanCard';
import { loggedInUserWithBalances } from '../../../../../.storybook/mocks/reducers/wallet';
import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';

export default {
	title: 'Loans/Cards',
};

const sharedProps = {
	gasInfo: { gasLimit: 0, gasPrice: 0 },
	ethRate: 0,
	toggleGweiPopup: action('open gwei opup'),
	walletInfo: loggedInUserWithBalances,
};

export const createLoan = () => (
	<LoanCard type="create" {...sharedProps} isInteractive={boolean('isInteractive', true)} />
);
export const closeLoan = () => (
	<LoanCard type="close" {...sharedProps} isInteractive={boolean('isInteractive', true)} />
);
