import React, { memo, useEffect } from 'react';
import { connect } from 'react-redux';

import {
	fetchMyTradesRequest,
	getMyTrades,
	getIsLoadingMyTrades,
	getIsLoadedMyTrades,
} from 'src/ducks/trades/myTrades';

import useInterval from 'src/shared/hooks/useInterval';

import TradeHistory from './TradeHistory';

import { REFRESH_INTERVAL } from './constants';

const MyTrades = memo(({ fetchMyTradesRequest, trades, isLoaded, isLoading }) => {
	useEffect(() => {
		fetchMyTradesRequest();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useInterval(() => {
		fetchMyTradesRequest();
	}, REFRESH_INTERVAL);

	return <TradeHistory trades={trades} isLoading={isLoading} isLoaded={isLoaded} />;
});

const mapStateToProps = state => ({
	trades: getMyTrades(state),
	isLoading: getIsLoadingMyTrades(state),
	isLoaded: getIsLoadedMyTrades(state),
});

const mapDispatchToProps = {
	fetchMyTradesRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyTrades);
