import React from 'react';
import { CloseLoanCard } from './CloseLoanCard';
import { loggedInUserWithBalances } from '../../../../../../.storybook/mocks/reducers/wallet';
import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';

export default {
	title: 'Loans/Cards',
};

export const closeLoan = () => (
	<CloseLoanCard
		isInteractive={boolean('isInteractive', true)}
		gasInfo={{ gasLimit: 0, gasPrice: 0 }}
		ethRate={0}
		toggleGweiPopup={action('open gwei popup')}
		walletInfo={loggedInUserWithBalances}
	/>
);
