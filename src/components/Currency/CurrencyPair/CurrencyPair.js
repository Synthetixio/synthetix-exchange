import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { formatCurrencyPair } from '../../../utils/formatters';

import CurrencyIcon from '../CurrencyIcon';

import { Container } from '../commonStyles';

export const CurrencyPair = memo(
	({ baseCurrencyKey, quoteCurrencyKey, showIcon = true, iconProps = {}, ...rest }) => (
		<Container showIcon={showIcon} {...rest}>
			{showIcon && <CurrencyIcon currencyKey={baseCurrencyKey} {...iconProps} />}
			{formatCurrencyPair(baseCurrencyKey, quoteCurrencyKey)}
		</Container>
	)
);

CurrencyPair.propTypes = {
	baseCurrencyKey: PropTypes.string.isRequired,
	quoteCurrencyKey: PropTypes.string.isRequired,
	showIcon: PropTypes.bool,
	iconProps: PropTypes.object,
};

export default CurrencyPair;
