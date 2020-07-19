import React, { FC, useEffect } from 'react';
import { connect } from 'react-redux';

import {
	fetchMyTradesRequest,
	getMyTrades,
	getIsLoadingMyTrades,
	getIsLoadedMyTrades,
} from 'ducks/trades/myTrades';

import { RootState } from 'ducks/types';
import { HistoricalTrades } from 'ducks/trades/types';

import useInterval from 'shared/hooks/useInterval';

import TradeHistory from './TradeHistory';

import { REFRESH_INTERVAL } from './constants';

type StateProps = {
	trades: HistoricalTrades;
	isLoading: boolean;
	isLoaded: boolean;
};

type DispatchProps = {
	fetchMyTradesRequest: typeof fetchMyTradesRequest;
};

type MyTradesProps = StateProps & DispatchProps;

const MyTrades: FC<MyTradesProps> = ({ fetchMyTradesRequest, trades, isLoading, isLoaded }) => {
	useEffect(() => {
		fetchMyTradesRequest();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useInterval(() => {
		fetchMyTradesRequest();
	}, REFRESH_INTERVAL);

	return <TradeHistory trades={trades} isLoading={isLoading} isLoaded={isLoaded} />;
};

const mapStateToProps = (state: RootState): StateProps => ({
	trades: getMyTrades(state),
	isLoading: getIsLoadingMyTrades(state),
	isLoaded: getIsLoadedMyTrades(state),
});

const mapDispatchToProps: DispatchProps = {
	fetchMyTradesRequest,
};

export default connect<StateProps, DispatchProps, {}, RootState>(
	mapStateToProps,
	mapDispatchToProps
)(MyTrades);
