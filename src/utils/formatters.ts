import BigNumber from 'bignumber.js';
import numbro from 'numbro';
import format from 'date-fns/format';

import snxJSConnector from './snxJSConnector';
import { CurrencyKey } from 'constants/currency';
import { BigNumberish } from 'ethers/utils';

const DEFAULT_CURRENCY_DECIMALS = 2;
export const FIAT_CURRENCY_DECIMALS = 2;
export const SHORT_CRYPTO_CURRENCY_DECIMALS = 4;
export const LONG_CRYPTO_CURRENCY_DECIMALS = 8;

type NumericValue = string | number;

export const toBigNumber = (value: BigNumber | string | number) => new BigNumber(value);

// TODO: figure out a robust way to get the correct precision.
const getPrecision = (amount: NumericValue) => {
	if (amount >= 1) {
		return DEFAULT_CURRENCY_DECIMALS;
	}
	if (amount > 0.01) {
		return SHORT_CRYPTO_CURRENCY_DECIMALS;
	}
	return LONG_CRYPTO_CURRENCY_DECIMALS;
};

const strPadLeft = (string: string | number, pad: string, length: number) => {
	return (new Array(length + 1).join(pad) + string).slice(-length);
};

export const formatCurrency = (value: NumericValue, decimals = DEFAULT_CURRENCY_DECIMALS) => {
	if (!value || !Number(value)) {
		return 0;
	}

	return numbro(value).format({
		thousandSeparated: true,
		trimMantissa: decimals > FIAT_CURRENCY_DECIMALS ? true : false,
		mantissa: decimals,
	});
};

export const formatCurrencyWithPrecision = (value: NumericValue) =>
	formatCurrency(value, getPrecision(value));

export const formatPercentage = (value: NumericValue, decimals = DEFAULT_CURRENCY_DECIMALS) =>
	numbro(value).format({
		output: 'percent',
		mantissa: decimals,
	});

export const formatPercentageWithSign = (
	value: NumericValue,
	decimals = DEFAULT_CURRENCY_DECIMALS
) => `${value > 0 ? '+' : ''}${formatPercentage(value, decimals)}`;

// TODO: use a library for this, because the sign does not always appear on the left. (perhaps something like number.toLocaleString)
export const formatCurrencyWithSign = (
	sign: string | null | undefined,
	value: NumericValue,
	decimals?: number
) => `${sign}${formatCurrency(value, decimals || getPrecision(value))}`;

export const formatCurrencyWithKey = (
	currencyKey: CurrencyKey,
	value: NumericValue,
	decimals?: number
) => `${formatCurrency(value, decimals || getPrecision(value))} ${currencyKey}`;

export const truncateAddress = (address: string, first = 5, last = 5) =>
	address ? `${address.slice(0, first)}...${address.slice(-last, address.length)}` : null;

export const bytesFormatter = (input: string) =>
	(snxJSConnector as any).ethersUtils.formatBytes32String(input);

export const parseBytes32String = (input: string) =>
	(snxJSConnector as any).ethersUtils.parseBytes32String(input);

export const bigNumberFormatter = (value: BigNumberish) =>
	Number((snxJSConnector as any).utils.formatEther(value));

export const getAddress = (addr: string) => (snxJSConnector as any).ethersUtils.getAddress(addr);

export const formatTxTimestamp = (timestamp: number | Date) =>
	format(timestamp, 'MMM d, yy | HH:mm');

export const toJSTimestamp = (timestamp: number) => timestamp * 1000;

export const secondsToTime = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const secondsLeft = seconds - minutes * 60;

	return strPadLeft(minutes, '0', 2) + ':' + strPadLeft(secondsLeft, '0', 2);
};

export const formatCurrencyPair = (baseCurrencyKey: CurrencyKey, quoteCurrencyKey: CurrencyKey) =>
	`${baseCurrencyKey} / ${quoteCurrencyKey}`;

export const getDecimalPlaces = (value: NumericValue) =>
	(value.toString().split('.')[1] || '').length;

// date-fns formatDuration does not let us customize the actual string, so we need to write this custom formatter.
// TODO: support translations
export const formattedDuration = (
	duration: Duration,
	delimiter = ' ',
	firstTwo: boolean = false
) => {
	const formatted = [];
	if (duration.years) {
		formatted.push(`${duration.years}y`);
	}
	if (duration.months) {
		formatted.push(`${duration.months}mo`);
	}
	if (duration.days) {
		formatted.push(`${duration.days}d`);
	}
	if (duration.hours) {
		formatted.push(`${duration.hours}h`);
	}
	if (duration.minutes) {
		formatted.push(`${duration.minutes}m`);
	}
	if (duration.seconds != null) {
		formatted.push(`${duration.seconds}s`);
	}
	return (firstTwo ? formatted.slice(0, 2) : formatted).join(delimiter);
};

export const formatShortDate = (date: Date | number) => format(date, 'MMM d, yyyy');
export const formatShortDateWithTime = (date: Date | number) => format(date, 'MMM d, yyyy H:mma');
