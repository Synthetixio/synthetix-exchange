import keyBy from 'lodash/keyBy';
import memoizeOne from 'memoize-one';

// Crypto
import { ReactComponent as BTCIcon } from 'assets/currencies/crypto/BTC.svg';
import { ReactComponent as ETHIcon } from 'assets/currencies/crypto/ETH.svg';
import { ReactComponent as XRPIcon } from 'assets/currencies/crypto/XRP.svg';
import { ReactComponent as BCHIcon } from 'assets/currencies/crypto/BCH.svg';
import { ReactComponent as LTCIcon } from 'assets/currencies/crypto/LTC.svg';
import { ReactComponent as EOSIcon } from 'assets/currencies/crypto/EOS.svg';
import { ReactComponent as BNBIcon } from 'assets/currencies/crypto/BNB.svg';
import { ReactComponent as XTZIcon } from 'assets/currencies/crypto/XTZ.svg';
import { ReactComponent as XMRIcon } from 'assets/currencies/crypto/XMR.svg';
import { ReactComponent as ADAIcon } from 'assets/currencies/crypto/ADA.svg';
import { ReactComponent as LINKIcon } from 'assets/currencies/crypto/LINK.svg';
import { ReactComponent as TRXIcon } from 'assets/currencies/crypto/TRX.svg';
import { ReactComponent as DASHIcon } from 'assets/currencies/crypto/DASH.svg';
import { ReactComponent as ETCIcon } from 'assets/currencies/crypto/ETC.svg';
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

export const CRYPTO_CURRENCY = [
	'BTC',
	'ETH',
	'XRP',
	'BCH',
	'LTC',
	'EOS',
	'BNB',
	'XTZ',
	'XMR',
	'ADA',
	'LINK',
	'TRX',
	'DASH',
	'ETC',
];
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
	[CRYPTO_CURRENCY_MAP.ETH]: { CryptoIcon: ETHIcon },
	[CRYPTO_CURRENCY_MAP.BTC]: { CryptoIcon: BTCIcon },
	[CRYPTO_CURRENCY_MAP.XRP]: { CryptoIcon: XRPIcon },
	[CRYPTO_CURRENCY_MAP.BCH]: { CryptoIcon: BCHIcon },
	[CRYPTO_CURRENCY_MAP.LTC]: { CryptoIcon: LTCIcon },
	[CRYPTO_CURRENCY_MAP.EOS]: { CryptoIcon: EOSIcon },
	[CRYPTO_CURRENCY_MAP.BNB]: { CryptoIcon: BNBIcon },
	[CRYPTO_CURRENCY_MAP.XTZ]: { CryptoIcon: XTZIcon },
	[CRYPTO_CURRENCY_MAP.XMR]: { CryptoIcon: XMRIcon },
	[CRYPTO_CURRENCY_MAP.ADA]: { CryptoIcon: ADAIcon },
	[CRYPTO_CURRENCY_MAP.LINK]: { CryptoIcon: LINKIcon },
	[CRYPTO_CURRENCY_MAP.TRX]: { CryptoIcon: TRXIcon },
	[CRYPTO_CURRENCY_MAP.DASH]: { CryptoIcon: DASHIcon },
	[CRYPTO_CURRENCY_MAP.ETC]: { CryptoIcon: ETCIcon },

	[SYNTHS_MAP.sBTC]: { SynthIcon: sBTCIcon, CryptoIcon: BTCIcon },
	[SYNTHS_MAP.sETH]: { SynthIcon: sETHIcon, CryptoIcon: ETHIcon },
	[SYNTHS_MAP.sXRP]: { SynthIcon: sXRPIcon, CryptoIcon: XRPIcon },
	[SYNTHS_MAP.sBCH]: { SynthIcon: sBCHIcon, CryptoIcon: BCHIcon },
	[SYNTHS_MAP.sLTC]: { SynthIcon: sLTCIcon, CryptoIcon: LTCIcon },
	[SYNTHS_MAP.sEOS]: { SynthIcon: sEOSIcon, CryptoIcon: EOSIcon },
	[SYNTHS_MAP.sBNB]: { SynthIcon: sBNBIcon, CryptoIcon: BNBIcon },
	[SYNTHS_MAP.sXTZ]: { SynthIcon: sXTZIcon, CryptoIcon: XTZIcon },
	[SYNTHS_MAP.sXMR]: { SynthIcon: sXMRIcon, CryptoIcon: XMRIcon },
	[SYNTHS_MAP.sADA]: { SynthIcon: sADAIcon, CryptoIcon: ADAIcon },
	[SYNTHS_MAP.sLINK]: { SynthIcon: sLINKIcon, CryptoIcon: LINKIcon },
	[SYNTHS_MAP.sTRX]: { SynthIcon: sTRXIcon, CryptoIcon: TRXIcon },
	[SYNTHS_MAP.sDASH]: { SynthIcon: sDASHIcon, CryptoIcon: DASHIcon },
	[SYNTHS_MAP.sETC]: { SynthIcon: sETCIcon, CryptoIcon: ETCIcon },
	[SYNTHS_MAP.iBTC]: { SynthIcon: iBTCIcon, CryptoIcon: BTCIcon },
	[SYNTHS_MAP.iETH]: { SynthIcon: iETHIcon, CryptoIcon: ETHIcon },
	[SYNTHS_MAP.iXRP]: { SynthIcon: iXRPIcon, CryptoIcon: XRPIcon },
	[SYNTHS_MAP.iBCH]: { SynthIcon: iBCHIcon, CryptoIcon: BCHIcon },
	[SYNTHS_MAP.iLTC]: { SynthIcon: iLTCIcon, CryptoIcon: LTCIcon },
	[SYNTHS_MAP.iEOS]: { SynthIcon: iEOSIcon, CryptoIcon: EOSIcon },
	[SYNTHS_MAP.iBNB]: { SynthIcon: iBNBIcon, CryptoIcon: BNBIcon },
	[SYNTHS_MAP.iXTZ]: { SynthIcon: iXTZIcon, CryptoIcon: XTZIcon },
	[SYNTHS_MAP.iXMR]: { SynthIcon: iXMRIcon, CryptoIcon: XMRIcon },
	[SYNTHS_MAP.iADA]: { SynthIcon: iADAIcon, CryptoIcon: ADAIcon },
	[SYNTHS_MAP.iLINK]: { SynthIcon: iLINKIcon, CryptoIcon: LINKIcon },
	[SYNTHS_MAP.iTRX]: { SynthIcon: iTRXIcon, CryptoIcon: TRXIcon },
	[SYNTHS_MAP.iDASH]: { SynthIcon: iDASHIcon, CryptoIcon: DASHIcon },
	[SYNTHS_MAP.iETC]: { SynthIcon: iETCIcon, CryptoIcon: ETCIcon },
	[SYNTHS_MAP.sEUR]: { SynthIcon: sEURIcon },
	[SYNTHS_MAP.sJPY]: { SynthIcon: sJPYIcon },
	[SYNTHS_MAP.sUSD]: { SynthIcon: sUSDIcon },
	[SYNTHS_MAP.sAUD]: { SynthIcon: sAUDIcon },
	[SYNTHS_MAP.sGBP]: { SynthIcon: sGBPIcon },
	[SYNTHS_MAP.sCHF]: { SynthIcon: sCHFIcon },
	[SYNTHS_MAP.sXAU]: { SynthIcon: sXAUIcon },
	[SYNTHS_MAP.sXAG]: { SynthIcon: sXAGIcon },
	[SYNTHS_MAP.sBZ]: { SynthIcon: sBZIcon },
	[SYNTHS_MAP.sCEX]: { SynthIcon: sCEXIcon },
	[SYNTHS_MAP.sDEFI]: { SynthIcon: sDEFIIcon },
	[SYNTHS_MAP.iCEX]: { SynthIcon: iCEXIcon },
	[SYNTHS_MAP.iDEFI]: { SynthIcon: iDEFIIcon },
	[SYNTHS_MAP.sFTSE]: { SynthIcon: sFTSEIcon },
	[SYNTHS_MAP.sNIKKEI]: { SynthIcon: sNIKKEIIcon },
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
