import React, { FC, useEffect } from 'react';
import { connect } from 'react-redux';

import {
	fetchAllTradesRequest,
	getAllTrades,
	getIsLoadingAllTrades,
	getIsLoadedAllTrades,
} from 'ducks/trades/allTrades';

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
	fetchAllTradesRequest: typeof fetchAllTradesRequest;
};

type AllTradesProps = StateProps & DispatchProps;

const AllTrades: FC<AllTradesProps> = ({ fetchAllTradesRequest, trades, isLoading, isLoaded }) => {
	useEffect(() => {
		fetchAllTradesRequest();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useInterval(() => {
		fetchAllTradesRequest();
	}, REFRESH_INTERVAL);

	return <TradeHistory trades={trades} isLoading={isLoading} isLoaded={isLoaded} />;
};

const mapStateToProps = (state: RootState): StateProps => ({
	trades: getAllTrades(state),
	isLoaded: getIsLoadedAllTrades(state),
	isLoading: getIsLoadingAllTrades(state),
});

const mapDispatchToProps: DispatchProps = {
	fetchAllTradesRequest,
};

export default connect<StateProps, DispatchProps, {}, RootState>(
	mapStateToProps,
	mapDispatchToProps
)(AllTrades);
