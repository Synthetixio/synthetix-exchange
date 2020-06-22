import get from 'lodash/get';
import { isSynth } from '../constants/currency';

const getSynthBalancePath = (currencyKey, field) => ['synths', 'balances', currencyKey, field];

// crypto appears as lowercased in balances
const getCryptoCurrencyBalancePath = (currencyKey, field) => [currencyKey.toLowerCase(), field];

export const getCurrencyKeyBalance = (balances, currencyKey) =>
	isSynth(currencyKey)
		? get(balances, getSynthBalancePath(currencyKey, 'balance'))
		: get(balances, getCryptoCurrencyBalancePath(currencyKey, 'balance'));

export const getCurrencyKeyUSDBalance = (balances, currencyKey) =>
	isSynth(currencyKey)
		? get(balances, getSynthBalancePath(currencyKey, 'usdBalance'))
		: get(balances, getCryptoCurrencyBalancePath(currencyKey, 'usdBalance'));
