import React, { FC, memo } from 'react';
import styled from 'styled-components';

import CardHeader, { CardHeaderProps } from './CardHeader';
import CardBody, { CardBodyProps } from './CardBody';

type CardProps = {
	children: React.ReactNode;
};

interface StaticComponents {
	Header: FC<CardHeaderProps>;
	Body: FC<CardBodyProps>;
}

// @ts-ignore
const Card: FC<CardProps> & StaticComponents = memo(({ children, ...rest }) => (
	<Container {...rest}>{children}</Container>
));

Card.Header = CardHeader;
Card.Body = CardBody;

const Container = styled.div`
	background-color: ${(props) => props.theme.colors.surfaceL2};
	display: flex;
	flex-direction: column;
`;

export default Card;
