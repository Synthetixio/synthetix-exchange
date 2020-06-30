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
		OptionPrices: (marketAddress: string, period: Period) => [
			'binaryOptions',
			marketAddress,
			period,
		],
	},
};

export default QUERY_KEYS;
