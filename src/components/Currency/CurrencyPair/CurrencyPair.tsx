import React, { FC, memo } from 'react';

import { formatCurrencyPair } from '../../../utils/formatters';

import CurrencyIcon from '../CurrencyIcon';

import { Container } from '../commonStyles';
import { CurrencyKey } from 'constants/currency';

type CurrencyPairProps = {
	baseCurrencyKey: CurrencyKey;
	baseCurrencyAsset?: string;
	quoteCurrencyKey: CurrencyKey;
	showIcon?: boolean;
	iconProps?: any;
};

export const CurrencyPair: FC<CurrencyPairProps> = memo(
	({
		baseCurrencyKey,
		baseCurrencyAsset,
		quoteCurrencyKey,
		showIcon = true,
		iconProps = {},
		...rest
	}) => (
		<Container showIcon={showIcon} {...rest}>
			{showIcon && <CurrencyIcon currencyKey={baseCurrencyKey} {...iconProps} />}
			{formatCurrencyPair(baseCurrencyAsset || baseCurrencyKey, quoteCurrencyKey)}
		</Container>
	)
);

export default CurrencyPair;
