export const QUERY_KEYS = {
	BinaryOptions: {
		Markets: ['binaryOptions', 'markets'],
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
