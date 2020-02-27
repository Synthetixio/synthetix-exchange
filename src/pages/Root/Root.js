/* eslint-disable */
import { hot } from 'react-hot-loader/root';
import { createGlobalStyle } from 'styled-components';

import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { ThemeProvider } from 'styled-components';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import snxJSConnector from '../../utils/snxJSConnector';
import { getEthereumNetwork } from '../../utils/metamaskTools';
import { getExchangeData, getWalletBalances } from '../../dataFetcher';

import history from '../../utils/history';

import { getAvailableSynths, getCurrentTheme, getWalletInfo } from '../../ducks';
import { setAvailableSynths, updateFrozenSynths } from '../../ducks/synths';
import { updateWalletStatus, updateWalletBalances, fetchWalletBalances } from '../../ducks/wallet';
import { fetchRates } from '../../ducks/rates';
import { setExchangeFeeRate, setNetworkGasInfo } from '../../ducks/transaction';

import { MainLayout } from '../../shared/commonStyles';
import Header from '../../components/Header';
import WalletPopup from '../../components/WalletPopup';
import GweiPopup from '../../components/GweiPopup';
import Spinner from '../../components/Spinner';

import Trade from '../Trade';
import Loans from '../Loans';

import { isDarkTheme, lightTheme, darkTheme } from '../../styles/theme';
import { ROUTES } from '../../constants/routes';

import GlobalEventsGate from '../../gates/GlobalEventsGate';

const Root = ({
	setAvailableSynths,
	setNetworkGasInfo,
	setExchangeFeeRate,
	updateFrozenSynths,
	updateWalletStatus,
	updateWalletBalances,
	currentTheme,
	walletInfo: { currentWallet },
	fetchWalletBalances,
	fetchRates,
}) => {
	const [intervalId, setIntervalId] = useState(null);
	const [appReady, setAppReady] = useState(false);
	const fetchAndSetExchangeData = useCallback(async synths => {
		const { exchangeFeeRate, networkPrices, frozenSynths } = await getExchangeData(synths);
		setExchangeFeeRate(exchangeFeeRate);
		setNetworkGasInfo(networkPrices);
		updateFrozenSynths(frozenSynths);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (currentWallet != null) {
			fetchWalletBalances();
		}
	}, [currentWallet, fetchWalletBalances]);

	useEffect(() => {
		if (!appReady) return;
		fetchRates();
	}, [appReady]);

	useEffect(() => {
		let intervalId;
		const init = async () => {
			const { networkId, name } = await getEthereumNetwork();
			if (!snxJSConnector.initialized) {
				snxJSConnector.setContractSettings({ networkId });
				setAppReady(true);
			}
			updateWalletStatus({ networkId, networkName: name.toLowerCase() });
			const synths = snxJSConnector.snxJS.contractSettings.synths.filter(synth => synth.asset);
			setAvailableSynths(synths);
			fetchAndSetExchangeData(synths);
			clearInterval(intervalId);
			intervalId = setInterval(() => {
				fetchAndSetExchangeData(synths);
				fetchWalletBalances();
			}, 3 * 60 * 1000);
			setIntervalId(intervalId);
		};
		init();
		return () => {
			clearInterval(intervalId);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetchAndSetExchangeData, fetchWalletBalances]);

	const themeStyle = isDarkTheme(currentTheme) ? darkTheme : lightTheme;

	return (
		<ThemeProvider theme={themeStyle}>
			<Router history={history}>
				<GlobalStyle />
				<MainLayout>
					{appReady ? (
						<>
							<Header />
							<WalletPopup />
							<GweiPopup />
							<GlobalEventsGate />
							<Switch>
								<Route path={ROUTES.Trade} component={Trade} />
								<Route path={ROUTES.Loans} component={Loans} />
								<Redirect to={ROUTES.Trade} />
							</Switch>
						</>
					) : (
						<>
							<Spinner fullscreen={true} size="sm" />
						</>
					)}
				</MainLayout>
			</Router>
		</ThemeProvider>
	);
};

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${props => props.theme.colors.surfaceL1};
  }
`;

const mapStateToProps = state => {
	return {
		availableSynths: getAvailableSynths(state),
		walletInfo: getWalletInfo(state),
		currentTheme: getCurrentTheme(state),
	};
};

const mapDispatchToProps = {
	setAvailableSynths,
	setNetworkGasInfo,
	updateFrozenSynths,
	updateWalletStatus,
	updateWalletBalances,
	setExchangeFeeRate,
	fetchWalletBalances,
	fetchRates,
};

export default hot(connect(mapStateToProps, mapDispatchToProps)(Root));
