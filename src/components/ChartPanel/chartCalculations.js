export const calculateRateChange = data => {
	if (data.length < 2) return 0;
	const newPrice = data[0].rate;
	const oldPrice = data[data.length - 1].rate;
	const percentageChange = (newPrice - oldPrice) / Math.abs(oldPrice);
	return percentageChange;
};

export const matchPairRates = (baseRates, quoteRates) => {
	let rates = [];
	baseRates.forEach(baseRate => {
		const quoteRate = quoteRates.find(rate => {
			return rate.timestamp <= baseRate.timestamp;
		});
		if (quoteRate) {
			rates.push({
				rate: baseRate.rate / quoteRate.rate,
				timestamp: baseRate.timestamp,
			});
		}
	});
	return rates;
};
