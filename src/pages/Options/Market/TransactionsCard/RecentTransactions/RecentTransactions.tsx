import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

import snxData from 'synthetix-data';

import { OptionsMarketInfo } from 'ducks/options/types';

import QUERY_KEYS from 'constants/queryKeys';
import TransactionsTable from '../components/TransactionsTable';

import { TableNoResults } from 'shared/commonStyles';

type RecentTransactionsProps = {
	marketAddress: OptionsMarketInfo['address'];
};

const RecentTransactions: FC<RecentTransactionsProps> = memo(({ marketAddress }) => {
	const { t } = useTranslation();

	const transactionsQuery = useQuery(
		QUERY_KEYS.BinaryOptions.RecentTransactions(marketAddress),
		() => snxData.binaryOptions.optionTransactions({ market: marketAddress })
	);

	const isInitialLoading = transactionsQuery.isLoading && transactionsQuery.data == null;
	const noResults =
		transactionsQuery.isSuccess && transactionsQuery.data && transactionsQuery.data.length === 0;

	return (
		<TransactionsTable
			optionsTransactions={transactionsQuery.data}
			isLoading={isInitialLoading}
			noResultsMessage={
				transactionsQuery.isSuccess && noResults ? (
					<TableNoResults>
						{t('options.market.transactions-card.table.no-results-recent-activity')}
					</TableNoResults>
				) : undefined
			}
		/>
	);
});

export default RecentTransactions;
