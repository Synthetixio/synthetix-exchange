import React from 'react';
import styled from 'styled-components';

import { HeadingMedium } from '../Typography';

const SUPPORTED_WALLETS = ['Metamask', 'Trezor', 'Ledger', 'Coinbase'];

const WalletTypeSelector = () => {
	return (
		<Container>
			<HeadingMedium>Connect your wallet</HeadingMedium>
			<Wallets>
				{SUPPORTED_WALLETS.map(wallet => {
					return (
						<Wallet onClick={() => null}>
							<WalletIcon src={`/images/wallets/${wallet.toLowerCase()}.svg`} />
							<WalletLabel>{wallet}</WalletLabel>
						</Wallet>
					);
				})}
			</Wallets>
		</Container>
	);
};

const Container = styled.div`
	text-align: center;
	width: 100%;
`;

const Wallets = styled.div`
	width: 100%;
	justify-content: space-between;
	display: flex;
	margin-top: 80px;
`;

const Wallet = styled.button`
	cursor: pointer;
	border: none;
	background-color: ${props => props.theme.colors.surfaceL3};
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 200px;
	height: 260px;
	&:hover {
		transform: scale(1.1);
	}
	transition: transform 0.2s ease-in-out;
`;

const WalletIcon = styled.img`
	width: 80px;
	height: 80px;
	margin-bottom: 25px;
`;

const WalletLabel = styled.h3`
	color: ${props => props.theme.colors.fontPrimary};
	font-family: 'apercu-light';
	letter-spacing: 1px;
	font-size: 24px;
`;

export default WalletTypeSelector;
