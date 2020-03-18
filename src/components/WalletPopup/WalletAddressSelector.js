import React, { useState, useEffect } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import snxJSConnector from 'src/utils/snxJSConnector';
import {
	updateWalletReducer,
	updateWalletPaginatorIndex,
	setDerivationPath,
	resetWalletReducer,
} from 'src/ducks/wallet';
import { toggleWalletPopup } from 'src/ducks/ui';
import { getWalletInfo } from 'src/ducks';

import { HeadingMedium } from '../Typography';
import WalletAddressTable from '../WalletAddressTable';
import WalletPaginator from '../WalletPaginator';
import Spinner from '../Spinner';
import Select from '../Select';
import { ButtonPrimary } from '../Button';

import { bigNumberFormatter } from 'src/utils/formatters';

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
					updateWalletReducer({
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
							updateWalletReducer({ availableWallets: [...availableWallets, ...nextWallets] })
						);
					});
				});
			} catch (e) {
				console.log(e);
				setError(e.message);
				dispatch(
					updateWalletReducer({
						unlocked: false,
					})
				);
			}
		};
		getWallets();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [walletPaginatorIndex, derivationPath]);
	return { isLoading, getAddressError: error };
};

const ErrorMessage = ({ error, isLedger, onRetry }) => {
	return (
		<ErrorContainer>
			<HeadingMedium>Error</HeadingMedium>
			<HeadingMedium fontFamily="apercu-light" fontSize={'18px'}>
				{error}
			</HeadingMedium>
			{isLedger ? (
				<HeadingMedium fontFamily="apercu-light" fontSize={'18px'}>
					Please make sure your Ledger is unlocked, on Ethereum app with contract data setting
					allowed
				</HeadingMedium>
			) : null}

			<ButtonPrimary onClick={() => onRetry()} width="250px">
				Retry
			</ButtonPrimary>
		</ErrorContainer>
	);
};

const WalletAddressSelector = ({
	toggleWalletPopup,
	updateWalletReducer,
	resetWalletReducer,
	updateWalletPaginatorIndex,
	setDerivationPath,
	goBack,
	walletInfo: {
		derivationPath,
		walletType,
		walletPaginatorIndex,
		availableWallets = [],
		networkId,
		unlockError,
	},
}) => {
	const { isLoading, getAddressError } = useGetWallets(walletPaginatorIndex, derivationPath);
	const isHardwareWallet = ['Ledger', 'Trezor'].includes(walletType);
	const isLedger = walletType === 'Ledger';
	const selectedDerivationPath = derivationPath
		? LEDGER_DERIVATION_PATHS.find(path => path.value === derivationPath)
		: LEDGER_DERIVATION_PATHS[0];
	const onRetry = () => {
		resetWalletReducer();
		goBack();
	};
	const error = unlockError || getAddressError;

	if (error) return <ErrorMessage error={error} isLedger={isLedger} onRetry={onRetry} />;
	return (
		<Container>
			<HeadingMedium>Select your wallet</HeadingMedium>
			<Body>
				{isLedger && (
					<SelectWrapper>
						<Select
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
								setDerivationPath({ signerOptions, derivationPath: option.value });
							}}
						></Select>
					</SelectWrapper>
				)}
				<AddressesContainer>
					{isLoading ? (
						<Spinner />
					) : (
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
								updateWalletReducer({ currentWallet: wallet.address });
								toggleWalletPopup(false);
							}}
						/>
					)}
				</AddressesContainer>
				{availableWallets && availableWallets.length > 0 ? (
					<WalletPaginator
						disabled={isLoading || !isHardwareWallet}
						currentIndex={walletPaginatorIndex}
						onIndexChange={index => updateWalletPaginatorIndex(index)}
					/>
				) : null}
			</Body>
		</Container>
	);
};

const Body = styled.div``;

const SelectWrapper = styled.div`
	width: 400px;
	margin: 30px auto 20px auto;
`;

const Container = styled.div`
	text-align: center;
	width: 100%;
`;

const ErrorContainer = styled.div`
	text-align: center;
	& > * {
		margin-bottom: 20px;
	}
`;

const AddressesContainer = styled.div`
	margin-top: 50px;
	min-height: 350px;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const mapStateToProps = state => {
	return {
		walletInfo: getWalletInfo(state),
	};
};

const mapDispatchToProps = {
	updateWalletReducer,
	toggleWalletPopup,
	updateWalletPaginatorIndex,
	setDerivationPath,
	resetWalletReducer,
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletAddressSelector);
