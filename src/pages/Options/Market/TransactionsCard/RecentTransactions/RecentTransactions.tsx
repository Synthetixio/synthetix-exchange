import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';

import { OptionsMarketInfo } from 'ducks/options/types';

import TransactionsTable from '../components/TransactionsTable';

import snxData from 'synthetix-data';

import { useQuery } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { TableNoResults } from 'shared/commonStyles';

type RecentTransactionsProps = {
	marketAddress: OptionsMarketInfo['address'];
};

const RecentTransactions: FC<RecentTransactionsProps> = memo(({ marketAddress }) => {
	const { t } = useTranslation();

	const binaryOptionsQuery = useQuery(
		QUERY_KEYS.BinaryOptions.RecentTransactions(marketAddress),
		() => snxData.binaryOptions.optionTransactions({ market: marketAddress })
	);

	const noData =
		binaryOptionsQuery.isSuccess && binaryOptionsQuery.data && binaryOptionsQuery.data.length === 0;

	return (
		<TransactionsTable
			optionsTransactions={binaryOptionsQuery.data}
			isLoading={binaryOptionsQuery.isLoading && noData}
			noResultsMessage={
				binaryOptionsQuery.isSuccess && noData ? (
					<TableNoResults>
						{t('options.market.transactions-card.table.no-results-recent-activity')}
					</TableNoResults>
				) : undefined
			}
		/>
	);
});

export default RecentTransactions;
