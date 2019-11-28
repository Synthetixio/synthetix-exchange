import React from 'react';
import styled from 'styled-components';

import { HeadingSmall } from '../Typography';

const WalletBox = () => {
	return (
		<Container>
			<Header>
				<HeaderBlock>
					<HeadingSmall>Wallet Balance</HeadingSmall>
				</HeaderBlock>
				<HeaderBlock></HeaderBlock>
			</Header>
			<Body></Body>
		</Container>
	);
};

const Container = styled.div`
	width: 100%;
	height: 100%;
	background-color: ${props => props.theme.colors.surfaceL2};
`;

const Header = styled.div`
	background-color: ${props => props.theme.colors.surfaceL3};
	width: 100%;
	height: 54px;
	display: flex;
	align-items: center;
	padding: 0 18px;
	justify-content: space-between;
	text-transform: uppercase;
`;

const Body = styled.div`
	padding: 18px;
`;

const HeaderBlock = styled.div`
	display: flex;
	align-items: baseline;
	& > * {
		margin: 0 6px;
		&:first-child {
			margin-left: 0;
		}
		&:last-child {
			margin-right: 0;
		}
	}
`;

export default WalletBox;
