import React, { memo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import CardHeader from './CardHeader';
import CardBody from './CardBody';

const Card = memo(({ children, ...rest }) => <Container {...rest}>{children}</Container>);

Card.Header = CardHeader;
Card.Body = CardBody;

Card.propTypes = {
	children: PropTypes.node.isRequired,
};

const Container = styled.div`
	background-color: ${(props) => props.theme.colors.surfaceL2};
	display: flex;
	flex-direction: column;
`;

export default Card;
