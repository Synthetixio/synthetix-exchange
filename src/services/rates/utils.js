import subHours from 'date-fns/subHours';
import orderBy from 'lodash/orderBy';
import uniqBy from 'lodash/uniqBy';

export const getMinAndMaxRate = (data) => {
	if (data.length === 0) return [0, 0];

	return data.reduce(
		([min, max], val) => {
			const { rate } = val;
			const newMax = rate > max ? rate : max;
			const newMin = rate < min ? rate : min;

			return [newMin, newMax];
		},
		[Number.MAX_SAFE_INTEGER, 0]
	);
};

export const calculateRateChange = (data) => {
	if (data.length < 2) return 0;
	const newPrice = data[0].rate;
	const oldPrice = data[data.length - 1].rate;
	const percentageChange = (newPrice - oldPrice) / oldPrice;
	return percentageChange;
};

const matchRates = (ratesA, ratesB, isQuote) => {
	let rates = [];
	// For each base rate (USD)
	ratesA.forEach((rateA) => {
		// We search what was the quote rate in USD
		// prior (or same time) the base rate ticker
		const matchRate = ratesB.find((rateB) => {
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

export const calculateTimestampForPeriod = (periodInHours) =>
	Math.trunc(subHours(new Date().getTime(), periodInHours).getTime() / 1000);

export const calculateTotalVolumeForExchanges = (baseCurrencyKey, quoteCurrencyKey, exchanges) =>
	exchanges
		.filter(
			(exchange) =>
				(exchange.fromCurrencyKey === quoteCurrencyKey &&
					exchange.toCurrencyKey === baseCurrencyKey) ||
				(exchange.fromCurrencyKey === baseCurrencyKey &&
					exchange.toCurrencyKey === quoteCurrencyKey)
		)
		.reduce((totalVolume, exchange) => {
			totalVolume += exchange.fromAmountInUSD;
			return totalVolume;
		}, 0);
