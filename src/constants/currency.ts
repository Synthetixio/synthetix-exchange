import keyBy from 'lodash/keyBy';
import memoizeOne from 'memoize-one';

// Crypto
import { ReactComponent as ETHIcon } from 'assets/currencies/crypto/ETH.svg';
// Crypto Synths
import { ReactComponent as sBTCIcon } from '@synthetixio/assets/synths/sBTC.svg';
import { ReactComponent as sETHIcon } from '@synthetixio/assets/synths/sETH.svg';
import { ReactComponent as sXRPIcon } from '@synthetixio/assets/synths/sXRP.svg';
import { ReactComponent as sBCHIcon } from '@synthetixio/assets/synths/sBCH.svg';
import { ReactComponent as sLTCIcon } from '@synthetixio/assets/synths/sLTC.svg';
import { ReactComponent as sEOSIcon } from '@synthetixio/assets/synths/sEOS.svg';
import { ReactComponent as sBNBIcon } from '@synthetixio/assets/synths/sBNB.svg';
import { ReactComponent as sXTZIcon } from '@synthetixio/assets/synths/sXTZ.svg';
import { ReactComponent as sXMRIcon } from '@synthetixio/assets/synths/sXMR.svg';
import { ReactComponent as sADAIcon } from '@synthetixio/assets/synths/sADA.svg';
import { ReactComponent as sLINKIcon } from '@synthetixio/assets/synths/sLINK.svg';
import { ReactComponent as sTRXIcon } from '@synthetixio/assets/synths/sTRX.svg';
import { ReactComponent as sDASHIcon } from '@synthetixio/assets/synths/sDASH.svg';
import { ReactComponent as sETCIcon } from '@synthetixio/assets/synths/sETC.svg';
import { ReactComponent as iBTCIcon } from '@synthetixio/assets/synths/iBTC.svg';
import { ReactComponent as iETHIcon } from '@synthetixio/assets/synths/iETH.svg';
import { ReactComponent as iXRPIcon } from '@synthetixio/assets/synths/iXRP.svg';
import { ReactComponent as iBCHIcon } from '@synthetixio/assets/synths/iBCH.svg';
import { ReactComponent as iLTCIcon } from '@synthetixio/assets/synths/iLTC.svg';
import { ReactComponent as iEOSIcon } from '@synthetixio/assets/synths/iEOS.svg';
import { ReactComponent as iBNBIcon } from '@synthetixio/assets/synths/iBNB.svg';
import { ReactComponent as iXTZIcon } from '@synthetixio/assets/synths/iXTZ.svg';
import { ReactComponent as iXMRIcon } from '@synthetixio/assets/synths/iXMR.svg';
import { ReactComponent as iADAIcon } from '@synthetixio/assets/synths/iADA.svg';
import { ReactComponent as iLINKIcon } from '@synthetixio/assets/synths/iLINK.svg';
import { ReactComponent as iTRXIcon } from '@synthetixio/assets/synths/iTRX.svg';
import { ReactComponent as iDASHIcon } from '@synthetixio/assets/synths/iDASH.svg';
import { ReactComponent as iETCIcon } from '@synthetixio/assets/synths/iETC.svg';
// Commoditiy Synths
import { ReactComponent as sXAUIcon } from '@synthetixio/assets/synths/sXAU.svg';
import { ReactComponent as sXAGIcon } from '@synthetixio/assets/synths/sXAG.svg';
import { ReactComponent as sBZIcon } from '@synthetixio/assets/synths/sBZ.svg';
// Crypto Index Synths
import { ReactComponent as sDEFIIcon } from '@synthetixio/assets/synths/sDEFI.svg';
import { ReactComponent as sCEXIcon } from '@synthetixio/assets/synths/sCEX.svg';
import { ReactComponent as iDEFIIcon } from '@synthetixio/assets/synths/iDEFI.svg';
import { ReactComponent as iCEXIcon } from '@synthetixio/assets/synths/iCEX.svg';
// Equity Synths
import { ReactComponent as sFTSEIcon } from '@synthetixio/assets/synths/sFTSE.svg';
import { ReactComponent as sNIKKEIIcon } from '@synthetixio/assets/synths/sNIKKEI.svg';
// Forex Synths
import { ReactComponent as sEURIcon } from '@synthetixio/assets/synths/sEUR.svg';
import { ReactComponent as sJPYIcon } from '@synthetixio/assets/synths/sJPY.svg';
import { ReactComponent as sUSDIcon } from '@synthetixio/assets/synths/sUSD.svg';
import { ReactComponent as sAUDIcon } from '@synthetixio/assets/synths/sAUD.svg';
import { ReactComponent as sGBPIcon } from '@synthetixio/assets/synths/sGBP.svg';
import { ReactComponent as sCHFIcon } from '@synthetixio/assets/synths/sCHF.svg';

export type CurrencyKey = string;
export type CurrencyKeys = string[];

// TODO: standardize this
export type Category = 'crypto' | 'forex' | 'equities' | 'index' | 'commodity' | 'inverse';

export const CATEGORY: Category[] = [
	'crypto',
	'forex',
	'equities',
	'index',
	'commodity',
	'inverse',
];
export const CATEGORY_MAP = keyBy(CATEGORY);

export const SYNTHS = [
	'sBTC',
	'sETH',
	'sXRP',
	'sBCH',
	'sLTC',
	'sEOS',
	'sBNB',
	'sXTZ',
	'sXMR',
	'sADA',
	'sLINK',
	'sTRX',
	'sDASH',
	'sETC',
	'iBTC',
	'iETH',
	'iXRP',
	'iBCH',
	'iLTC',
	'iEOS',
	'iBNB',
	'iXTZ',
	'iXMR',
	'iADA',
	'iLINK',
	'iTRX',
	'iDASH',
	'iETC',
	'sFTSE',
	'sNIKKEI',
	'sXAU',
	'sXAG',
	// 'sBZ',
	'sEUR',
	'sJPY',
	'sUSD',
	'sAUD',
	'sGBP',
	'sCHF',
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

// lower rank -> higher MC
export const CRYPTO_SYNTHS_BY_MC = {
	[SYNTHS_MAP.sBTC]: 1,
	[SYNTHS_MAP.sETH]: 2,
	[SYNTHS_MAP.sXRP]: 3,
	[SYNTHS_MAP.sBCH]: 4,
	[SYNTHS_MAP.sLTC]: 5,
	[SYNTHS_MAP.sEOS]: 6,
	[SYNTHS_MAP.sBNB]: 7,
	[SYNTHS_MAP.sXTZ]: 8,
	[SYNTHS_MAP.sXMR]: 9,
	[SYNTHS_MAP.sADA]: 10,
	[SYNTHS_MAP.sLINK]: 11,
	[SYNTHS_MAP.sTRX]: 12,
	[SYNTHS_MAP.sDASH]: 13,
	[SYNTHS_MAP.sETC]: 14,
	[SYNTHS_MAP.iBTC]: 15,
	[SYNTHS_MAP.iETH]: 16,
	[SYNTHS_MAP.iXRP]: 17,
	[SYNTHS_MAP.iBCH]: 18,
	[SYNTHS_MAP.iLTC]: 19,
	[SYNTHS_MAP.iEOS]: 20,
	[SYNTHS_MAP.iBNB]: 21,
	[SYNTHS_MAP.iXTZ]: 22,
	[SYNTHS_MAP.iXMR]: 23,
	[SYNTHS_MAP.iADA]: 24,
	[SYNTHS_MAP.iLINK]: 25,
	[SYNTHS_MAP.iTRX]: 26,
	[SYNTHS_MAP.iDASH]: 27,
	[SYNTHS_MAP.iETC]: 28,
};

export const currencyKeyToIconMap = {
	[CRYPTO_CURRENCY_MAP.ETH]: ETHIcon,

	[SYNTHS_MAP.sBTC]: sBTCIcon,
	[SYNTHS_MAP.sETH]: sETHIcon,
	[SYNTHS_MAP.sXRP]: sXRPIcon,
	[SYNTHS_MAP.sBCH]: sBCHIcon,
	[SYNTHS_MAP.sLTC]: sLTCIcon,
	[SYNTHS_MAP.sEOS]: sEOSIcon,
	[SYNTHS_MAP.sBNB]: sBNBIcon,
	[SYNTHS_MAP.sXTZ]: sXTZIcon,
	[SYNTHS_MAP.sXMR]: sXMRIcon,
	[SYNTHS_MAP.sADA]: sADAIcon,
	[SYNTHS_MAP.sLINK]: sLINKIcon,
	[SYNTHS_MAP.sTRX]: sTRXIcon,
	[SYNTHS_MAP.sDASH]: sDASHIcon,
	[SYNTHS_MAP.sETC]: sETCIcon,
	[SYNTHS_MAP.iBTC]: iBTCIcon,
	[SYNTHS_MAP.iETH]: iETHIcon,
	[SYNTHS_MAP.iXRP]: iXRPIcon,
	[SYNTHS_MAP.iBCH]: iBCHIcon,
	[SYNTHS_MAP.iLTC]: iLTCIcon,
	[SYNTHS_MAP.iEOS]: iEOSIcon,
	[SYNTHS_MAP.iBNB]: iBNBIcon,
	[SYNTHS_MAP.iXTZ]: iXTZIcon,
	[SYNTHS_MAP.iXMR]: iXMRIcon,
	[SYNTHS_MAP.iADA]: iADAIcon,
	[SYNTHS_MAP.iLINK]: iLINKIcon,
	[SYNTHS_MAP.iTRX]: iTRXIcon,
	[SYNTHS_MAP.iDASH]: iDASHIcon,
	[SYNTHS_MAP.iETC]: iETCIcon,
	[SYNTHS_MAP.sEUR]: sEURIcon,
	[SYNTHS_MAP.sJPY]: sJPYIcon,
	[SYNTHS_MAP.sUSD]: sUSDIcon,
	[SYNTHS_MAP.sAUD]: sAUDIcon,
	[SYNTHS_MAP.sGBP]: sGBPIcon,
	[SYNTHS_MAP.sCHF]: sCHFIcon,
	[SYNTHS_MAP.sXAU]: sXAUIcon,
	[SYNTHS_MAP.sXAG]: sXAGIcon,
	[SYNTHS_MAP.sBZ]: sBZIcon,
	[SYNTHS_MAP.sCEX]: sCEXIcon,
	[SYNTHS_MAP.sDEFI]: sDEFIIcon,
	[SYNTHS_MAP.iCEX]: iCEXIcon,
	[SYNTHS_MAP.iDEFI]: iDEFIIcon,
	[SYNTHS_MAP.sFTSE]: sFTSEIcon,
	[SYNTHS_MAP.sNIKKEI]: sNIKKEIIcon,
};

export const isSynth = (currencyKey: CurrencyKey) => !!SYNTHS_MAP[currencyKey];
export const isCryptoCurrency = (currencyKey: CurrencyKey) => !!CRYPTO_CURRENCY_MAP[currencyKey];
export const isFiatCurrency = (currencyKey: CurrencyKey) => !!FIAT_CURRENCY_MAP[currencyKey];
export const toMarketPair = (baseCurrencyKey: CurrencyKey, quoteCurrencyKey: CurrencyKey) =>
	`${baseCurrencyKey}-${quoteCurrencyKey}`;

// TODO: replace this with a more robust logic (like checking the asset field)
export const toInverseSynth = (currencyKey: CurrencyKey) => currencyKey.replace(/^s/i, 'i');
export const toStandardSynth = (currencyKey: CurrencyKey) => currencyKey.replace(/^i/i, 's');

export const sUSD_EXCHANGE_RATE = 1;

export const FIAT_SYNTHS = [
	SYNTHS_MAP.sEUR,
	SYNTHS_MAP.sJPY,
	SYNTHS_MAP.sUSD,
	SYNTHS_MAP.sAUD,
	SYNTHS_MAP.sGBP,
	SYNTHS_MAP.sCHF,
];

export const BASE_TRADING_PAIRS = [SYNTHS_MAP.sUSD, SYNTHS_MAP.sBTC, SYNTHS_MAP.sETH];

export const getAvailableMarketNames = memoizeOne(() => {
	const marketNames: Array<{
		baseCurrencyKey: CurrencyKey;
		quoteCurrencyKey: CurrencyKey;
		pair: string;
	}> = [];

	for (let i = 0; i < SYNTHS.length; i++) {
		const currencyA = SYNTHS[i];
		for (let j = 0; j < SYNTHS.length; j++) {
			const currencyB = SYNTHS[j];
			if (currencyA !== currencyB) {
				marketNames.push({
					baseCurrencyKey: currencyA,
					quoteCurrencyKey: currencyB,
					pair: toMarketPair(currencyA, currencyB),
				});
			}
		}
	}

	return marketNames;
});

export const getFilteredMarketNames = memoizeOne(
	(currencyKey: CurrencyKey, type: 'base' | 'quote') =>
		getAvailableMarketNames().filter((marketName) =>
			type === 'base'
				? marketName.baseCurrencyKey === currencyKey
				: marketName.quoteCurrencyKey === currencyKey
		)
);

export const getMarketPairByMC = memoizeOne(
	(baseCurrencyKey: CurrencyKey, quoteCurrencyKey: CurrencyKey) => {
		const marketPair = {
			base: baseCurrencyKey,
			quote: quoteCurrencyKey,
			reversed: false,
		};

		const marketPairReversed = {
			base: quoteCurrencyKey,
			quote: baseCurrencyKey,
			reversed: true,
		};

		// handle fiat first - it must always be the quote
		if (FIAT_SYNTHS.includes(quoteCurrencyKey)) {
			return marketPair;
		}
		if (FIAT_SYNTHS.includes(baseCurrencyKey)) {
			return marketPairReversed;
		}

		// set a really high rank for low MC coins
		const baseCurrencyKeyRank = CRYPTO_SYNTHS_BY_MC[baseCurrencyKey] || Number.MAX_SAFE_INTEGER;
		const quoteCurrencyKeyRank = CRYPTO_SYNTHS_BY_MC[quoteCurrencyKey] || Number.MAX_SAFE_INTEGER;

		// lower rank -> higher MC
		return quoteCurrencyKeyRank <= baseCurrencyKeyRank ? marketPair : marketPairReversed;
	}
);
