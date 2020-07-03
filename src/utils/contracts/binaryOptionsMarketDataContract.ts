export const binaryOptionsMarketDataContract = {
	addresses: {
		1: '0xDAdEa8352661FF961956c7aB5425839A400535a4',
		3: '0x953Cb51942084edd0e1E6BdCBa9e19eCDfC3BdFd',
		4: '0x99D378835E2981e4AA8EeF08090d5621853dfC34',
		42: '0xe9d2762643Ab57a07b4fb91E38D13e501d2cbaAd',
	},
	abi: [
		{
			constant: true,
			inputs: [
				{ internalType: 'contract IBinaryOptionMarket', name: 'market', type: 'address' },
				{ internalType: 'address', name: 'account', type: 'address' },
			],
			name: 'getAccountMarketData',
			outputs: [
				{
					components: [
						{
							components: [
								{ internalType: 'uint256', name: 'long', type: 'uint256' },
								{ internalType: 'uint256', name: 'short', type: 'uint256' },
							],
							internalType: 'struct BinaryOptionMarketData.OptionValues',
							name: 'bids',
							type: 'tuple',
						},
						{
							components: [
								{ internalType: 'uint256', name: 'long', type: 'uint256' },
								{ internalType: 'uint256', name: 'short', type: 'uint256' },
							],
							internalType: 'struct BinaryOptionMarketData.OptionValues',
							name: 'claimable',
							type: 'tuple',
						},
						{
							components: [
								{ internalType: 'uint256', name: 'long', type: 'uint256' },
								{ internalType: 'uint256', name: 'short', type: 'uint256' },
							],
							internalType: 'struct BinaryOptionMarketData.OptionValues',
							name: 'balances',
							type: 'tuple',
						},
					],
					internalType: 'struct BinaryOptionMarketData.AccountData',
					name: '',
					type: 'tuple',
				},
			],
			payable: false,
			stateMutability: 'view',
			type: 'function',
		},
		{
			constant: true,
			inputs: [{ internalType: 'contract IBinaryOptionMarket', name: 'market', type: 'address' }],
			name: 'getMarketData',
			outputs: [
				{
					components: [
						{
							components: [
								{ internalType: 'uint256', name: 'price', type: 'uint256' },
								{ internalType: 'uint256', name: 'updatedAt', type: 'uint256' },
							],
							internalType: 'struct BinaryOptionMarketData.OraclePriceAndTimestamp',
							name: 'oraclePriceAndTimestamp',
							type: 'tuple',
						},
						{
							components: [
								{ internalType: 'uint256', name: 'long', type: 'uint256' },
								{ internalType: 'uint256', name: 'short', type: 'uint256' },
							],
							internalType: 'struct IBinaryOptionMarket.Prices',
							name: 'prices',
							type: 'tuple',
						},
						{
							components: [
								{ internalType: 'uint256', name: 'deposited', type: 'uint256' },
								{ internalType: 'uint256', name: 'exercisableDeposits', type: 'uint256' },
							],
							internalType: 'struct BinaryOptionMarketData.Deposits',
							name: 'deposits',
							type: 'tuple',
						},
						{
							components: [
								{ internalType: 'bool', name: 'resolved', type: 'bool' },
								{ internalType: 'bool', name: 'canResolve', type: 'bool' },
							],
							internalType: 'struct BinaryOptionMarketData.Resolution',
							name: 'resolution',
							type: 'tuple',
						},
						{ internalType: 'enum IBinaryOptionMarket.Phase', name: 'phase', type: 'uint8' },
						{ internalType: 'enum IBinaryOptionMarket.Side', name: 'result', type: 'uint8' },
						{
							components: [
								{ internalType: 'uint256', name: 'long', type: 'uint256' },
								{ internalType: 'uint256', name: 'short', type: 'uint256' },
							],
							internalType: 'struct BinaryOptionMarketData.OptionValues',
							name: 'totalBids',
							type: 'tuple',
						},
						{
							components: [
								{ internalType: 'uint256', name: 'long', type: 'uint256' },
								{ internalType: 'uint256', name: 'short', type: 'uint256' },
							],
							internalType: 'struct BinaryOptionMarketData.OptionValues',
							name: 'totalClaimableSupplies',
							type: 'tuple',
						},
						{
							components: [
								{ internalType: 'uint256', name: 'long', type: 'uint256' },
								{ internalType: 'uint256', name: 'short', type: 'uint256' },
							],
							internalType: 'struct BinaryOptionMarketData.OptionValues',
							name: 'totalSupplies',
							type: 'tuple',
						},
					],
					internalType: 'struct BinaryOptionMarketData.MarketData',
					name: '',
					type: 'tuple',
				},
			],
			payable: false,
			stateMutability: 'view',
			type: 'function',
		},
		{
			constant: true,
			inputs: [{ internalType: 'contract IBinaryOptionMarket', name: 'market', type: 'address' }],
			name: 'getMarketParameters',
			outputs: [
				{
					components: [
						{ internalType: 'address', name: 'creator', type: 'address' },
						{
							components: [
								{ internalType: 'contract IBinaryOption', name: 'long', type: 'address' },
								{ internalType: 'contract IBinaryOption', name: 'short', type: 'address' },
							],
							internalType: 'struct IBinaryOptionMarket.Options',
							name: 'options',
							type: 'tuple',
						},
						{
							components: [
								{ internalType: 'uint256', name: 'biddingEnd', type: 'uint256' },
								{ internalType: 'uint256', name: 'maturity', type: 'uint256' },
								{ internalType: 'uint256', name: 'expiry', type: 'uint256' },
							],
							internalType: 'struct IBinaryOptionMarket.Times',
							name: 'times',
							type: 'tuple',
						},
						{
							components: [
								{ internalType: 'bytes32', name: 'key', type: 'bytes32' },
								{ internalType: 'uint256', name: 'strikePrice', type: 'uint256' },
								{ internalType: 'uint256', name: 'finalPrice', type: 'uint256' },
							],
							internalType: 'struct IBinaryOptionMarket.OracleDetails',
							name: 'oracleDetails',
							type: 'tuple',
						},
						{
							components: [
								{ internalType: 'uint256', name: 'poolFee', type: 'uint256' },
								{ internalType: 'uint256', name: 'creatorFee', type: 'uint256' },
								{ internalType: 'uint256', name: 'refundFee', type: 'uint256' },
							],
							internalType: 'struct IBinaryOptionMarketManager.Fees',
							name: 'fees',
							type: 'tuple',
						},
						{
							components: [
								{ internalType: 'uint256', name: 'capitalRequirement', type: 'uint256' },
								{ internalType: 'uint256', name: 'skewLimit', type: 'uint256' },
							],
							internalType: 'struct IBinaryOptionMarketManager.CreatorLimits',
							name: 'creatorLimits',
							type: 'tuple',
						},
					],
					internalType: 'struct BinaryOptionMarketData.MarketParameters',
					name: '',
					type: 'tuple',
				},
			],
			payable: false,
			stateMutability: 'view',
			type: 'function',
		},
	],
};

export default binaryOptionsMarketDataContract;
