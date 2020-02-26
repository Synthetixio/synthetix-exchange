export const getExchangeRatesForCurrencies = (rates, base, quote) => {
	if (!rates) return 0;
	return rates[base] * (1 / rates[quote]);
};
