import { hot } from 'react-hot-loader/root';

import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';

import snxJSConnector from '../../utils/snxJSConnector';
import { getEthereumNetwork } from '../../utils/metamaskTools';
import { getExchangeData } from '../../dataFetcher';

import { getWalletInfo } from '../../ducks';
import { setAvailableSynths, updateFrozenSynths } from '../../ducks/synths';
import { updateWalletStatus, fetchWalletBalances } from '../../ducks/wallet';
import { fetchRates } from '../../ducks/rates';
import { setExchangeFeeRate, setNetworkGasInfo } from '../../ducks/transaction';

import { setAppReady, getIsAppReady } from '../../ducks/app';

import App from './App';

const REFRESH_INTERVAL = 3 * 60 * 1000;

const Root = ({
	setAvailableSynths,
	setNetworkGasInfo,
	setExchangeFeeRate,
	updateFrozenSynths,
	updateWalletStatus,
	walletInfo: { currentWallet },
	fetchWalletBalances,
	fetchRates,
	setAppReady,
	isAppReady,
}) => {
	const [intervalId, setIntervalId] = useState(null);
	const fetchAndSetExchangeData = useCallback(async synths => {
		const { exchangeFeeRate, networkPrices, frozenSynths } = await getExchangeData(synths);
		setExchangeFeeRate(exchangeFeeRate);
		setNetworkGasInfo(networkPrices);
		updateFrozenSynths({ frozenSynths });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (isAppReady && currentWallet != null) {
			fetchWalletBalances();
		}
	}, [isAppReady, currentWallet, fetchWalletBalances]);

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
			updateWalletStatus({ networkId, networkName: name.toLowerCase() });

			const synths = snxJSConnector.snxJS.contractSettings.synths.filter(synth => synth.asset);

			setAvailableSynths({ synths });
			setAppReady();
			fetchAndSetExchangeData(synths);

			clearInterval(intervalId);
			const _intervalId = setInterval(() => {
				fetchAndSetExchangeData(synths);
				fetchWalletBalances();
			}, REFRESH_INTERVAL);
			setIntervalId(_intervalId);
		};

		init();

		return () => {
			clearInterval(intervalId);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetchAndSetExchangeData, fetchWalletBalances]);

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
	updateWalletStatus,
	setExchangeFeeRate,
	fetchWalletBalances,
	fetchRates,
	setAppReady,
};

export default hot(connect(mapStateToProps, mapDispatchToProps)(Root));
