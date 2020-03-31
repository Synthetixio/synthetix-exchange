import React, { memo, useEffect, useState } from 'react';
import uniq from 'lodash/uniq';
import styled from 'styled-components';

import Link from 'src/components/Link';
import { shortenAddress, getAddress } from 'src/utils/formatters';

import { ROUTES } from 'src/constants/routes';

import { ReactComponent as MintrLogo } from 'src/assets/images/delegate/mintr-logo.svg';

import Spinner from 'src/components/Spinner';

import snxJSConnector from 'src/utils/snxJSConnector';

const ListWallets = memo(() => {
	const [currentWallet, setCurrentWallet] = useState(null);
	const [managedWallets, setManagedWallets] = useState([]);

	const {
		snxJS: { DelegateApprovals, contractSettings },
	} = snxJSConnector;

	useEffect(() => {
		if (window.web3 && window.web3.currentProvider.isMetaMask) {
			window.web3.eth.getAccounts((error, accounts) => {
				const walletAddr = accounts[0];
				setCurrentWallet(walletAddr);
			});
		} else {
			// handle
		}
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

			setManagedWallets(uniq(delegateWallets));
		};
		if (currentWallet) {
			getDelegatedWallets();
		}
	}, [currentWallet]);

	const isLoggedIn = !!currentWallet;

	return (
		<>
			<StyledLogo />
			<Headline>Choose wallet to interact with:</Headline>
			{isLoggedIn ? (
				<>
					<Wallets>
						{managedWallets.map(wallet => (
							<PrimaryLink to={`${ROUTES.Delegate.ManageWallet}/${wallet}`} key={wallet}>
								{shortenAddress(wallet)}
							</PrimaryLink>
						))}
					</Wallets>
					<SecondaryLink to="https://blog.synthetix.io/a-guide-to-delegation" isExternal={true}>
						READ INSTRUCTIONS (BLOG)
					</SecondaryLink>
				</>
			) : (
				<Spinner size="sm" />
			)}
		</>
	);
});

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

export default ListWallets;
