import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import {
	fetchAllTradesRequest,
	getAllTrades,
	getIsRefreshingAllTrades,
	getIsLoadedAllTrades,
} from 'src/ducks/trades/allTrades';
import {
	fetchMyTradesRequest,
	getMyTrades,
	getIsRefreshingMyTrades,
	getIsLoadedMyTrades,
} from 'src/ducks/trades/myTrades';

import TradeHistory from '../components/OrderBookCard/TradeHistory';

const History = ({
	fetchAllTradesRequest,
	fetchMyTradesRequest,
	myTrades,
	isLoadedMyTrades,
	isRefreshingMyTrades,
	allTrades,
	isLoadedAllTrades,
	isRefreshingAllTrades,
}) => {
	useEffect(() => {
		fetchMyTradesRequest();
		fetchAllTradesRequest();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<TradeHistory
			trades={allTrades}
			isLoading={isRefreshingAllTrades}
			isLoaded={isLoadedAllTrades}
		/>
	);
};

const mapStateToProps = state => ({
	allTrades: getAllTrades(state),
	isRefreshingAllTrades: getIsRefreshingAllTrades(state),
	isLoadedAllTrades: getIsLoadedAllTrades(state),
	myTrades: getMyTrades(state),
	isRefreshingMyTrades: getIsRefreshingMyTrades(state),
	isLoadedMyTrades: getIsLoadedMyTrades(state),
});

const mapDispatchToProps = {
	fetchAllTradesRequest,
	fetchMyTradesRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(History);
