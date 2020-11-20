import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import snxJSConnector, { connectToWallet } from 'utils/snxJSConnector';
import {
	hasEthereumInjected,
	SUPPORTED_WALLETS,
	SUPPORTED_WALLETS_MAP,
	onMetamaskAccountChange,
} from 'utils/networkUtils';
import { updateWalletReducer, resetWalletReducer } from 'ducks/wallet/walletDetails';
import { toggleWalletPopup } from 'ducks/ui';
import { getWalletInfo } from 'ducks/wallet/walletDetails';

import { headingH3CSS, headingH5CSS } from 'components/Typography/Heading';

import { ReactComponent as CoinbaseWallet } from 'assets/images/wallets/coinbase.svg';
import { ReactComponent as LedgerWallet } from 'assets/images/wallets/ledger.svg';
import { ReactComponent as MetamaskWallet } from 'assets/images/wallets/metamask.svg';
import { ReactComponent as TrezorWallet } from 'assets/images/wallets/trezor.svg';
import { ReactComponent as WalletConnect } from 'assets/images/wallets/walletConnect.svg';
import { ReactComponent as Portis } from 'assets/images/wallets/portis.svg';

import { media } from 'shared/media';

const { METAMASK, LEDGER, TREZOR, COINBASE, WALLET_CONNECT, PORTIS } = SUPPORTED_WALLETS_MAP;

const walletTypeToIconMap = {
	[METAMASK]: MetamaskWallet,
	[LEDGER]: LedgerWallet,
	[TREZOR]: TrezorWallet,
	[COINBASE]: CoinbaseWallet,
	[WALLET_CONNECT]: WalletConnect,
	[PORTIS]: Portis,
};

const WalletTypeSelector = ({
	updateWalletReducer,
	toggleWalletPopup,
	selectAddressScreen,
	walletInfo: { derivationPath },
}) => {
	const { t } = useTranslation();

	const onWalletClick = async ({ wallet, derivationPath }) => {
		resetWalletReducer();
		const walletStatus = await connectToWallet({ wallet, derivationPath });
		updateWalletReducer({ ...walletStatus, availableWallets: [] });
		if (walletStatus && walletStatus.unlocked && walletStatus.currentWallet) {
			if (walletStatus.walletType === METAMASK) {
				onMetamaskAccountChange(async (accounts) => {
					if (accounts && accounts.length > 0) {
						const signer = new snxJSConnector.signers[METAMASK]({});
						snxJSConnector.setContractSettings({
							networkId: walletStatus.networkId,
							signer,
						});
						updateWalletReducer({ currentWallet: accounts[0] });
					}
				});
			}
			toggleWalletPopup(false);
		} else selectAddressScreen();
	};

	return (
		<Container>
			<Title>{t('modals.wallet.connect-your-wallet')}</Title>
			<Wallets>
				{SUPPORTED_WALLETS.map((wallet) => {
					const noMetamask = wallet === METAMASK && !hasEthereumInjected();
					const Icon = walletTypeToIconMap[wallet];

					// unsupported wallet
					if (Icon == null) {
						return null;
					}

					return (
						<Wallet
							key={wallet}
							disabled={noMetamask}
							onClick={() => onWalletClick({ wallet, derivationPath })}
						>
							<Icon width="80px" height="80px" style={{ marginBottom: '25px' }} />
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
`;

const Wallets = styled.div`
	display: grid;
	grid-auto-flow: column;
	width: 100%;
	grid-gap: 20px;
	margin-top: 80px;
	justify-content: center;
	${media.large`
		grid-auto-flow: unset;
		grid-template-columns: auto auto auto;
		grid-template-rows: auto auto;
	`}
	${media.medium`
		grid-auto-flow: unset;
		grid-template-columns: auto auto;
		grid-template-rows: auto auto auto;
	`}
`;

const Wallet = styled.button`
	cursor: pointer;
	border: 1px solid ${(props) => props.theme.colors.accentL1};
	border-radius: 2px;
	background-color: ${(props) => props.theme.colors.surfaceL3};
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 180px;
	height: 240px;
	&:disabled {
		opacity: 0.5;
		transform: none;
		cursor: not-allowed;
	}
	&:hover:not([disabled]) {
		transform: translateY(-20px);
		background-color: ${(props) => props.theme.colors.accentL1};
	}
	transition: transform 0.2s ease-in-out;
	${media.medium`
		width: 150px;
		height: 200px;
	`}
`;

const Title = styled.div`
	${headingH3CSS};
	color: ${(props) => props.theme.colors.fontPrimary};
`;

const WalletLabel = styled.div`
	${headingH5CSS};
	color: ${(props) => props.theme.colors.fontPrimary};
`;

const mapStateToProps = (state) => ({
	walletInfo: getWalletInfo(state),
});

const mapDispatchToProps = {
	updateWalletReducer,
	toggleWalletPopup,
	resetWalletReducer,
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletTypeSelector);
