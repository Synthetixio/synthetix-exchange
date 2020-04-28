import keyBy from 'lodash/keyBy';
import memoizeOne from 'memoize-one';

// Crypto
import { ReactComponent as ETHIcon } from '../assets/currencies/crypto/ETH.svg';
// Crypto Synths
import { ReactComponent as sBTCIcon } from '../assets/currencies/synths/sBTC.svg';
import { ReactComponent as sETHIcon } from '../assets/currencies/synths/sETH.svg';
import { ReactComponent as sXRPIcon } from '../assets/currencies/synths/sXRP.svg';
import { ReactComponent as sBCHIcon } from '../assets/currencies/synths/sBCH.svg';
import { ReactComponent as sLTCIcon } from '../assets/currencies/synths/sLTC.svg';
import { ReactComponent as sEOSIcon } from '../assets/currencies/synths/sEOS.svg';
import { ReactComponent as sBNBIcon } from '../assets/currencies/synths/sBNB.svg';
import { ReactComponent as sXTZIcon } from '../assets/currencies/synths/sXTZ.svg';
import { ReactComponent as sXMRIcon } from '../assets/currencies/synths/sXMR.svg';
import { ReactComponent as sADAIcon } from '../assets/currencies/synths/sADA.svg';
import { ReactComponent as sLINKIcon } from '../assets/currencies/synths/sLINK.svg';
import { ReactComponent as sTRXIcon } from '../assets/currencies/synths/sTRX.svg';
import { ReactComponent as sDASHIcon } from '../assets/currencies/synths/sDASH.svg';
import { ReactComponent as sETCIcon } from '../assets/currencies/synths/sETC.svg';
import { ReactComponent as sMKRIcon } from '../assets/currencies/synths/sMKR.svg';
import { ReactComponent as iBTCIcon } from '../assets/currencies/synths/iBTC.svg';
import { ReactComponent as iETHIcon } from '../assets/currencies/synths/iETH.svg';
import { ReactComponent as iXRPIcon } from '../assets/currencies/synths/iXRP.svg';
import { ReactComponent as iBCHIcon } from '../assets/currencies/synths/iBCH.svg';
import { ReactComponent as iLTCIcon } from '../assets/currencies/synths/iLTC.svg';
import { ReactComponent as iEOSIcon } from '../assets/currencies/synths/iEOS.svg';
import { ReactComponent as iBNBIcon } from '../assets/currencies/synths/iBNB.svg';
import { ReactComponent as iXTZIcon } from '../assets/currencies/synths/iXTZ.svg';
import { ReactComponent as iXMRIcon } from '../assets/currencies/synths/iXMR.svg';
import { ReactComponent as iADAIcon } from '../assets/currencies/synths/iADA.svg';
import { ReactComponent as iLINKIcon } from '../assets/currencies/synths/iLINK.svg';
import { ReactComponent as iTRXIcon } from '../assets/currencies/synths/iTRX.svg';
import { ReactComponent as iDASHIcon } from '../assets/currencies/synths/iDASH.svg';
import { ReactComponent as iETCIcon } from '../assets/currencies/synths/iETC.svg';
import { ReactComponent as iMKRIcon } from '../assets/currencies/synths/iMKR.svg';
// Commoditiy Synths
import { ReactComponent as sXAUIcon } from '../assets/currencies/synths/sXAU.svg';
import { ReactComponent as sXAGIcon } from '../assets/currencies/synths/sXAG.svg';
import { ReactComponent as sBZIcon } from '../assets/currencies/synths/sBZ.svg';
// Crypto Index Synths
import { ReactComponent as sDEFIIcon } from '../assets/currencies/synths/sDEFI.svg';
import { ReactComponent as sCEXIcon } from '../assets/currencies/synths/sCEX.svg';
import { ReactComponent as iDEFIIcon } from '../assets/currencies/synths/iDEFI.svg';
import { ReactComponent as iCEXIcon } from '../assets/currencies/synths/iCEX.svg';
// Equity Synths
import { ReactComponent as sFTSEIcon } from '../assets/currencies/synths/sFTSE.svg';
import { ReactComponent as sNIKKEIIcon } from '../assets/currencies/synths/sNIKKEI.svg';
// Forex Synths
import { ReactComponent as sEURIcon } from '../assets/currencies/synths/sEUR.svg';
import { ReactComponent as sJPYIcon } from '../assets/currencies/synths/sJPY.svg';
import { ReactComponent as sUSDIcon } from '../assets/currencies/synths/sUSD.svg';
import { ReactComponent as sAUDIcon } from '../assets/currencies/synths/sAUD.svg';
import { ReactComponent as sGBPIcon } from '../assets/currencies/synths/sGBP.svg';
import { ReactComponent as sCHFIcon } from '../assets/currencies/synths/sCHF.svg';

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
