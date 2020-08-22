import { currencyKeyToIconMap, CurrencyKey } from 'constants/currency';

export const getCurrencyKeyIcon = (currencyKey: CurrencyKey) => currencyKeyToIconMap[currencyKey];
