import React, { FC, memo, useState, useEffect } from 'react';
import snxData from 'synthetix-data';

// import useInterval from 'shared/hooks/useInterval';

import { OptionsTransactions, OptionsMarketInfo } from 'ducks/options/types';

import TransactionsTable from '../components/TransactionsTable';

type YourTransactionsProps = {
	max?: number;
	marketAddress: OptionsMarketInfo['address'];
};

const YourTransactions: FC<YourTransactionsProps> = memo(({ marketAddress, max = 100 }) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isLoaded, setIsLoaded] = useState<boolean>(false);
	const [optionsTransactions, setOptionsTransactions] = useState<OptionsTransactions>([]);

	useEffect(() => {
		const getTransactions = async () => {
			try {
				setIsLoading(true);
				const transactions = await snxData.binaryOptions.optionTransactions(max, marketAddress);
				setIsLoaded(true);
				setOptionsTransactions(transactions);
			} catch (e) {
			} finally {
				setIsLoading(false);
			}
		};
		getTransactions();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// useInterval(() => {
	// 	fetchMyTradesRequest();
	// }, DEFAULT_REQUEST_REFRESH_INTERVAL);
	return (
		<TransactionsTable
			optionsTransactions={optionsTransactions}
			isLoading={isLoading}
			noResultsMessage={isLoaded && optionsTransactions.length === 0 && <div>No results</div>}
		/>
	);
});

export default YourTransactions;
