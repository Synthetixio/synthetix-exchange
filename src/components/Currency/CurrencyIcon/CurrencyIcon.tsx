import React, { FC, memo } from 'react';

import { getCurrencyKeyIcon } from 'utils/currency';
import { CurrencyKey } from 'constants/currency';

type CurrencyIconProps = {
	currencyKey: CurrencyKey;
};

export const CurrencyIcon: FC<CurrencyIconProps> = memo(({ currencyKey, ...rest }) => {
	const Icon = getCurrencyKeyIcon(currencyKey);

	return Icon ? <Icon viewBox="0 0 300 300" width="22" height="22" {...rest} /> : null;
});

export default CurrencyIcon;
