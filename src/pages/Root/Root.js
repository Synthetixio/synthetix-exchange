import { hot } from 'react-hot-loader/root';
import { providers } from 'ethers';
import { SynthetixJs } from 'synthetix-js';
import axios from 'axios';

import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';

import snxJSConnector from '../../utils/snxJSConnector';
import { getExchangeData } from '../../dataFetcher';

import { getWalletInfo } from '../../ducks/wallet/walletDetails';
import { setAvailableSynths, updateFrozenSynths } from '../../ducks/synths';
import { fetchLeaderboardRequest } from 'src/ducks/leaderboard';

import { fetchWalletBalancesRequest } from 'src/ducks/wallet/walletBalances';
import { updateWalletReducer } from 'src/ducks/wallet/walletDetails';
import { fetchRates } from '../../ducks/rates';
import { setExchangeFeeRate, setNetworkGasInfo } from '../../ducks/transaction';

import { setAppReady, getIsAppReady } from '../../ducks/app';
import useInterval from 'src/shared/hooks/useInterval';

import { getPermissionString, getBurnerWallet } from './utils';

import history from 'src/utils/history';
import { ROUTES } from 'src/constants/routes';

import App from './App';

const REFRESH_INTERVAL = 3 * 60 * 1000;
const ADDRESS_DATA_INTERVAL = 6000;

async function getAddressData(address, signature) {
	try {
		const response = await axios.post('https://l2.api.synthetix.io/api/address-data', {
			address,
			signature,
		});
		return response.data;
	} catch (e) {
		console.error(e);
	}
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
	fetchLeaderboardRequest,
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
				const provider = new providers.JsonRpcProvider('https://synth.optimism.io');
				const wallet = getBurnerWallet();

				const walletAddr = wallet.address;
				const permissionString = getPermissionString(walletAddr);
				const permissionSignature = await wallet.signMessage(permissionString);
				const addressData = await getAddressData(walletAddr, permissionSignature);

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

					// grab crypto synths + sUSD
					const synths = snxJSConnector.snxJS.contractSettings.synths.filter(
						synth => synth.asset && (synth.category === 'crypto' || synth.name === 'sUSD')
					);

					setAvailableSynths({ synths });
					fetchAndSetExchangeData(synths);

					clearInterval(intervalId);
					const _intervalId = setInterval(() => {
						fetchAndSetExchangeData(synths);
						fetchWalletBalancesRequest();
					}, REFRESH_INTERVAL);
					setIntervalId(_intervalId);

					updateWalletReducer({
						networkId,
						networkName,
						currentWallet: wallet.address,
						unlocked: true,
						walletType: 'Paper',
						permissionSignature,
						...addressData,
					});

					setAppReady();

					if (addressData.twitterFaucet === 0) {
						setAddressDataIntervalDelay(ADDRESS_DATA_INTERVAL);
					} else {
						history.push(ROUTES.Trade);
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
		if (isAppReady) {
			if (currentWallet != null) {
				fetchWalletBalancesRequest();
			}
			fetchLeaderboardRequest();
		}
	}, [isAppReady, currentWallet, fetchWalletBalancesRequest]);

	useEffect(() => {
		if (isAppReady) {
			fetchRates();
		}
	}, [isAppReady, fetchRates]);

	useInterval(() => {
		const updateAddressData = async () => {
			try {
				const addressData = await getAddressData(
					walletInfo.currentWallet,
					walletInfo.permissionSignature
				);
				if (addressData.twitterFaucet > 0) {
					fetchWalletBalancesRequest();
					setAddressDataIntervalDelay(null);
				}
				updateWalletReducer({
					...addressData,
				});
			} catch (e) {
				console.error(e);
			}
		};

		updateAddressData();
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
	fetchLeaderboardRequest,
	setAppReady,
};

export default hot(connect(mapStateToProps, mapDispatchToProps)(Root));
