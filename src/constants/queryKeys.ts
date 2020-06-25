export const QUERY_KEYS = {
	BinaryOptions: {
		Markets: ['binaryOptions', 'markets'],
		Market: (marketAddress: string) => ['binaryOptions', 'markets', marketAddress],
		RecentTransactions: (marketAddress: string) => ['binaryOptions', 'transactions', marketAddress],
		UserTransactions: (marketAddress: string, walletAddress: string) => [
			'binaryOptions',
			'transactions',
			marketAddress,
			walletAddress,
		],
	},
};

export default QUERY_KEYS;
