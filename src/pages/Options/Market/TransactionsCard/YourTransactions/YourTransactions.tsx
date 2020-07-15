import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import snxData from 'synthetix-data';
import { useQuery } from 'react-query';

import { OptionsMarketInfo, OptionsTransactions } from 'pages/Options/types';
import TransactionsTable from '../components/TransactionsTable';

import QUERY_KEYS from 'constants/queryKeys';
import { TableNoResults } from 'shared/commonStyles';

type RecentTransactionsProps = {
	marketAddress: OptionsMarketInfo['address'];
	walletAddress: string;
};

const RecentTransactions: FC<RecentTransactionsProps> = memo(({ marketAddress, walletAddress }) => {
	const { t } = useTranslation();

	const transactionsQuery = useQuery<OptionsTransactions, any>(
		QUERY_KEYS.BinaryOptions.UserTransactions(marketAddress, walletAddress),
		() =>
			snxData.binaryOptions.optionTransactions({ market: marketAddress, account: walletAddress }),
		{
			refetchOnWindowFocus: false,
		}
	);

	const noResults =
		transactionsQuery.isSuccess && transactionsQuery.data && transactionsQuery.data.length === 0;

	return (
		<TransactionsTable
			optionsTransactions={transactionsQuery.data || []}
			isLoading={transactionsQuery.isLoading}
			noResultsMessage={
				transactionsQuery.isSuccess && noResults ? (
					<TableNoResults>
						{t('options.market.transactions-card.table.no-results-your-activity')}
					</TableNoResults>
				) : undefined
			}
		/>
	);
});

export default RecentTransactions;
