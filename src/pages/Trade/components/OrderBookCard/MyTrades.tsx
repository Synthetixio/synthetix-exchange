import React, { FC, useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
	fetchMyTradesRequest,
	getMyTrades,
	getIsLoadingMyTrades,
	getIsLoadedMyTrades,
} from 'ducks/trades/myTrades';

import { RootState } from 'ducks/types';

import useInterval from 'shared/hooks/useInterval';

import TradeHistory from './TradeHistory';

import { REFRESH_INTERVAL } from './constants';

const mapStateToProps = (state: RootState) => ({
	trades: getMyTrades(state),
	isLoading: getIsLoadingMyTrades(state),
	isLoaded: getIsLoadedMyTrades(state),
});

const mapDispatchToProps = {
	fetchMyTradesRequest,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type MyTradesProps = PropsFromRedux;

const MyTrades: FC<MyTradesProps> = ({ fetchMyTradesRequest, trades, isLoading, isLoaded }) => {
	useEffect(() => {
		fetchMyTradesRequest();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useInterval(() => {
		fetchMyTradesRequest();
	}, REFRESH_INTERVAL);

	return (
		<TradeHistory trades={trades} isLoading={isLoading} isLoaded={isLoaded} showSettled={true} />
	);
};

export default connector(MyTrades);
