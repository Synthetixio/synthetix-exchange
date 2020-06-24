import React, { FC, memo, useEffect } from 'react';
import {
	getRecentOptionsTransactionsMap,
	getIsLoadingRecentOptionsTransactions,
	getIsLoadedRecentOptionsTransactions,
	fetchRecentOptionsTransactionsRequest,
} from 'ducks/options/recentOptionsTransactions';
import { RootState } from 'ducks/types';
import { ConnectedProps, connect } from 'react-redux';

import useInterval from 'shared/hooks/useInterval';

import { OptionsMarketInfo } from 'ducks/options/types';

import TransactionsTable from '../components/TransactionsTable';
import { DEFAULT_REQUEST_REFRESH_INTERVAL } from 'constants/ui';
import { NoResultsMessage } from 'shared/commonStyles';

const mapStateToProps = (state: RootState) => ({
	isLoading: getIsLoadingRecentOptionsTransactions(state),
	isLoaded: getIsLoadedRecentOptionsTransactions(state),
	optionsTransactionsMap: getRecentOptionsTransactionsMap(state),
});

const mapDispatchToProps = {
	fetchRecentOptionsTransactionsRequest,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type RecentTransactionsProps = PropsFromRedux & {
	marketAddress: OptionsMarketInfo['address'];
};

const RecentTransactions: FC<RecentTransactionsProps> = memo(
	({
		marketAddress,
		optionsTransactionsMap,
		isLoading,
		isLoaded,
		fetchRecentOptionsTransactionsRequest,
	}) => {
		useEffect(() => {
			fetchRecentOptionsTransactionsRequest({
				marketAddress,
			});
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);

		useInterval(() => {
			fetchRecentOptionsTransactionsRequest({
				marketAddress,
			});
		}, DEFAULT_REQUEST_REFRESH_INTERVAL);

		const optionsTransactions = optionsTransactionsMap[marketAddress] || [];

		return (
			<TransactionsTable
				key="recent-tx"
				optionsTransactions={optionsTransactions}
				isLoading={isLoading && !isLoaded}
				noResultsMessage={
					isLoaded && optionsTransactions.length === 0 ? (
						<NoResultsMessage>No transactions</NoResultsMessage>
					) : undefined
				}
			/>
		);
	}
);

export default connector(RecentTransactions);
