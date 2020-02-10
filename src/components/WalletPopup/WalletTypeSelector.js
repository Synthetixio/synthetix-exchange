import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import snxJSConnector, { connectToWallet } from '../../utils/snxJSConnector';
import { hasWeb3, SUPPORTED_WALLETS, onMetamaskAccountChange } from '../../utils/networkUtils';
import { updateWalletStatus, resetWalletStatus } from '../../ducks/wallet';
import { toggleWalletPopup } from '../../ducks/ui';
import { getWalletInfo } from '../../ducks';

import { Typography } from '../Typography';

const WalletTypeSelector = ({
	updateWalletStatus,
	toggleWalletPopup,
	selectAddressScreen,
	walletInfo: { derivationPath },
}) => {
	const onWalletClick = async ({ wallet, derivationPath }) => {
		resetWalletStatus();
		const walletStatus = await connectToWallet({ wallet, derivationPath });
		updateWalletStatus({ ...walletStatus, availableWallets: [] });
		if (walletStatus && walletStatus.unlocked && walletStatus.currentWallet) {
			if (walletStatus.walletType === 'Metamask') {
				onMetamaskAccountChange(async accounts => {
					if (accounts && accounts.length > 0) {
						const signer = new snxJSConnector.signers['Metamask']({});
						snxJSConnector.setContractSettings({
							networkId: walletStatus.networkId,
							signer,
						});
						updateWalletStatus({ currentWallet: accounts[0] });
					}
				});
			}
			toggleWalletPopup(false);
		} else selectAddressScreen();
	};
	return (
		<Container>
			<Typography variant="heading" size="md">
				Connect your wallet
			</Typography>
			<Wallets>
				{SUPPORTED_WALLETS.map((wallet, i) => {
					const noMetamask = wallet === 'Metamask' && !hasWeb3();
					return (
						<Wallet
							key={i}
							disabled={noMetamask}
							onClick={() => onWalletClick({ wallet, derivationPath })}
						>
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
		transform: scale(1.04);
	}
	&:disabled {
		opacity: 0.5;
		transform: none;
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
	font-family: 'apercu-light', sans-serif;
	letter-spacing: 1px;
	font-size: 24px;
`;

const mapStateToProps = state => {
	return {
		walletInfo: getWalletInfo(state),
	};
};

const mapDispatchToProps = {
	updateWalletStatus,
	toggleWalletPopup,
	resetWalletStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletTypeSelector);
