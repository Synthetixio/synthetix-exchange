import keyBy from 'lodash/keyBy';

export const SYNTHS = [
	'sBTC',
	'sETH',
	'sXRP',
	'sLTC',
	'sBNB',
	'sXTZ',
	'sTRX',
	'sLINK',
	'sMKR',
	'iBTC',
	'iETH',
	'iXRP',
	'iLTC',
	'iBNB',
	'iXTZ',
	'iTRX',
	'iLINK',
	'iMKR',
	'sEUR',
	'sJPY',
	'sUSD',
	'sAUD',
	'sGBP',
	'sCHF',
	'sXAU',
	'sXAG',
	'sCEX',
	'sDEFI',
	'iCEX',
	'iDEFI',
];
export const SYNTHS_MAP = keyBy(SYNTHS);

export const CRYPTO_CURRENCY = ['ETH', 'BTC'];
export const CRYPTO_CURRENCY_MAP = keyBy(CRYPTO_CURRENCY);

export const FIAT_CURRENCY = ['USD', 'AUD'];
export const FIAT_CURRENCY_MAP = keyBy(FIAT_CURRENCY);

export const isSynth = currency => !!SYNTHS_MAP[currency];
export const isCryptoCurrency = currency => !!CRYPTO_CURRENCY_MAP[currency];
export const isFiatCurrency = currency => !!FIAT_CURRENCY_MAP[currency];
