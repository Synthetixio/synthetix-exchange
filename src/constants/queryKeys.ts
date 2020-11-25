import { CurrencyKey } from './currency';
import { Period } from './period';

export const QUERY_KEYS = {
	Synths: {
		HistoricalRates: (currencyKey: CurrencyKey, period: Period) => [
			'synths',
			'historicalRates',
			currencyKey,
			period,
		],
	},
	BinaryOptions: {
		Markets: ['binaryOptions', 'markets'],
		Market: (marketAddress: string) => ['binaryOptions', 'markets', marketAddress],
		AccountMarketInfo: (marketAddress: string, accountAddress: string) => [
			'binaryOptions',
			'markets',
			marketAddress,
			accountAddress,
		],
		RecentTransactions: (marketAddress: string) => ['binaryOptions', 'transactions', marketAddress],
		UserTransactions: (marketAddress: string, walletAddress: string) => [
			'binaryOptions',
			'transactions',
			marketAddress,
			walletAddress,
		],
		UserMarkets: (walletAddress: string) => ['binaryOptions', 'userMarkets', walletAddress],
		OptionPrices: (marketAddress: string, period: Period) => [
			'binaryOptions',
			marketAddress,
			period,
		],
	},
	HistoricalTrades: {
		AllTrades: ['historicalTrades', 'trades'],
		UserTrades: (walletAddress: string) => ['historicalTrades', 'trades', walletAddress],
		UserSettledTrades: (walletAddress: string) => [
			'historicalSettledTrades',
			'trades',
			walletAddress,
		],
	},
	Futures: {
		AllMarketSummaries: ['futures', 'allMarketSummaries'],
		MarketDetails: (marketAddress: string) => ['futures', 'marketDetails', marketAddress],
		PositionDetails: (marketAddress: string, walletAddress: string) => [
			'futures',
			'positionDetails',
			marketAddress,
			walletAddress,
		],
		Liquidations: ['futures', 'liquidations'],
	},
};

export default QUERY_KEYS;
