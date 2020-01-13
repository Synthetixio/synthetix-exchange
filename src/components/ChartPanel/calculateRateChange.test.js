import { calculateRateChange } from './calculateRateChange';

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
