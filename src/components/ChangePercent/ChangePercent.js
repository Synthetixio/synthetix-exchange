import React, { memo } from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';

import { formatPercentage } from '../../utils/formatters';

export const ChangePercent = memo(({ value, isLabel = false, ...rest }) => (
	<Container isPositive={value >= 0} isLabel={isLabel} {...rest}>
		{formatPercentage(value)}
	</Container>
));

const Container = styled.span`
	${props =>
		props.isLabel
			? css`
					border-radius: 1px;
					padding: 4px 8px;
					color: ${props => props.theme.colors.white};

					background: ${props =>
						props.isPositive ? props.theme.colors.green : props.theme.colors.red};
			  `
			: css`
					color: ${props =>
						props.isPositive ? props.theme.colors.greenColor : props.theme.colors.red};
			  `}
`;

ChangePercent.propTypes = {
	value: PropTypes.number.isRequired,
};

export default ChangePercent;
