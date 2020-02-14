import numbro from 'numbro';
import { format } from 'date-fns';
import snxJSConnector from './snxJSConnector';

const DEFAULT_CURRENCY_DECIMALS = 2;

export const formatCurrency = (value, decimals = DEFAULT_CURRENCY_DECIMALS) => {
	if (!value) return 0;
	if (!Number(value)) return 0;
	if (Number.isInteger(value))
		return numbro(value).format({ thousandSeparated: true, mantissa: 0 });
	return numbro(value).format({ thousandSeparated: true, mantissa: decimals });
};

export const formatCurrencyWithPrecision = value => {
	return formatCurrency(value, getPrecision(value));
};

const getPrecision = amount => {
	if (amount >= 1) {
		return 2;
	} else if (amount > 0.01) {
		return 4;
	} else return 6;
};

export const formatPercentage = (value, decimals = DEFAULT_CURRENCY_DECIMALS) => {
	return numbro(value).format({
		output: 'percent',
		mantissa: decimals,
	});
};

export const shortenAddress = address => {
	if (!address) return null;
	return address.slice(0, 6) + '...' + address.slice(-4, address.length);
};

export const formatCurrencyWithKey = (currencyKey, value, decimals = DEFAULT_CURRENCY_DECIMALS) =>
	`${formatCurrency(value, decimals)} ${currencyKey}`;

export const bytesFormatter = input => snxJSConnector.ethersUtils.formatBytes32String(input);

export const bigNumberFormatter = value => Number(snxJSConnector.utils.formatEther(value));

export const getAddress = addr => snxJSConnector.ethersUtils.getAddress(addr);

export const formatTxTimestamp = timestamp => format(timestamp, 'DD-MM-YY | HH:mm');
