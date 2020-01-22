import orderBy from 'lodash/orderBy';
import uniqBy from 'lodash/uniqBy';

export const calculateRateChange = data => {
	if (data.length < 2) return 0;
	const newPrice = data[0].rate;
	const oldPrice = data[data.length - 1].rate;
	const percentageChange = (newPrice - oldPrice) / oldPrice;
	return percentageChange;
};

const matchRates = (ratesA, ratesB, isQuote) => {
	let rates = [];
	// For each base rate (USD)
	ratesA.forEach(rateA => {
		// We search what was the quote rate in USD
		// prior (or same time) the base rate ticker
		const matchRate = ratesB.find(rateB => {
			return rateB.timestamp <= rateA.timestamp;
		});
		// if one is found, we do rate = base / quote
		// and push it to the rates array
		if (matchRate) {
			rates.push({
				rate: isQuote ? matchRate.rate / rateA.rate : rateA.rate / matchRate.rate,
				timestamp: rateA.timestamp,
			});
		}
	});
	return rates;
};

export const matchPairRates = (baseRates, quoteRates) => {
	if (!baseRates || baseRates.length === 0 || !quoteRates || quoteRates.length === 0) return [];
	const rates = matchRates(baseRates, quoteRates).concat(matchRates(quoteRates, baseRates, true));
	return orderBy(uniqBy(rates, 'timestamp'), 'timestamp', ['desc']);
};
