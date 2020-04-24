import React, { memo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import CurrencyIcon from '../CurrencyIcon';

import { Container } from '../commonStyles';

export const CurrencyName = memo(
	({ currencyKey, currencyDesc = null, showIcon = false, iconProps = {}, ...rest }) => (
		<Container showIcon={showIcon} {...rest}>
			{showIcon && <CurrencyIcon currencyKey={currencyKey} {...iconProps} />}
			{currencyKey}
			{currencyDesc && <Desc className="currency-desc">{currencyDesc}</Desc>}
		</Container>
	)
);

CurrencyName.propTypes = {
	currencyKey: PropTypes.string.isRequired,
	showIcon: PropTypes.bool,
	iconProps: PropTypes.object,
};

const Desc = styled.span`
	padding-left: 5px;
	color: ${({ theme }) => theme.colors.fontTertiary};
`;

export default CurrencyName;
