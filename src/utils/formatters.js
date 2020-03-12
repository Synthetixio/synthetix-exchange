import numbro from 'numbro';
import { format } from 'date-fns';
import snxJSConnector from './snxJSConnector';

const DEFAULT_CURRENCY_DECIMALS = 2;

const getPrecision = amount => {
	if (amount >= 1) {
		return 2;
	} else if (amount > 0.01) {
		return 4;
	} else return 6;
};

const strPadLeft = (string, pad, length) => {
	return (new Array(length + 1).join(pad) + string).slice(-length);
};

export const formatCurrency = (value, decimals = DEFAULT_CURRENCY_DECIMALS) => {
	if (!value || !Number(value)) {
		return 0;
	}

	return numbro(value).format({
		thousandSeparated: true,
		mantissa: Number.isInteger(value) ? 0 : decimals,
	});
};

export const formatCurrencyWithPrecision = value => {
	return formatCurrency(value, getPrecision(value));
};

export const formatPercentage = (value, decimals = DEFAULT_CURRENCY_DECIMALS) => {
	return numbro(value).format({
		output: 'percent',
		mantissa: decimals,
	});
};

export const shortenAddress = (address, first = 5, last = 5) =>
	address ? `${address.slice(0, first)}...${address.slice(-last, address.length)}` : null;

export const formatCurrencyWithKey = (currencyKey, value, decimals = DEFAULT_CURRENCY_DECIMALS) =>
	`${formatCurrency(value, decimals)} ${currencyKey}`;

export const bytesFormatter = input => snxJSConnector.ethersUtils.formatBytes32String(input);

export const parseBytes32String = input => snxJSConnector.ethersUtils.parseBytes32String(input);

export const bigNumberFormatter = value => Number(snxJSConnector.utils.formatEther(value));

export const getAddress = addr => snxJSConnector.ethersUtils.getAddress(addr);

export const formatTxTimestamp = timestamp => format(timestamp, 'DD-MM-YY | HH:mm');

export const toJSTimestamp = timestamp => timestamp * 1000;

export const secondsToTime = seconds => {
	const minutes = Math.floor(seconds / 60);
	const secondsLeft = seconds - minutes * 60;
	return strPadLeft(minutes, '0', 2) + ':' + strPadLeft(secondsLeft, '0', 2);
};

export const formatCurrencyPair = (baseCurrencyKey, quoteCurrencyKey) =>
	`${baseCurrencyKey} / ${quoteCurrencyKey}`;

// TODO: use a library for this, because the sign does not always appear on the left. (perhaps something like number.toLocaleString)
export const formatCurrencyWithSign = (sign, value) => `${sign}${formatCurrency(value)}`;
