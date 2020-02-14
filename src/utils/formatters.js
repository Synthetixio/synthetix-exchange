import numbro from 'numbro';
import snxJSConnector from './snxJSConnector';

export const formatCurrency = (value, decimals = 2) => {
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

export const formatPercentage = (value, decimals = 2) => {
	return numbro(value).format({
		output: 'percent',
		mantissa: decimals,
	});
};
export const shortenAddress = address => {
	if (!address) return null;
	return address.slice(0, 6) + '...' + address.slice(-4, address.length);
};

export const bytesFormatter = input => snxJSConnector.ethersUtils.formatBytes32String(input);

export const parseBytes32String = input => snxJSConnector.ethersUtils.parseBytes32String(input);

export const bigNumberFormatter = value => Number(snxJSConnector.utils.formatEther(value));

export const getAddress = addr => snxJSConnector.ethersUtils.getAddress(addr);
