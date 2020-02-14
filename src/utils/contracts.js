// To be added to SynthetixJS
export const synthSummaryUtilContract = {
	addresses: {
		1: '0xfB7ea8C81BE072cdCA3f90c17f6776f11ef5d0cE',
		3: '0xfB7ea8C81BE072cdCA3f90c17f6776f11ef5d0cE',
		4: '0xfB7ea8C81BE072cdCA3f90c17f6776f11ef5d0cE',
		42: '0xfB7ea8C81BE072cdCA3f90c17f6776f11ef5d0cE',
	},
	abi: [
		{
			constant: true,
			inputs: [
				{ name: 'account', type: 'address' },
				{ name: 'currencyKey', type: 'bytes32' },
			],
			name: 'totalSynthsInKey',
			outputs: [{ name: 'total', type: 'uint256' }],
			payable: false,
			stateMutability: 'view',
			type: 'function',
		},
		{
			constant: true,
			inputs: [],
			name: 'synthsRates',
			outputs: [
				{ name: '', type: 'bytes32[]' },
				{ name: '', type: 'uint256[]' },
			],
			payable: false,
			stateMutability: 'view',
			type: 'function',
		},
		{
			constant: true,
			inputs: [],
			name: 'exchangeRates',
			outputs: [{ name: '', type: 'address' }],
			payable: false,
			stateMutability: 'view',
			type: 'function',
		},
		{
			constant: true,
			inputs: [],
			name: 'synthetix',
			outputs: [{ name: '', type: 'address' }],
			payable: false,
			stateMutability: 'view',
			type: 'function',
		},
		{
			constant: true,
			inputs: [{ name: 'account', type: 'address' }],
			name: 'synthsBalances',
			outputs: [
				{ name: '', type: 'bytes32[]' },
				{ name: '', type: 'uint256[]' },
				{ name: '', type: 'uint256[]' },
			],
			payable: false,
			stateMutability: 'view',
			type: 'function',
		},
		{
			constant: true,
			inputs: [],
			name: 'frozenSynths',
			outputs: [{ name: '', type: 'bytes32[]' }],
			payable: false,
			stateMutability: 'view',
			type: 'function',
		},
		{
			inputs: [
				{ name: '_synthetix', type: 'address' },
				{ name: '_exchangeRates', type: 'address' },
			],
			payable: false,
			stateMutability: 'nonpayable',
			type: 'constructor',
		},
	],
};
