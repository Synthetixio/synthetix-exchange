import { SYNTHS_MAP } from 'src/constants/currency';

export const ASSET_FILTERS = [
	{
		asset: SYNTHS_MAP.sUSD,
	},
	{
		asset: SYNTHS_MAP.sBTC,
	},
	{
		asset: SYNTHS_MAP.sETH,
	},
];

export const MARKETS_REFRESH_INTERVAL_MS = 300000;
