import React, { FC } from 'react';
import { useQuery } from 'react-query';
import { connect, ConnectedProps } from 'react-redux';
import snxData from 'synthetix-data';
import { SYNTHS_MAP } from 'constants/currency';

import { RootState } from 'ducks/types';
import { getIsWalletConnected, getCurrentWalletAddress } from 'ducks/wallet/walletDetails';
import { normalizeTrades } from 'ducks/trades/utils';
import TradeHistory from './TradeHistory';

import { REFRESH_INTERVAL } from './constants';
import { HistoricalTrades } from 'ducks/trades/types';
import QUERY_KEYS from 'constants/queryKeys';
import { CurrencyKey } from 'constants/currency';

const MAX_TRADES = 100;

const mapStateToProps = (state: RootState) => ({
	walletAddress: getCurrentWalletAddress(state),
	isWalletConnected: getIsWalletConnected(state),
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type MyTradesProps = PropsFromRedux;

type SettledTrade = {
	exchangeTimestamp: number;
	dest: CurrencyKey;
	src: CurrencyKey;
	amount: number;
	rebate: number;
	reclaim: number;
};
type SettledTrades = SettledTrade[];

const MyTrades: FC<MyTradesProps> = ({ walletAddress, isWalletConnected }) => {
	const settledTradesQuery = useQuery<SettledTrades, any>(
		QUERY_KEYS.HistoricalTrades.AllTrades,
		() =>
			snxData.exchanger.exchangeEntriesSettled({
				from: walletAddress,
				max: MAX_TRADES,
			}),
		{
			refetchInterval: REFRESH_INTERVAL,
		}
	);

	const tradesQuery = useQuery<HistoricalTrades, any>(
		QUERY_KEYS.HistoricalTrades.MyTrades(walletAddress || ''),
		() =>
			snxData.exchanges.since({
				fromAddress: walletAddress,
				maxBlock: Number.MAX_SAFE_INTEGER,
				max: MAX_TRADES,
			}),
		{
			refetchInterval: REFRESH_INTERVAL,
			enabled: !!settledTradesQuery.data,
		}
	);

	let trades = normalizeTrades(tradesQuery.data || []);
	trades = trades.map((trade) => {
		const settledTrade =
			!!settledTradesQuery &&
			!!settledTradesQuery.data &&
			settledTradesQuery.data.find(
				(settledTrade) =>
					trade.timestamp === settledTrade.exchangeTimestamp &&
					settledTrade.dest === trade.toCurrencyKey &&
					settledTrade.src === trade.fromCurrencyKey &&
					trade.fromAmount === settledTrade.amount
			);

		trade.isSettled = false;
		if (!!settledTrade) {
			console.log(settledTrade);
			trade.rebate = settledTrade.rebate;
			trade.reclaim = settledTrade.reclaim;

			// special case for when the currency is priced in sUSD
			const feeReclaimRebateAmount =
				trade.toCurrencyKey === SYNTHS_MAP.sUSD
					? settledTrade.rebate - settledTrade.reclaim
					: settledTrade.reclaim - settledTrade.rebate;

			// ( shiftAmount / amount ) * price -> gets us the price shift
			// to get the new price, we just add the price shift (which might be a negative or positive number)
			trade.settledPrice = (feeReclaimRebateAmount / trade.toAmount) * trade.price + trade.price;
			trade.isSettled = true;
			trade.amount = Math.abs(feeReclaimRebateAmount);
		}
		return trade;
	});

	return (
		<TradeHistory
			trades={trades}
			isLoading={tradesQuery.isLoading}
			isLoaded={tradesQuery.isSuccess}
			showSettled={true}
		/>
	);
};

export default connector(MyTrades);
