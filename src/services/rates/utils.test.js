import { calculateRateChange, matchPairRates } from './utils';

test('return 0 when we only have one item in the array', () => {
	expect(calculateRateChange([{ rate: 1 }])).toBe(0);
});
test('calculate negative rate change', () => {
	const newRate = { rate: 1 };
	const oldRate = { rate: 2 };
	const data = [newRate, oldRate];
	expect(calculateRateChange(data)).toBe(-0.5);
});
test('calculate positive rate change', () => {
	const newRate = { rate: 5 };
	const oldRate = { rate: 1 };
	const data = [newRate, oldRate];
	expect(calculateRateChange(data)).toBe(4);
});

test('return pair rates regarding timestamp', () => {
	const ETH_RATES = [
		{ rate: 1, timestamp: 32 },
		{ rate: 10, timestamp: 30 },
		{ rate: 100, timestamp: 22 },
		{ rate: 1000, timestamp: 20 },
		{ rate: 100, timestamp: 10 },
		{ rate: 10, timestamp: 0 },
	];
	const BTC_RATES = [
		{ rate: 7000, timestamp: 200 },
		{ rate: 9000, timestamp: 38 },
		{ rate: 10000, timestamp: 35 },
		{ rate: 8500, timestamp: 22 },
		{ rate: 8000, timestamp: 12 },
		{ rate: 7500, timestamp: 10 },
		{ rate: 7000, timestamp: 6 },
		{ rate: 6500, timestamp: 2 },
		{ rate: 6000, timestamp: 1 },
	];
	const rates = matchPairRates(BTC_RATES, ETH_RATES);
	expect(rates).toEqual([
		{ rate: 7000, timestamp: 200 },
		{ rate: 9000, timestamp: 38 },
		{ rate: 10000, timestamp: 35 },
		{ rate: 8500, timestamp: 32 },
		{ rate: 850, timestamp: 30 },
		{ rate: 85, timestamp: 22 },
		{ rate: 8, timestamp: 20 },
		{ rate: 80, timestamp: 12 },
		{ rate: 75, timestamp: 10 },
		{ rate: 700, timestamp: 6 },
		{ rate: 650, timestamp: 2 },
		{ rate: 600, timestamp: 1 },
	]);
});

test('returns [] if one of the rate array is empty or null', () => {
	const ETH_RATES = [{ rate: 1, timestamp: 32 }];
	const rates1 = matchPairRates([], ETH_RATES);
	const rates2 = matchPairRates(null, ETH_RATES);
	const rates3 = matchPairRates(ETH_RATES, []);
	const rates4 = matchPairRates(ETH_RATES, null);
	expect(rates1).toEqual([]);
	expect(rates2).toEqual([]);
	expect(rates3).toEqual([]);
	expect(rates4).toEqual([]);
});
