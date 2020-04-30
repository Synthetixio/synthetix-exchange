import React, { memo, useEffect } from 'react';
import { connect } from 'react-redux';

import {
	fetchAllTradesRequest,
	getAllTradesWithTwitterHandles,
	getIsLoadingAllTrades,
	getIsLoadedAllTrades,
} from 'src/ducks/trades/allTrades';

import useInterval from 'src/shared/hooks/useInterval';

import TradeHistory from './TradeHistory';

import { REFRESH_INTERVAL } from './constants';

const AllTrades = memo(({ fetchAllTradesRequest, trades, isLoading, isLoaded }) => {
	useEffect(() => {
		fetchAllTradesRequest();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useInterval(() => {
		fetchAllTradesRequest();
	}, REFRESH_INTERVAL);

	return (
		<TradeHistory
			trades={trades}
			isLoading={isLoading}
			isLoaded={isLoaded}
			showTwitterHandle={true}
		/>
	);
});

const mapStateToProps = state => ({
	trades: getAllTradesWithTwitterHandles(state),
	isLoaded: getIsLoadedAllTrades(state),
	isLoading: getIsLoadingAllTrades(state),
});

const mapDispatchToProps = {
	fetchAllTradesRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(AllTrades);
