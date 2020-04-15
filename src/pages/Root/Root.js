import { hot } from 'react-hot-loader/root';
import { Wallet } from '@ethersproject/wallet';
import { providers } from 'ethers';
import { SynthetixJs } from 'synthetix-js';

import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';

import snxJSConnector from '../../utils/snxJSConnector';
import { getExchangeData } from '../../dataFetcher';

import { getWalletInfo } from '../../ducks/wallet/walletDetails';
import { setAvailableSynths, updateFrozenSynths } from '../../ducks/synths';
import { fetchWalletBalancesRequest } from 'src/ducks/wallet/walletBalances';
import { updateWalletReducer } from 'src/ducks/wallet/walletDetails';
import { fetchRates } from '../../ducks/rates';
import { setExchangeFeeRate, setNetworkGasInfo } from '../../ducks/transaction';

import { LOCAL_STORAGE_KEYS } from 'src/constants/storage';
import { setAppReady, getIsAppReady } from '../../ducks/app';
import useInterval from 'src/shared/hooks/useInterval';

import { getPermissionString } from './utils';

import App from './App';

const REFRESH_INTERVAL = 3 * 60 * 1000;
const ADDRESS_DATA_INTERVAL = 6000;

async function mockGetAddressData(address, signature) {
	console.log(address, signature);
	const r = Math.random() > 0.5;
	const res = await Promise.resolve(
		r
			? {
					twitterId: null,
					twitterHandle: null,
					twitterFaucet: 0,
			  }
			: {
					twitterId: 1,
					twitterHandle: 'ev',
					twitterFaucet: Date.now(),
			  }
	);
	return res;
}

const Root = ({
	setAvailableSynths,
	setNetworkGasInfo,
	setExchangeFeeRate,
	updateFrozenSynths,
	updateWalletReducer,
	walletInfo,
	fetchWalletBalancesRequest,
	fetchRates,
	setAppReady,
	isAppReady,
}) => {
	const [intervalId, setIntervalId] = useState(null);
	const [addressDataIntervalDelay, setAddressDataIntervalDelay] = useState(null);
	const currentWallet = walletInfo.currentWallet;

	const fetchAndSetExchangeData = useCallback(async synths => {
		try {
			const { exchangeFeeRate, networkPrices, frozenSynths } = await getExchangeData(synths);
			setExchangeFeeRate(exchangeFeeRate);
			setNetworkGasInfo(networkPrices);
			updateFrozenSynths({ frozenSynths });
		} catch (e) {
			console.log(e);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const init = async () => {
			try {
				let account = localStorage.getItem(LOCAL_STORAGE_KEYS.L2_ACCOUNT);
				if (account == null) {
					account = Wallet.createRandom().mnemonic.phrase;
					localStorage.setItem(LOCAL_STORAGE_KEYS.L2_ACCOUNT, account);
				}

				const provider = new providers.JsonRpcProvider('https://synth.optimism.io');
				const wallet = Wallet.fromMnemonic(account);

				const walletAddr = wallet.address;
				const permissionString = getPermissionString(walletAddr);
				const [permissionSignature, addressData] = await Promise.all([
					wallet.signMessage(permissionString),
					mockGetAddressData(walletAddr, permissionSignature),
				]);

				if (addressData) {
					const networkId = 108;
					const networkName = 'ovm';
					const signer = new SynthetixJs.signers.PrivateKey(provider, networkId, wallet.privateKey);

					if (!snxJSConnector.initialized) {
						snxJSConnector.setContractSettings({
							networkId,
							signer,
							provider,
						});
					}

					updateWalletReducer({
						networkId,
						networkName,
						currentWallet: wallet.address,
						unlocked: true,
						walletType: 'Paper',
						permissionSignature,
						...addressData,
					});

					const synths = snxJSConnector.snxJS.contractSettings.synths.filter(synth => synth.asset);

					setAvailableSynths({ synths });
					setAppReady();
					fetchAndSetExchangeData(synths);

					clearInterval(intervalId);
					const _intervalId = setInterval(() => {
						fetchAndSetExchangeData(synths);
						fetchWalletBalancesRequest();
					}, REFRESH_INTERVAL);
					setIntervalId(_intervalId);
					console.log(addressData);
					if (addressData.twitterFaucet === 0) {
						setAddressDataIntervalDelay(ADDRESS_DATA_INTERVAL);
					}
				}
			} catch (e) {
				console.log(e);
			}
		};

		init();

		return () => {
			clearInterval(intervalId);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (isAppReady && currentWallet != null) {
			fetchWalletBalancesRequest();
		}
	}, [isAppReady, currentWallet, fetchWalletBalancesRequest]);

	useEffect(() => {
		if (isAppReady) {
			fetchRates();
		}
	}, [isAppReady, fetchRates]);

	useInterval(() => {
		const getAddressData = async () => {
			const addressData = await mockGetAddressData(
				walletInfo.currentWallet,
				walletInfo.permissionSignature
			);
			updateWalletReducer({
				...addressData,
			});
			if (addressData.twitterFaucet > 0) {
				setAddressDataIntervalDelay(null);
			}
		};

		getAddressData();
	}, addressDataIntervalDelay);

	return <App isAppReady={isAppReady} />;
};

const mapStateToProps = state => ({
	walletInfo: getWalletInfo(state),
	isAppReady: getIsAppReady(state),
});

const mapDispatchToProps = {
	setAvailableSynths,
	setNetworkGasInfo,
	updateFrozenSynths,
	updateWalletReducer,
	setExchangeFeeRate,
	fetchWalletBalancesRequest,
	fetchRates,
	setAppReady,
};

export default hot(connect(mapStateToProps, mapDispatchToProps)(Root));
