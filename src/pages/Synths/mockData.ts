export const mockRates = (periodInHours: number, rate = 1, points = 100) => {
	let now = Date.now();

	const rates = [];

	for (let i = 0; i < points; i++) {
		rates.unshift({
			timestamp: now,
			rate,
		});
		now -= 1000 * 60 * periodInHours;
	}

	return rates;
};
