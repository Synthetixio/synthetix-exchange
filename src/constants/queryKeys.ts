import { CurrencyKey } from './currency';
import { Period } from './period';

export const QUERY_KEYS = {
	Trades: {
		LimitOrders: (walletAddress: string) => ['trades', 'limitOrders', walletAddress],
	},
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
};

export default QUERY_KEYS;
