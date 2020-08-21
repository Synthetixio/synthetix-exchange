import React, { useState, useEffect } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import snxJSConnector from 'utils/snxJSConnector';
import {
	updateWalletReducer,
	updateWalletPaginatorIndex,
	setDerivationPath,
	resetWalletReducer,
} from 'ducks/wallet/walletDetails';
import { toggleWalletPopup } from 'ducks/ui';
import { getWalletInfo } from 'ducks/wallet/walletDetails';

import { headingH3CSS, headingH5CSS } from 'components/Typography/Heading';
import WalletAddressTable from '../WalletAddressTable';
import WalletPaginator from '../WalletPaginator';
import Spinner from '../Spinner';
import Select from '../Select';
import { ButtonPrimary } from '../Button';

import { media } from 'shared/media';

const WALLET_PAGE_SIZE = 5;
const LEDGER_DERIVATION_PATHS = [
	{ value: "44'/60'/0'/", label: "Ethereum - m/44'/60'/0'" },
	{ value: "44'/60'/", label: "Ethereum - Ledger Live - m/44'/60'" },
];

const useGetWallets = () => {
	const { walletPaginatorIndex, derivationPath, availableWallets } = useSelector(
		(state) => state.wallet.walletDetails
	);
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const { t } = useTranslation();

	useEffect(() => {
		const walletIndex = walletPaginatorIndex * WALLET_PAGE_SIZE;
		if (availableWallets[walletIndex]) return;
		setIsLoading(true);
		const getWallets = async () => {
			try {
				const nextWalletAddresses = await snxJSConnector.signer.getNextAddresses(
					walletIndex,
					WALLET_PAGE_SIZE
				);
				if (!nextWalletAddresses) throw new Error(t('modals.wallet.errors.could-not-get-address'));

				const nextWallets = nextWalletAddresses.map((address) => ({
					address,
					balances: {
						snxBalance: null,
						sUSDBalance: null,
						ethBalance: null,
					},
				}));

				dispatch(
					updateWalletReducer({
						unlocked: true,
						availableWallets: [...availableWallets, ...nextWallets],
					})
				);

				setIsLoading(false);

				const nextWalletsWithBalances = [];

				for (const nextWallet of nextWallets) {
					nextWalletsWithBalances.push({
						address: nextWallet.address,
						balances: {
							snxBalance: await snxJSConnector.snxJS.Synthetix.collateral(nextWallet.address),
							sUSDBalance: await snxJSConnector.snxJS.sUSD.balanceOf(nextWallet.address),
							ethBalance: await snxJSConnector.provider.getBalance(nextWallet.address),
						},
					});
				}

				dispatch(
					updateWalletReducer({
						availableWallets: [...availableWallets, ...nextWalletsWithBalances],
					})
				);
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
	const { t } = useTranslation();

	return (
		<ErrorContainer>
			<Title>{t('modals.wallet.errors.generic-error')}</Title>
			<Label>{error}</Label>
			{isLedger ? <Label>{t('modals.wallet.errors.ledger-error')}</Label> : null}

			<ButtonPrimary onClick={() => onRetry()} width="250px">
				{t('modals.wallet.retry')}
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
	const { t } = useTranslation();
	const isHardwareWallet = ['Ledger', 'Trezor'].includes(walletType);
	const isLedger = walletType === 'Ledger';
	const selectedDerivationPath = derivationPath
		? LEDGER_DERIVATION_PATHS.find((path) => path.value === derivationPath)
		: LEDGER_DERIVATION_PATHS[0];
	const onRetry = () => {
		resetWalletReducer();
		goBack();
	};
	const error = unlockError || getAddressError;

	if (error) return <ErrorMessage error={error} isLedger={isLedger} onRetry={onRetry} />;
	return (
		<Container>
			<Title>{t('modals.wallet.select-your-wallet')}</Title>
			<Body>
				{isLedger && (
					<SelectWrapper>
						<Select
							isDisabled={isLoading}
							searchable={false}
							options={LEDGER_DERIVATION_PATHS}
							value={selectedDerivationPath}
							onChange={(option) => {
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
						onIndexChange={(index) => updateWalletPaginatorIndex(index)}
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
	min-width: 1024px;
	${media.large`
		min-width: unset;
	`}
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

const Title = styled.div`
	${headingH3CSS};
	color: ${(props) => props.theme.colors.fontPrimary};
`;

const Label = styled.div`
	${headingH5CSS};
	color: ${(props) => props.theme.colors.fontPrimary};
`;
const mapStateToProps = (state) => {
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
