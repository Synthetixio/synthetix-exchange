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
import { ReactComponent as sMKRIcon } from '@synthetixio/assets/synths/sMKR.svg';
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
import { ReactComponent as iMKRIcon } from '@synthetixio/assets/synths/iMKR.svg';
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

export const CATEGORY = ['crypto', 'forex', 'equities', 'index', 'commodity', 'inverse'];
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
	'sMKR',
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
	'iMKR',
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

const CRYPTO_SYNTHS_BY_MC = [
	SYNTHS_MAP.sBTC,
	SYNTHS_MAP.sETH,
	SYNTHS_MAP.sXRP,
	SYNTHS_MAP.sBCH,
	SYNTHS_MAP.sLTC,
	SYNTHS_MAP.sEOS,
	SYNTHS_MAP.sBNB,
	SYNTHS_MAP.sXTZ,
	SYNTHS_MAP.sXMR,
	SYNTHS_MAP.sADA,
	SYNTHS_MAP.sLINK,
	SYNTHS_MAP.sTRX,
	SYNTHS_MAP.sDASH,
	SYNTHS_MAP.sETC,
	SYNTHS_MAP.iBTC,
	SYNTHS_MAP.iETH,
	SYNTHS_MAP.iXRP,
	SYNTHS_MAP.iBCH,
	SYNTHS_MAP.iLTC,
	SYNTHS_MAP.iEOS,
	SYNTHS_MAP.iBNB,
	SYNTHS_MAP.iXTZ,
	SYNTHS_MAP.iXMR,
	SYNTHS_MAP.iADA,
	SYNTHS_MAP.iLINK,
	SYNTHS_MAP.iTRX,
	SYNTHS_MAP.iDASH,
	SYNTHS_MAP.iETC,
];

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
	[SYNTHS_MAP.sMKR]: sMKRIcon,
	[SYNTHS_MAP.iMKR]: iMKRIcon,
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
	const excludedSynths = [SYNTHS_MAP.iMKR, SYNTHS_MAP.sMKR];
	const synths = SYNTHS.filter((synth) => !excludedSynths.includes(synth));

	// fiat markets trade against all synths
	FIAT_SYNTHS.forEach((quoteCurrencyKey) => {
		synths
			// ignore self
			.filter((baseCurrencyKey) => quoteCurrencyKey !== baseCurrencyKey)
			.forEach((baseCurrencyKey) => {
				marketNames.push({
					baseCurrencyKey,
					quoteCurrencyKey,
					pair: toMarketPair(baseCurrencyKey, quoteCurrencyKey),
				});
			});
	});

	// Each iteration a crypto synth is added to be skipped in the next one
	// So for [sBTC, sETH] crypto pairs, we would only end up with sETH/sBTC
	const skipCryptoQuotes: CurrencyKeys = [];

	// crypto markets trade against all synths (ex fiat, ex existing crypto market)
	CRYPTO_SYNTHS_BY_MC.forEach((quoteCurrencyKey: CurrencyKey) => {
		synths
			.filter(
				(baseCurrencyKey: CurrencyKey) =>
					quoteCurrencyKey !== baseCurrencyKey &&
					![...FIAT_SYNTHS, ...skipCryptoQuotes].includes(baseCurrencyKey)
			)
			.forEach((baseCurrencyKey: CurrencyKey) => {
				marketNames.push({
					baseCurrencyKey,
					quoteCurrencyKey,
					pair: toMarketPair(baseCurrencyKey, quoteCurrencyKey),
				});
			});

		skipCryptoQuotes.push(quoteCurrencyKey);
	});

	return marketNames;
});

export const getFilteredMarketNames = memoizeOne((quoteCurrencyKey: CurrencyKey) =>
	getAvailableMarketNames().filter((marketName) => marketName.quoteCurrencyKey === quoteCurrencyKey)
);
