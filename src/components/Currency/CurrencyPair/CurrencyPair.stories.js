import React from 'react';
import { CurrencyPair } from './CurrencyPair';

import { SYNTHS_MAP } from '../../../constants/currency';

export default {
	title: 'Currency/Pair',
};

export const withIcon = () => (
	<CurrencyPair
		baseCurrencyKey={SYNTHS_MAP.sBTC}
		quoteCurrencyKey={SYNTHS_MAP.sETH}
		showIcon={true}
	/>
);

export const withoutIcon = () => (
	<CurrencyPair
		baseCurrencyKey={SYNTHS_MAP.sBTC}
		quoteCurrencyKey={SYNTHS_MAP.sETH}
		showIcon={false}
	/>
);
