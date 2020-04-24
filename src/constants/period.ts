export type Period = 'ONE_HOUR' | 'FOUR_HOURS' | 'ONE_DAY' | 'ONE_WEEK' | 'ONE_MONTH';

export const PERIOD_IN_HOURS: Record<Period, number> = {
	ONE_MONTH: 672,
	ONE_WEEK: 168,
	ONE_DAY: 24,
	FOUR_HOURS: 4,
	ONE_HOUR: 1,
};

export const PERIOD: Record<Period, Period> = {
	ONE_HOUR: 'ONE_HOUR',
	FOUR_HOURS: 'FOUR_HOURS',
	ONE_DAY: 'ONE_DAY',
	ONE_WEEK: 'ONE_WEEK',
	ONE_MONTH: 'ONE_MONTH',
};
