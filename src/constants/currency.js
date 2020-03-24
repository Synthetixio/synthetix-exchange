import keyBy from 'lodash/keyBy';
import memoizeOne from 'memoize-one';

// Crypto
import { ReactComponent as ETHIcon } from '../assets/currencies/crypto/ETH.svg';

// Synths
import { ReactComponent as sBTCIcon } from '../assets/currencies/synths/sBTC.svg';
import { ReactComponent as sETHIcon } from '../assets/currencies/synths/sETH.svg';
import { ReactComponent as sXRPIcon } from '../assets/currencies/synths/sXRP.svg';
import { ReactComponent as sLTCIcon } from '../assets/currencies/synths/sLTC.svg';
import { ReactComponent as sBNBIcon } from '../assets/currencies/synths/sBNB.svg';
import { ReactComponent as sXTZIcon } from '../assets/currencies/synths/sXTZ.svg';
import { ReactComponent as sTRXIcon } from '../assets/currencies/synths/sTRX.svg';
import { ReactComponent as sLINKIcon } from '../assets/currencies/synths/sLINK.svg';
import { ReactComponent as sMKRIcon } from '../assets/currencies/synths/sMKR.svg';
import { ReactComponent as sEURIcon } from '../assets/currencies/synths/sEUR.svg';
import { ReactComponent as sJPYIcon } from '../assets/currencies/synths/sJPY.svg';
import { ReactComponent as sUSDIcon } from '../assets/currencies/synths/sUSD.svg';
import { ReactComponent as sAUDIcon } from '../assets/currencies/synths/sAUD.svg';
import { ReactComponent as sGBPIcon } from '../assets/currencies/synths/sGBP.svg';
import { ReactComponent as sCHFIcon } from '../assets/currencies/synths/sCHF.svg';
import { ReactComponent as sXAUIcon } from '../assets/currencies/synths/sXAU.svg';
import { ReactComponent as sXAGIcon } from '../assets/currencies/synths/sXAG.svg';
import { ReactComponent as sCEXIcon } from '../assets/currencies/synths/sCEX.svg';
import { ReactComponent as sDEFIIcon } from '../assets/currencies/synths/sDEFI.svg';
import { ReactComponent as iBTCIcon } from '../assets/currencies/synths/iBTC.svg';
import { ReactComponent as iETHIcon } from '../assets/currencies/synths/iETH.svg';
import { ReactComponent as iXRPIcon } from '../assets/currencies/synths/iXRP.svg';
import { ReactComponent as iLTCIcon } from '../assets/currencies/synths/iLTC.svg';
import { ReactComponent as iBNBIcon } from '../assets/currencies/synths/iBNB.svg';
import { ReactComponent as iXTZIcon } from '../assets/currencies/synths/iXTZ.svg';
import { ReactComponent as iTRXIcon } from '../assets/currencies/synths/iTRX.svg';
import { ReactComponent as iLINKIcon } from '../assets/currencies/synths/iLINK.svg';
import { ReactComponent as iMKRIcon } from '../assets/currencies/synths/iMKR.svg';
import { ReactComponent as iCEXIcon } from '../assets/currencies/synths/iCEX.svg';
import { ReactComponent as iDEFIIcon } from '../assets/currencies/synths/iDEFI.svg';

export const ASSETS = ['crypto', 'forex', 'fiat'];
export const ASSETS_MAP = keyBy(ASSETS);

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

export const currencyKeyToIconMap = {
	[CRYPTO_CURRENCY_MAP.ETH]: ETHIcon,

	[SYNTHS_MAP.sBTC]: sBTCIcon,
	[SYNTHS_MAP.sETH]: sETHIcon,
	[SYNTHS_MAP.sXRP]: sXRPIcon,
	[SYNTHS_MAP.sLTC]: sLTCIcon,
	[SYNTHS_MAP.sBNB]: sBNBIcon,
	[SYNTHS_MAP.sXTZ]: sXTZIcon,
	[SYNTHS_MAP.sTRX]: sTRXIcon,
	[SYNTHS_MAP.sLINK]: sLINKIcon,
	[SYNTHS_MAP.sMKR]: sMKRIcon,
	[SYNTHS_MAP.sEUR]: sEURIcon,
	[SYNTHS_MAP.sJPY]: sJPYIcon,
	[SYNTHS_MAP.sUSD]: sUSDIcon,
	[SYNTHS_MAP.sAUD]: sAUDIcon,
	[SYNTHS_MAP.sGBP]: sGBPIcon,
	[SYNTHS_MAP.sCHF]: sCHFIcon,
	[SYNTHS_MAP.sXAU]: sXAUIcon,
	[SYNTHS_MAP.sXAG]: sXAGIcon,
	[SYNTHS_MAP.sCEX]: sCEXIcon,
	[SYNTHS_MAP.sDEFI]: sDEFIIcon,
	[SYNTHS_MAP.iMKR]: iMKRIcon,
	[SYNTHS_MAP.iCEX]: iCEXIcon,
	[SYNTHS_MAP.iDEFI]: iDEFIIcon,
	[SYNTHS_MAP.iBTC]: iBTCIcon,
	[SYNTHS_MAP.iETH]: iETHIcon,
	[SYNTHS_MAP.iXRP]: iXRPIcon,
	[SYNTHS_MAP.iLTC]: iLTCIcon,
	[SYNTHS_MAP.iBNB]: iBNBIcon,
	[SYNTHS_MAP.iXTZ]: iXTZIcon,
	[SYNTHS_MAP.iTRX]: iTRXIcon,
	[SYNTHS_MAP.iLINK]: iLINKIcon,
};

export const isSynth = currencyKey => !!SYNTHS_MAP[currencyKey];
export const isCryptoCurrency = currencyKey => !!CRYPTO_CURRENCY_MAP[currencyKey];
export const isFiatCurrency = currencyKey => !!FIAT_CURRENCY_MAP[currencyKey];
export const toMarketPair = (baseCurrencyKey, quoteCurrencyKey) =>
	`${baseCurrencyKey}-${quoteCurrencyKey}`;

export const getAvailableMarketNames = memoizeOne(() => {
	const marketNames = [];
	const excludedSynths = [SYNTHS_MAP.iMKR, SYNTHS_MAP.sMKR];
	const synths = SYNTHS.filter(synth => !excludedSynths.includes(synth));

	synths.forEach(synthA => {
		synths.forEach(synthB => {
			marketNames.push({
				baseCurrencyKey: synthA,
				quoteCurrencyKey: synthB,
				pair: toMarketPair(synthA, synthB),
			});
		});
	});

	return marketNames;
});

export const getFilteredMarketNames = memoizeOne(quoteCurrencyKey =>
	getAvailableMarketNames().filter(marketName => marketName.quoteCurrencyKey === quoteCurrencyKey)
);
