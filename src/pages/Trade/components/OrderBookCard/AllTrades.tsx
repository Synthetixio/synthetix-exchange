import React, { FC } from 'react';
import { useQuery } from 'react-query';
import snxData from 'synthetix-data';

import { HistoricalTrades } from 'ducks/trades/types';

import TradeHistory from './TradeHistory';

import { REFRESH_INTERVAL } from './constants';
import QUERY_KEYS from 'constants/queryKeys';

type AllTradesProps = {};

const AllTrades: FC<AllTradesProps> = () => {
	const allTradesQuery = useQuery<HistoricalTrades, any>(
		QUERY_KEYS.HistoricalTrades.AllTrades,
		() =>
			snxData.exchanges.since({
				maxBlock: Number.MAX_SAFE_INTEGER,
				max: 100,
			}),
		{
			refetchInterval: REFRESH_INTERVAL,
		}
	);

	return (
		<TradeHistory
			trades={allTradesQuery.data || []}
			isLoading={allTradesQuery.isLoading}
			isLoaded={allTradesQuery.isSuccess}
		/>
	);
};

export default AllTrades;
