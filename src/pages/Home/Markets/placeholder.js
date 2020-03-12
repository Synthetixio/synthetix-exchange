export const generatePlaceholderMarkets = marketPairs =>
	marketPairs.map(({ baseCurrencyKey, quoteCurrencyKey }) => ({
		pair: `${baseCurrencyKey}-${quoteCurrencyKey}`,
		baseCurrencyKey,
		quoteCurrencyKey,
		lastPrice: null,
		rates: [],
		rates24hChange: null,
		rates24hLow: null,
		rates24hHigh: null,
		rates24hVol: null,
		isLoaded: false,
	}));
