import React, { FC } from 'react';

import { useAllTradesQuery } from 'queries/myTrades';
import TradeHistory from './TradeHistory';

type AllTradesProps = {};

const AllTrades: FC<AllTradesProps> = () => {
	const allTradesQuery = useAllTradesQuery();

	return (
		<TradeHistory
			trades={allTradesQuery.data || []}
			isLoading={allTradesQuery.isLoading && !allTradesQuery.isSuccess}
			isLoaded={allTradesQuery.isSuccess}
		/>
	);
};

export default AllTrades;
