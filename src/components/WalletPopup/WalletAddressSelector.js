import React, { useState, useEffect } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import snxJSConnector from '../../utils/snxJSConnector';
// import { hasWeb3, SUPPORTED_WALLETS, onMetamaskAccountChange } from '../../utils/networkUtils';
import { updateWalletStatus } from '../../ducks/wallet';
import { toggleWalletPopup } from '../../ducks/ui';
import { getWalletInfo } from '../../ducks';

import { HeadingMedium } from '../Typography';
import WalletAddressTable from '../WalletAddressTable';
import WalletPaginator from '../WalletPaginator';

import { bigNumberFormatter } from '../../utils/formatters';

const WALLET_PAGE_SIZE = 5;
const LEDGER_DERIVATION_PATHS = [
	{ value: "44'/60'/0'/", label: "Ethereum - m/44'/60'/0'" },
	{ value: "44'/60'/", label: "Ethereum - Ledger Live - m/44'/60'" },
];

const useGetWallets = () => {
	const { walletPaginatorIndex, derivationPath, availableWallets } = useSelector(
		state => state.wallet
	);
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	useEffect(() => {
		const walletIndex = walletPaginatorIndex * WALLET_PAGE_SIZE;
		if (availableWallets[walletIndex]) return;
		setIsLoading(true);
		const getWallets = async () => {
			try {
				const results = await snxJSConnector.signer.getNextAddresses(walletIndex, WALLET_PAGE_SIZE);
				if (!results) throw new Error('Could not get addresses from wallet');
				const nextWallets = results.map(address => {
					return {
						address,
						balances: [],
					};
				});
				dispatch(
					updateWalletStatus({
						unlocked: true,
						availableWallets: [...availableWallets, ...nextWallets],
					})
				);
				setIsLoading(false);

				const getBalanceForWallet = async wallet => {
					return {
						snxBalance: await snxJSConnector.snxJS.Synthetix.collateral(wallet.address),
						sUSDBalance: await snxJSConnector.snxJS.sUSD.balanceOf(wallet.address),
						ethBalance: await snxJSConnector.provider.getBalance(wallet.address),
					};
				};

				nextWallets.forEach((wallet, index) => {
					getBalanceForWallet(wallet, index).then(balance => {
						wallet.balances = {
							snxBalance: bigNumberFormatter(balance.snxBalance),
							sUSDBalance: bigNumberFormatter(balance.sUSDBalance),
							ethBalance: bigNumberFormatter(balance.ethBalance),
						};

						dispatch(
							updateWalletStatus({ availableWallets: [...availableWallets, ...nextWallets] })
						);
					});
				});
			} catch (e) {
				console.log(e);
				setError(e.message);
				dispatch(
					updateWalletStatus({
						unlocked: false,
					})
				);
			}
		};
		getWallets();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [walletPaginatorIndex, derivationPath]);
	return { isLoading, error };
};

/* eslint-disable */
const WalletAddressSelector = ({
	toggleWalletPopup,
	updateWalletStatus,
	walletInfo: {
		derivationPath,
		walletType,
		walletPaginatorIndex,
		availableWallets = [],
		// networkName,
		// networkId,
	},
}) => {
	const { isLoading, error } = useGetWallets(walletPaginatorIndex, derivationPath);
	const isHardwareWallet = ['Ledger', 'Trezor'].includes(walletType);
	const isLedger = walletType === 'Ledger';
	const selectedDerivationPath = derivationPath
		? LEDGER_DERIVATION_PATHS.find(path => path.value === derivationPath)
		: LEDGER_DERIVATION_PATHS[0];
	return (
		<Container>
			<HeadingMedium>Select your wallet</HeadingMedium>
			<Body>
				{/* {isLedger && (
					<SelectWrapper>
						<SimpleSelect
							isDisabled={isLoading}
							searchable={false}
							options={LEDGER_DERIVATION_PATHS}
							value={selectedDerivationPath}
							onChange={option => {
								if (option.value === derivationPath) return;
								const signerOptions = {
									type: 'Ledger',
									networkId,
									derivationPath: option.value,
								};
								derivationPathChange(signerOptions, option.value, dispatch);
							}}
						></SimpleSelect>
					</SelectWrapper>
				)} */}
				<AddressesContainer>
					<WalletAddressTable
						data={availableWallets.slice(
							walletPaginatorIndex * WALLET_PAGE_SIZE,
							walletPaginatorIndex * WALLET_PAGE_SIZE + WALLET_PAGE_SIZE
						)}
						onWalletSelection={(wallet, index) => {
							const walletIndex = walletPaginatorIndex * WALLET_PAGE_SIZE + index;
							if (isHardwareWallet) {
								snxJSConnector.signer.setAddressIndex(walletIndex);
							}
							updateWalletStatus({ currentWallet: wallet.address });
							toggleWalletPopup(false);
						}}
					/>
					<WalletPaginator />
				</AddressesContainer>
			</Body>
		</Container>
	);
};

const Body = styled.div``;
const Container = styled.div`
	text-align: center;
	width: 100%;
`;

const AddressesContainer = styled.div`
	margin-top: 50px;
`;

const mapStateToProps = state => {
	return {
		walletInfo: getWalletInfo(state),
	};
};

const mapDispatchToProps = {
	updateWalletStatus,
	toggleWalletPopup,
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletAddressSelector);
