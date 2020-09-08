import { useQuery } from 'react-query';
import snxData from 'synthetix-data';

import { HistoricalTrades } from 'ducks/trades/types';
import { CurrencyKey, SYNTHS_MAP } from 'constants/currency';

import { normalizeTrades } from 'ducks/trades/utils';
import { REFRESH_INTERVAL } from 'pages/Trade/components/OrderBookCard/constants';
import QUERY_KEYS from 'constants/queryKeys';

const MAX_TRADES = 100;

type SettledTrade = {
	exchangeTimestamp: number;
	dest: CurrencyKey;
	src: CurrencyKey;
	amount: number;
	rebate: number;
	reclaim: number;
};
type SettledTrades = SettledTrade[];

export const useAllTradesQuery = () =>
	useQuery<HistoricalTrades, any>(
		QUERY_KEYS.HistoricalTrades.AllTrades,
		() =>
			snxData.exchanges.since({
				maxBlock: Number.MAX_SAFE_INTEGER,
				max: 100,
			}),
		{
			refetchInterval: REFRESH_INTERVAL,
		}
	);

export const useSettledTradesQuery = ({ walletAddress }: { walletAddress: string }) =>
	useQuery<SettledTrades, any>(
		QUERY_KEYS.HistoricalTrades.UserSettledTrades(walletAddress),
		() =>
			snxData.exchanger.exchangeEntriesSettled({
				from: walletAddress,
				max: MAX_TRADES,
			}),
		{
			enabled: walletAddress !== '',
		}
	);

export const useTradesQuery = ({ walletAddress }: { walletAddress: string }) => {
	const settledTradesQuery = useSettledTradesQuery({ walletAddress });
	const tradesQuery = useQuery<HistoricalTrades, any>(
		QUERY_KEYS.HistoricalTrades.UserTrades(walletAddress),
		() =>
			snxData.exchanges
				.since({
					fromAddress: walletAddress,
					maxBlock: Number.MAX_SAFE_INTEGER,
					max: MAX_TRADES,
				})
				.then((trades: HistoricalTrades) =>
					mergeSettledTradesQueryData(trades, settledTradesQuery.data || [])
				),
		{
			refetchInterval: REFRESH_INTERVAL,
			enabled: walletAddress !== '' && !!settledTradesQuery.data,
		}
	);

	return tradesQuery;
};

const mergeSettledTradesQueryData = (trades: HistoricalTrades, settledTrades: SettledTrades) => {
	return normalizeTrades(trades).map((trade) => {
		const settledTrade = settledTrades.find(
			(settledTrade: SettledTrade) =>
				trade.timestamp === settledTrade.exchangeTimestamp &&
				settledTrade.dest === trade.toCurrencyKey &&
				settledTrade.src === trade.fromCurrencyKey &&
				trade.fromAmount === settledTrade.amount
		);

		trade.isSettled = false;
		if (!!settledTrade) {
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
};
