import React, { FC, memo, useEffect } from 'react';
import { ConnectedProps, connect } from 'react-redux';

import { RootState } from 'ducks/types';
import { OptionsMarketInfo } from 'ducks/options/types';

import {
	getUserOptionsTransactionsMap,
	getIsLoadingUserOptionsTransactions,
	getIsLoadedUserOptionsTransactions,
	fetchUserOptionsTransactionsRequest,
} from 'ducks/options/userOptionsTransactions';

import useInterval from 'shared/hooks/useInterval';
import { NoResultsMessage } from 'shared/commonStyles';

import TransactionsTable from '../components/TransactionsTable';
import { DEFAULT_REQUEST_REFRESH_INTERVAL } from 'constants/ui';

const mapStateToProps = (state: RootState) => ({
	isLoading: getIsLoadingUserOptionsTransactions(state),
	isLoaded: getIsLoadedUserOptionsTransactions(state),
	optionsTransactionsMap: getUserOptionsTransactionsMap(state),
});

const mapDispatchToProps = {
	fetchUserOptionsTransactionsRequest,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type YourTransactionsProps = PropsFromRedux & {
	marketAddress: OptionsMarketInfo['address'];
};

const YourTransactions: FC<YourTransactionsProps> = memo(
	({
		marketAddress,
		optionsTransactionsMap,
		isLoading,
		isLoaded,
		fetchUserOptionsTransactionsRequest,
	}) => {
		useEffect(() => {
			fetchUserOptionsTransactionsRequest({
				marketAddress,
			});
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);

		useInterval(() => {
			fetchUserOptionsTransactionsRequest({
				marketAddress,
			});
		}, DEFAULT_REQUEST_REFRESH_INTERVAL);

		const optionsTransactions = optionsTransactionsMap[marketAddress] || [];

		return (
			<TransactionsTable
				key="your-tx"
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

export default connector(YourTransactions);
