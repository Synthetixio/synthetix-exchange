import { providers } from 'ethers';
import React, { memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import uniq from 'lodash/uniq';
import styled from 'styled-components';

import Link from 'src/components/Link';
import { shortenAddress, getAddress } from 'src/utils/formatters';

import { ROUTES } from 'src/constants/routes';

import { ReactComponent as MintrLogo } from 'src/assets/images/delegate/mintr-logo.svg';
import { updateWalletReducer, resetWalletReducer } from 'src/ducks/wallet';
import { getWalletInfo } from 'src/ducks';
import Spinner from 'src/components/Spinner';

import snxJSConnector, { connectToWallet } from 'src/utils/snxJSConnector';
import { SUPPORTED_WALLETS_MAP, onMetamaskAccountChange } from 'src/utils/networkUtils';

const ListWallets = memo(
	({ walletInfo: { currentWallet }, updateWalletReducer, resetWalletReducer }) => {
		const [managedWallets, setManagedWallets] = useState(null);
		const [isLoadingWallets, setIsLoadingWallets] = useState(true);
		const [wallet, setWallet] = useState(null);
		const [error, setError] = useState(null);

		const {
			snxJS: { DelegateApprovals, contractSettings },
		} = snxJSConnector;

		const registerMetamaskAccountChange = walletStatus => {
			onMetamaskAccountChange(async accounts => {
				if (accounts && accounts.length > 0) {
					const signer = new snxJSConnector.signers[SUPPORTED_WALLETS_MAP.METAMASK]({});
					snxJSConnector.setContractSettings({
						networkId: walletStatus.networkId,
						signer,
					});
					updateWalletReducer({ currentWallet: accounts[0] });
				}
			});
		};

		const connectToMetamask = async () => {
			resetWalletReducer();
			const walletStatus = await connectToWallet({
				wallet: SUPPORTED_WALLETS_MAP.METAMASK,
			});
			updateWalletReducer({ ...walletStatus, availableWallets: [] });
			registerMetamaskAccountChange(walletStatus);
		};

		const connectToTrust = async () => {
			resetWalletReducer();
			setWallet('test');
			try {
				const networkData = await window.trustProvider.getAccounts();
				setWallet('haha');
				const { network, address } = networkData[0];
				setWallet('coucou');
				const wrappedProvider = new providers.Web3Provider(window.trustProvider);
				snxJSConnector.setContractSettings({
					networkId: network,
					signer: wrappedProvider.getSigner(),
				});
				updateWalletReducer({ currentWallet: address, networkId: network, unlocked: true });
			} catch (e) {
				setError(e.message);
			}
		};

		useEffect(() => {
			const init = async () => {
				try {
					if (window.trustProvider) {
						setWallet(window.trustProvider && window.trustProvider.getAccounts && 'yoooo');
						const networkData = await window.trustProvider.getAccounts();
						setWallet('bbbbb');
						// connectToTrust();
					} else if (window.web3 && window.web3.currentProvider.isMetaMask) {
						connectToMetamask();
					}
				} catch (e) {
					setError(e.message);
					console.log(e);
				}
			};
			init();

			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);

		useEffect(() => {
			const getDelegatedWallets = async () => {
				const filter = {
					fromBlock: 0,
					toBlock: 9e9,
					...DelegateApprovals.contract.filters.Approval(),
				};

				const events = await contractSettings.provider.getLogs(filter);

				// Note: Using getAddress() here because parseLog and web3 don't have the same format
				const delegateWallets = events
					.map(log => DelegateApprovals.contract.interface.parseLog(log))
					.filter(({ values: { delegate } }) => getAddress(delegate) === getAddress(currentWallet))
					.map(({ values: { authoriser } }) => authoriser);

				if (delegateWallets.length > 0) {
					setManagedWallets(uniq(delegateWallets));
				}
				setIsLoadingWallets(false);
			};
			if (currentWallet) {
				getDelegatedWallets();
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [currentWallet]);

		const isLoggedIn = !!currentWallet;

		return (
			<>
				<StyledLogo />
				<Headline>Choose wallet to interact with:</Headline>
				<Headline>address: {wallet}</Headline>
				<Headline>error: {error}</Headline>
				<Wallets>
					{isLoggedIn && !isLoadingWallets ? (
						<>
							{managedWallets == null
								? 'No wallets found. Please go to mintr with your main SNX wallet and delegate to a mobile or hot wallet you trust.'
								: managedWallets.map(wallet => (
										<PrimaryLink to={`${ROUTES.Delegate.ManageWallet}/${wallet}`} key={wallet}>
											{shortenAddress(wallet)}
										</PrimaryLink>
								  ))}
						</>
					) : (
						<Spinner size="sm" />
					)}
				</Wallets>
				<SecondaryLink to="https://blog.synthetix.io/a-guide-to-delegation" isExternal={true}>
					READ INSTRUCTIONS (BLOG)
				</SecondaryLink>
			</>
		);
	}
);

const StyledLogo = styled(MintrLogo)`
	width: 291px;
	height: 80px;
`;

const Headline = styled.div`
	font-family: ${props => props.theme.fonts.regular};
	color: ${props => props.theme.colors.fontPrimary};
	font-size: 20px;
	padding-bottom: 50px;
	padding-top: 16px;
`;

const Wallets = styled.div`
	flex-grow: 1;
	color: ${props => props.theme.colors.fontPrimary};
`;

const PrimaryLink = styled(Link)`
	font-weight: 500;
	font-size: 24px;
	letter-spacing: 0.2px;
	margin-bottom: 24px;
	font-family: ${props => props.theme.fonts.regular};
	color: ${props => props.theme.colors.fontPrimary};
	background-color: ${props => props.theme.colors.accentL1};
	display: flex;
	align-items: center;
	justify-content: center;
	height: 64px;
	box-sizing: border-box;
`;

const SecondaryLink = styled(PrimaryLink)`
	flex-shrink: 0;
	font-size: 20px;
	color: ${props => props.theme.colors.fontSecondary};
`;

const mapStateToProps = state => ({
	walletInfo: getWalletInfo(state),
});

const mapDispatchToProps = {
	updateWalletReducer,
	resetWalletReducer,
};

export default connect(mapStateToProps, mapDispatchToProps)(ListWallets);
