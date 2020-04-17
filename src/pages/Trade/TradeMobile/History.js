import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import {
	fetchMyTradesRequest,
	getMyTrades,
	getIsLoadedMyTrades,
	getIsLoadingMyTrades,
} from 'src/ducks/trades/myTrades';

import TradeHistory from './TradeHistory';

const History = ({ fetchMyTradesRequest, myTrades, isLoadedMyTrades, isLoadingMyTrades }) => {
	useEffect(() => {
		fetchMyTradesRequest();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<TradeHistory trades={myTrades} isLoading={isLoadingMyTrades} isLoaded={isLoadedMyTrades} />
	);
};

const mapStateToProps = (state) => ({
	myTrades: getMyTrades(state),
	isLoadingMyTrades: getIsLoadingMyTrades(state),
	isLoadedMyTrades: getIsLoadedMyTrades(state),
});

const mapDispatchToProps = {
	fetchMyTradesRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(History);
