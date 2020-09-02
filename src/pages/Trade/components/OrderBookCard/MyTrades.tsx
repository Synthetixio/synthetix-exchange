import React, { FC } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from 'ducks/types';
import { getCurrentWalletAddress } from 'ducks/wallet/walletDetails';
import TradeHistory from './TradeHistory';

import { useTradesQuery } from 'queries/myTrades';

const mapStateToProps = (state: RootState) => ({
	walletAddress: getCurrentWalletAddress(state),
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type MyTradesProps = PropsFromRedux;

const MyTrades: FC<MyTradesProps> = ({ walletAddress }) => {
	const tradesQuery = useTradesQuery({ walletAddress: walletAddress || '' });

	return (
		<TradeHistory
			trades={tradesQuery.data || []}
			isLoading={tradesQuery.isLoading}
			isLoaded={tradesQuery.isSuccess}
			showSettled={true}
		/>
	);
};

export default connector(MyTrades);
