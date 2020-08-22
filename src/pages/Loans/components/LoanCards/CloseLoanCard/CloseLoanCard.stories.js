import React from 'react';
import { CloseLoanCard } from './CloseLoanCard';
import { connectedWalletWithBalances } from '../../../../../../.storybook/mocks/reducers/wallet';
import { boolean } from '@storybook/addon-knobs';

export default {
	title: 'Loans/Cards',
};

export const closeLoan = () => (
	<CloseLoanCard
		isInteractive={boolean('isInteractive', true)}
		gasInfo={{ gasLimit: 0, gasPrice: 0 }}
		ethRate={0}
		walletInfo={connectedWalletWithBalances}
	/>
);
