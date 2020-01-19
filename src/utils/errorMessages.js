const USER_DENIED = { type: 'cancelled', message: 'User denied transaction signature' };

const ERROR_CODES = {
	Metamask: {
		'-32603': USER_DENIED,
		'4001': USER_DENIED,
	},
	Ledger: {
		'27013': USER_DENIED,
	},
	Trezor: {},
	Coinbase: {
		'-32603': USER_DENIED,
	},
};

export default (error, walletType) => {
	const code = (error.code || error.statusCode).toString();
	if (!code || !ERROR_CODES[walletType][code]) {
		return { message: error.message || 'Error' };
	}
	return { code, ...ERROR_CODES[walletType][code] };
};
