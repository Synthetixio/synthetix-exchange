import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import snxJSConnector, { connectToWallet } from 'src/utils/snxJSConnector';
import {
	hasWeb3,
	SUPPORTED_WALLETS,
	SUPPORTED_WALLETS_MAP,
	onMetamaskAccountChange,
} from 'src/utils/networkUtils';
import { updateWalletReducer, resetWalletReducer } from 'src/ducks/wallet/walletDetails';
import { toggleWalletPopup } from 'src/ducks/ui';
import { getWalletInfo } from 'src/ducks/wallet/walletDetails';

import { HeadingMedium } from '../Typography';

import { ReactComponent as CoinbaseWallet } from 'src/assets/images/wallets/coinbase.svg';
import { ReactComponent as LedgerWallet } from 'src/assets/images/wallets/ledger.svg';
import { ReactComponent as MetamaskWallet } from 'src/assets/images/wallets/metamask.svg';
import { ReactComponent as TrezorWallet } from 'src/assets/images/wallets/trezor.svg';
import { ReactComponent as WalletConnect } from 'src/assets/images/wallets/walletConnect.svg';

const { METAMASK, LEDGER, TREZOR, COINBASE, WALLET_CONNECT } = SUPPORTED_WALLETS_MAP;

const walletTypeToIconMap = {
	[METAMASK]: MetamaskWallet,
	[LEDGER]: LedgerWallet,
	[TREZOR]: TrezorWallet,
	[COINBASE]: CoinbaseWallet,
	[WALLET_CONNECT]: WalletConnect,
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
			<HeadingMedium>{t('modals.wallet.wallet-selector.title')}</HeadingMedium>
			<Wallets>
				{SUPPORTED_WALLETS.map((wallet) => {
					const noMetamask = wallet === METAMASK && !hasWeb3();
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
	background: ${(props) => props.theme.colors.surfaceL3};
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

const WalletLabel = styled.h3`
	color: ${(props) => props.theme.colors.fontPrimary};
	font-family: 'apercu-light', sans-serif;
	letter-spacing: 1px;
	font-size: 24px;
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
