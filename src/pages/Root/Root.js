import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { ethers } from 'ethers';

import snxJSConnector from 'utils/snxJSConnector';
import { getEthereumNetwork } from 'utils/networkUtils';
import { getExchangeData } from 'dataFetcher';

import { getWalletInfo } from 'ducks/wallet/walletDetails';
import { setAvailableSynths, updateFrozenSynths } from 'ducks/synths';
import { fetchWalletBalancesRequest } from 'ducks/wallet/walletBalances';
import { updateNetworkSettings } from 'ducks/wallet/walletDetails';
import { fetchRatesRequest } from 'ducks/rates';
import { setNetworkGasInfo } from 'ducks/transaction';

import { setAppReady, getIsAppReady, fetchAppStatusRequest } from 'ducks/app';

import App from './App';

const REFRESH_INTERVAL = 2 * 60 * 1000;

const Root = ({
	setAvailableSynths,
	setNetworkGasInfo,
	updateFrozenSynths,
	updateNetworkSettings,
	walletInfo: { currentWallet },
	fetchWalletBalancesRequest,
	fetchRatesRequest,
	setAppReady,
	isAppReady,
	fetchAppStatusRequest,
}) => {
	const [intervalId, setIntervalId] = useState(null);
	const fetchAndSetExchangeData = useCallback(async () => {
		const { networkPrices, frozenSynths } = await getExchangeData();
		setNetworkGasInfo(networkPrices);
		updateFrozenSynths({ frozenSynths });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (isAppReady && currentWallet != null) {
			fetchWalletBalancesRequest();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAppReady, currentWallet]);

	useEffect(() => {
		const init = async () => {
			const { networkId, name } = await getEthereumNetwork();
			if (!snxJSConnector.initialized) {
				let infuraProvider = new ethers.providers.InfuraProvider(
					'kovan',
					process.env.REACT_APP_INFURA_PROJECT_ID
				);
				// force KOVAN
				snxJSConnector.setContractSettings({ networkId: 42, provider: infuraProvider });
			}
			updateNetworkSettings({ networkId, networkName: name.toLowerCase() });

			const synths = snxJSConnector.synths.filter((synth) => synth.asset);

			setAvailableSynths({ synths });
			setAppReady();
			fetchAndSetExchangeData();
			fetchAppStatusRequest();
			fetchRatesRequest();

			// TODO: stop fetching data when system is suspended
			clearInterval(intervalId);
			const _intervalId = setInterval(() => {
				fetchAndSetExchangeData();
				fetchWalletBalancesRequest();
				fetchRatesRequest();
				fetchAppStatusRequest();
			}, REFRESH_INTERVAL);
			setIntervalId(_intervalId);
		};

		init();

		return () => {
			clearInterval(intervalId);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetchAndSetExchangeData, fetchWalletBalancesRequest]);

	return <App isAppReady={isAppReady} />;
};

const mapStateToProps = (state) => ({
	walletInfo: getWalletInfo(state),
	isAppReady: getIsAppReady(state),
});

const mapDispatchToProps = {
	setAvailableSynths,
	setNetworkGasInfo,
	updateFrozenSynths,
	updateNetworkSettings,
	fetchWalletBalancesRequest,
	fetchRatesRequest,
	setAppReady,
	fetchAppStatusRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(Root);
