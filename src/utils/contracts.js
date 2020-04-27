export const synthSummaryUtilContract = {
	addresses: {
		1: '0x95A6a3f44a70172E7d50a9e28c85Dfd712756B8C',
		3: '0x15dfbBE6Ae0BA2B27d2E9Adb54C014C388255BE9',
		4: '0x4ec3cb1d571Cd3B7A3B3C99EC6dCa02610bd6f1e',
		42: '0x7Ce89dF3D8736c62F256224941F5F811D29d01Bf',
		108: '0x291094A1Bc145949A2149A58df9B5CB129109402',
	},
	abi: [
		{
			inputs: [
				{
					internalType: 'address',
					name: '_synthetix',
					type: 'address',
				},
				{
					internalType: 'address',
					name: '_exchangeRates',
					type: 'address',
				},
			],
			payable: false,
			stateMutability: 'nonpayable',
			type: 'constructor',
			signature: 'constructor',
		},
		{
			constant: true,
			inputs: [],
			name: 'exchangeRates',
			outputs: [
				{
					internalType: 'contract IExchangeRates',
					name: '',
					type: 'address',
				},
			],
			payable: false,
			stateMutability: 'view',
			type: 'function',
			signature: '0x4ffcd9df',
		},
		{
			constant: true,
			inputs: [],
			name: 'frozenSynths',
			outputs: [
				{
					internalType: 'bytes32[]',
					name: '',
					type: 'bytes32[]',
				},
			],
			payable: false,
			stateMutability: 'view',
			type: 'function',
			signature: '0xeade6d2d',
		},
		{
			constant: true,
			inputs: [],
			name: 'synthetix',
			outputs: [
				{
					internalType: 'contract ISynthetix',
					name: '',
					type: 'address',
				},
			],
			payable: false,
			stateMutability: 'view',
			type: 'function',
			signature: '0x759b5225',
		},
		{
			constant: true,
			inputs: [
				{
					internalType: 'address',
					name: 'account',
					type: 'address',
				},
			],
			name: 'synthsBalances',
			outputs: [
				{
					internalType: 'bytes32[]',
					name: '',
					type: 'bytes32[]',
				},
				{
					internalType: 'uint256[]',
					name: '',
					type: 'uint256[]',
				},
				{
					internalType: 'uint256[]',
					name: '',
					type: 'uint256[]',
				},
			],
			payable: false,
			stateMutability: 'view',
			type: 'function',
			signature: '0xa827bf48',
		},
		{
			constant: true,
			inputs: [],
			name: 'synthsRates',
			outputs: [
				{
					internalType: 'bytes32[]',
					name: '',
					type: 'bytes32[]',
				},
				{
					internalType: 'uint256[]',
					name: '',
					type: 'uint256[]',
				},
			],
			payable: false,
			stateMutability: 'view',
			type: 'function',
			signature: '0x27fe55a6',
		},
		{
			constant: true,
			inputs: [
				{
					internalType: 'address',
					name: 'account',
					type: 'address',
				},
				{
					internalType: 'bytes32',
					name: 'currencyKey',
					type: 'bytes32',
				},
			],
			name: 'totalSynthsInKey',
			outputs: [
				{
					internalType: 'uint256',
					name: 'total',
					type: 'uint256',
				},
			],
			payable: false,
			stateMutability: 'view',
			type: 'function',
			signature: '0x0120be33',
		},
		{
			constant: true,
			inputs: [
				{
					internalType: 'address[]',
					name: 'accounts',
					type: 'address[]',
				},
				{
					internalType: 'bytes32',
					name: 'currencyKey',
					type: 'bytes32',
				},
			],
			name: 'totalSynthsInKeyForAccounts',
			outputs: [
				{
					internalType: 'uint256[]',
					name: '',
					type: 'uint256[]',
				},
			],
			payable: false,
			stateMutability: 'view',
			type: 'function',
			signature: '0xc22700e9',
		},
	],
};
