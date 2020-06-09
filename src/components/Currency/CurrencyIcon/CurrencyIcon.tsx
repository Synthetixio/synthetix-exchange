import React, { FC, memo } from 'react';

import { getCurrencyKeyIcon } from 'utils/currency';
import { CurrencyKey } from 'constants/currency';

type CurrencyIconProps = {
	currencyKey: CurrencyKey;
	type?: 'synth' | 'crypto';
};

export const CurrencyIcon: FC<CurrencyIconProps> = memo(
	({ currencyKey, type = 'synth', ...rest }) => {
		const currencyIcon = getCurrencyKeyIcon(currencyKey);
		if (!currencyIcon) {
			return null;
		}

		const iconProps = {
			width: '22',
			height: '22',
			...rest,
		};
		const { SynthIcon, CryptoIcon } = currencyIcon;
		// synth wants to render as crypto
		if (type === 'crypto' && CryptoIcon) {
			return <CryptoIcon {...iconProps} />;
		}

		const Icon = SynthIcon || CryptoIcon;
		if (Icon) {
			return <Icon {...iconProps} />;
		}

		return null;
	}
);

export default CurrencyIcon;
