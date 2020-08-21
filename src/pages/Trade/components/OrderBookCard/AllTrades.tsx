import React, { FC, useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
	fetchAllTradesRequest,
	getAllTrades,
	getIsLoadingAllTrades,
	getIsLoadedAllTrades,
} from 'ducks/trades/allTrades';

import { RootState } from 'ducks/types';

import useInterval from 'shared/hooks/useInterval';

import TradeHistory from './TradeHistory';

import { REFRESH_INTERVAL } from './constants';

const mapStateToProps = (state: RootState) => ({
	trades: getAllTrades(state),
	isLoaded: getIsLoadedAllTrades(state),
	isLoading: getIsLoadingAllTrades(state),
});

const mapDispatchToProps = {
	fetchAllTradesRequest,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type AllTradesProps = PropsFromRedux;

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

export default connector(AllTrades);
