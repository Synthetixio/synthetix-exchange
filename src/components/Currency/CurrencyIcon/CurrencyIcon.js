import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { getCurrencyKeyIcon } from '../../../utils/currency';

export const CurrencyIcon = memo(({ currencyKey, ...rest }) => {
	const Icon = getCurrencyKeyIcon(currencyKey);

	return Icon ? <Icon viewBox="0 0 300 300" width="22" height="22" {...rest} /> : null;
});

CurrencyIcon.propTypes = {
	currencyKey: PropTypes.string.isRequired,
};

export default CurrencyIcon;
