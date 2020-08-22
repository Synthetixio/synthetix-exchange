import React, { FC } from 'react';

import { getCurrencyKeyIcon } from 'utils/currency';
import { CurrencyKey } from 'constants/currency';

type CurrencyIconProps = {
	currencyKey: CurrencyKey;
	type?: 'synth' | 'asset';
};

export const CurrencyIcon: FC<CurrencyIconProps> = ({ currencyKey, type = 'synth', ...rest }) => {
	const currencyIcon = getCurrencyKeyIcon(currencyKey);

	if (!currencyIcon) {
		return null;
	}

	const { SynthIcon, AssetIcon } = currencyIcon;

	const Icon = type === 'synth' && SynthIcon ? SynthIcon : AssetIcon;

	return <Icon width="22" height="22" {...rest} />;
};

export default CurrencyIcon;
