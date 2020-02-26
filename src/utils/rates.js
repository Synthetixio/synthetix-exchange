export const getExchangeRatesForCurrencies = (rates, base, quote) =>
	rates === null ? 0 : rates[base] * (1 / rates[quote]);
