import React, { memo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { CARD_HEIGHT } from '../../constants/ui';

import { FlexDivCentered } from '../../shared/commonStyles';

const CardHeader = memo(({ children, ...rest }) => <Container {...rest}>{children}</Container>);

CardHeader.propTypes = {
	children: PropTypes.node.isRequired,
};

const Container = styled(FlexDivCentered)`
	background-color: ${props => props.theme.colors.surfaceL3};
	color: ${props => props.theme.colors.fontPrimary};
	height: ${CARD_HEIGHT};
	padding: 0 18px;
	justify-content: flex-start;
	text-transform: uppercase;

	> * + * {
		margin-left: 10px;
	}
`;

export default CardHeader;
