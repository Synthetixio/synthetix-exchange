import { hot } from 'react-hot-loader/root';

import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';

import snxJSConnector from '../../utils/snxJSConnector';
import { getEthereumNetwork } from '../../utils/metamaskTools';
import { getExchangeData } from '../../dataFetcher';

import { getWalletInfo } from '../../ducks';
import { setAvailableSynths, updateFrozenSynths } from '../../ducks/synths';
import { updateNetworkSettings, fetchWalletBalancesRequest } from '../../ducks/wallet';
import { fetchRates } from '../../ducks/rates';
import { setExchangeFeeRate, setNetworkGasInfo } from '../../ducks/transaction';

import { setAppReady, getIsAppReady } from '../../ducks/app';

import MaintenanceMessage from './components/MaintenanceMessage';
import App from './App';

const REFRESH_INTERVAL = 3 * 60 * 1000;

const Root = ({
	setAvailableSynths,
	setNetworkGasInfo,
	setExchangeFeeRate,
	updateFrozenSynths,
	updateNetworkSettings,
	walletInfo: { currentWallet },
	fetchWalletBalancesRequest,
	fetchRates,
	setAppReady,
	isAppReady,
}) => {
	const [intervalId, setIntervalId] = useState(null);
	const [appIsOnMaintenance, setAppIsOnMaintenace] = useState(false);
	const fetchAndSetExchangeData = useCallback(async synths => {
		const { exchangeFeeRate, networkPrices, frozenSynths } = await getExchangeData(synths);
		setExchangeFeeRate(exchangeFeeRate);
		setNetworkGasInfo(networkPrices);
		updateFrozenSynths({ frozenSynths });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fetchMaintenanceState = useCallback(async () => {
		if (process.env.REACT_APP_CONTEXT !== 'production') return;
		const {
			snxJS: { DappMaintenance },
		} = snxJSConnector;
		try {
			const isOnMaintenance = await DappMaintenance.isPausedSX();
			setAppIsOnMaintenace(isOnMaintenance);
		} catch (e) {
			console.log(e);
			setAppIsOnMaintenace(false);
		}
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

	useEffect(() => {
		const init = async () => {
			const { networkId, name } = await getEthereumNetwork();

			if (!snxJSConnector.initialized) {
				snxJSConnector.setContractSettings({ networkId });
			}
			updateNetworkSettings({ networkId, networkName: name.toLowerCase() });

			const synths = snxJSConnector.snxJS.contractSettings.synths.filter(synth => synth.asset);

			setAvailableSynths({ synths });
			setAppReady();
			fetchAndSetExchangeData(synths);
			fetchMaintenanceState();
			clearInterval(intervalId);
			const _intervalId = setInterval(() => {
				fetchAndSetExchangeData(synths);
				fetchWalletBalancesRequest();
			}, REFRESH_INTERVAL);
			setIntervalId(_intervalId);
		};

		init();

		return () => {
			clearInterval(intervalId);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetchAndSetExchangeData, fetchWalletBalancesRequest]);

	return appIsOnMaintenance ? <MaintenanceMessage /> : <App isAppReady={isAppReady} />;
};

const mapStateToProps = state => ({
	walletInfo: getWalletInfo(state),
	isAppReady: getIsAppReady(state),
});

const mapDispatchToProps = {
	setAvailableSynths,
	setNetworkGasInfo,
	updateFrozenSynths,
	updateNetworkSettings,
	setExchangeFeeRate,
	fetchWalletBalancesRequest,
	fetchRates,
	setAppReady,
};

export default hot(connect(mapStateToProps, mapDispatchToProps)(Root));
