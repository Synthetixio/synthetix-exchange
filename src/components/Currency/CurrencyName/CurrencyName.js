import React, { memo } from 'react';
import PropTypes from 'prop-types';

import CurrencyIcon from '../CurrencyIcon';

import { Container } from '../commonStyles';

export const CurrencyName = memo(({ currencyKey, showIcon = false, iconProps = {}, ...rest }) => (
	<Container showIcon={showIcon} {...rest}>
		{showIcon && <CurrencyIcon currencyKey={currencyKey} {...iconProps} />}
		{currencyKey}
	</Container>
));

CurrencyName.propTypes = {
	currencyKey: PropTypes.string.isRequired,
	showIcon: PropTypes.bool,
	iconProps: PropTypes.object,
};

export default CurrencyName;
