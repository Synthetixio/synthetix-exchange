import snxData from 'synthetix-data';

import {
	matchPairRates,
	getMinAndMaxRate,
	calculateRateChange,
	calculateTimestampForPeriod,
	calculateTotalVolumeForExchanges,
} from './utils';

import { SYNTHS_MAP } from 'constants/currency';
import { PERIOD_IN_HOURS } from 'constants/period';

export const fetchSynthRateUpdate = async (
	currencyKey,
	periodInHours = PERIOD_IN_HOURS.ONE_DAY
) => {
	try {
		// const now = new Date().getTime();

		const rates = await snxData.rate.updates({
			synth: currencyKey,
			// maxTimestamp: Math.trunc(now / 1000),
			minTimestamp: calculateTimestampForPeriod(periodInHours),
			max: 6000,
		});

		const [low, high] = getMinAndMaxRate(rates);
		const change = calculateRateChange(rates);

		return {
			rates: rates.reverse(),
			low,
			high,
			change,
		};
	} catch (e) {
		return null;
	}
};

export const fetchSynthRateUpdates = async (
	baseCurrencyKey,
	quoteCurrencyKey,
	periodInHours = PERIOD_IN_HOURS.ONE_DAY
) => {
	try {
		// const now = new Date().getTime();

		const [baseRates, quoteRates] = await Promise.all(
			[baseCurrencyKey, quoteCurrencyKey].map((synthName) =>
				snxData.rate.updates({
					synth: synthName,
					// maxTimestamp: Math.trunc(now / 1000),
					minTimestamp: calculateTimestampForPeriod(periodInHours),
					max: 6000,
				})
			)
		);

		// If quote or rate is sUSD then we just get
		// the base or quote rates as they're already in sUSD
		const rates =
			quoteCurrencyKey === SYNTHS_MAP.sUSD
				? baseRates
				: baseCurrencyKey === SYNTHS_MAP.sUSD
				? quoteRates
				: matchPairRates(baseRates, quoteRates);

		const [low, high] = getMinAndMaxRate(rates);
		const change = calculateRateChange(rates);

		return {
			rates: rates.reverse(),
			low,
			high,
			change,
		};
	} catch (e) {
		return null;
	}
};

export const fetchExchanges = (periodInHours = PERIOD_IN_HOURS.ONE_DAY) =>
	snxData.exchanges.since({
		minTimestamp: calculateTimestampForPeriod(periodInHours),
	});

export const fetchSynthVolumeInUSD = async (
	baseCurrencyKey,
	quoteCurrencyKey,
	periodInHours = PERIOD_IN_HOURS.ONE_DAY
) => {
	try {
		const exchanges = await fetchExchanges(periodInHours);

		return calculateTotalVolumeForExchanges(baseCurrencyKey, quoteCurrencyKey, exchanges);
	} catch (e) {
		return null;
	}
};
