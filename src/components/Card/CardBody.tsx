import React, { FC } from 'react';
import styled from 'styled-components';

export type CardBodyProps = {
	children: React.ReactNode;
};

const CardBody: FC<CardBodyProps> = ({ children, ...rest }) => (
	<Container {...rest}>{children}</Container>
);

const Container = styled.div`
	position: relative;
	padding: 16px 12px 18px 12px;
`;

export default CardBody;
