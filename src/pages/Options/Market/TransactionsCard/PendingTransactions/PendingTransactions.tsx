import React, { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';

import TransactionsTable from '../components/TransactionsTable';

import { RootState } from 'ducks/types';
import { getOptionsPendingTransactions } from 'ducks/options/pendingTransaction';

import { TableNoResults } from 'shared/commonStyles';

const mapStateToProps = (state: RootState) => ({
	pendingTransactions: getOptionsPendingTransactions(state),
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type PendingTransactionsProps = PropsFromRedux & {
	marketAddress: string;
	walletAddress: string;
};

const PendingTransactions: FC<PendingTransactionsProps> = ({
	pendingTransactions,
	marketAddress,
	walletAddress,
}) => {
	const { t } = useTranslation();

	const filteredPendingTransactions = useMemo(
		() =>
			pendingTransactions.filter(
				({ market, account }) => market === marketAddress && walletAddress === account
			),
		[pendingTransactions, marketAddress, walletAddress]
	);

	const noResults = filteredPendingTransactions.length === 0;

	return (
		<TransactionsTable
			optionsTransactions={filteredPendingTransactions}
			isLoading={false}
			noResultsMessage={
				noResults ? (
					<TableNoResults>
						{t('options.market.transactions-card.table.no-results-pending-transactions')}
					</TableNoResults>
				) : undefined
			}
		/>
	);
};

export default connector(PendingTransactions);
