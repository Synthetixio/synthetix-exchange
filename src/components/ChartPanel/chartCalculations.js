export const calculateRateChange = data => {
	if (data.length < 2) return 0;
	const newPrice = data[0].rate;
	const oldPrice = data[data.length - 1].rate;
	const percentageChange = (newPrice - oldPrice) / Math.abs(oldPrice);
	return percentageChange;
};

export const matchPairRates = (baseRates, quoteRates) => {
	if (!baseRates || baseRates.length === 0 || !quoteRates || quoteRates.length === 0) return [];
	let rates = [];
	// For each base rate (USD)
	baseRates.forEach(baseRate => {
		// We search what was the quote rate in USD
		// prior (or same time) the base rate ticker
		const quoteRate = quoteRates.find(rate => {
			return rate.timestamp <= baseRate.timestamp;
		});
		// if one is found, we do rate = base / quote
		// and push it to the rates array
		if (quoteRate) {
			rates.push({
				rate: baseRate.rate / quoteRate.rate,
				timestamp: baseRate.timestamp,
			});
		}
	});
	return rates;
};
