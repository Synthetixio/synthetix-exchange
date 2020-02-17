/* eslint-disable */
import { hot } from 'react-hot-loader/root';
import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import snxJSConnector from '../../utils/snxJSConnector';
import { getEthereumNetwork } from '../../utils/metamaskTools';
import { getExchangeData, getWalletBalances } from '../../dataFetcher';

import { getAvailableSynths, getCurrentTheme, getWalletInfo } from '../../ducks';
import {
	updateExchangeRates,
	setAvailableSynths,
	updateFrozenSynths,
	updateTopSynthByVolume,
} from '../../ducks/synths';
import { updateWalletStatus, updateWalletBalances } from '../../ducks/wallet';
import { setExchangeFeeRate, setNetworkGasInfo } from '../../ducks/transaction';

import { MainLayout } from '../../shared/commonStyles';
import Banner from '../../components/Banner';
import Header from '../../components/Header';
import WalletPopup from '../../components/WalletPopup';
import GweiPopup from '../../components/GweiPopup';

import Trade from '../Trade';
import Loans from '../Loans';

import { isDarkTheme, lightTheme, darkTheme } from '../../styles/theme';
import { ROUTES } from '../../constants/routes';

const Root = ({
	setAvailableSynths,
	updateExchangeRates,
	setNetworkGasInfo,
	setExchangeFeeRate,
	updateFrozenSynths,
	updateWalletStatus,
	updateWalletBalances,
	updateTopSynthByVolume,
	currentTheme,
	walletInfo: { currentWallet },
}) => {
	const [intervalId, setIntervalId] = useState(null);
	const fetchAndSetExchangeData = useCallback(async synths => {
		const {
			exchangeRates,
			exchangeFeeRate,
			networkPrices,
			frozenSynths,
			topSynthByVolume,
		} = await getExchangeData(synths);
		updateExchangeRates(exchangeRates);
		setExchangeFeeRate(exchangeFeeRate);
		setNetworkGasInfo(networkPrices);
		updateFrozenSynths(frozenSynths);
		updateTopSynthByVolume(topSynthByVolume);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fetchAndSetWalletBalances = useCallback(
		async synths => {
			if (!currentWallet) return;
			updateWalletBalances(await getWalletBalances(currentWallet, synths));
		},
		[currentWallet]
	);

	useEffect(() => {
		let intervalId;
		const init = async () => {
			const { networkId, name } = await getEthereumNetwork();
			if (!snxJSConnector.initialized) {
				snxJSConnector.setContractSettings({ networkId });
			}
			updateWalletStatus({ networkId, networkName: name.toLowerCase() });
			const synths = snxJSConnector.snxJS.contractSettings.synths.filter(synth => synth.asset);
			setAvailableSynths(synths);
			fetchAndSetExchangeData(synths);
			fetchAndSetWalletBalances(synths);
			clearInterval(intervalId);
			intervalId = setInterval(() => {
				fetchAndSetExchangeData(synths);
				fetchAndSetWalletBalances(synths);
			}, 3 * 60 * 1000);
			setIntervalId(intervalId);
		};
		init();
		return () => {
			clearInterval(intervalId);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetchAndSetExchangeData, fetchAndSetWalletBalances]);
	const themeStyle = isDarkTheme(currentTheme) ? darkTheme : lightTheme;

	return (
		<ThemeProvider theme={themeStyle}>
			<Router history={history}>
				<RootContainer>
					<MainLayout>
						<Banner />
						<Header />
						<WalletPopup />
						<GweiPopup />
						<Switch>
							<Route path={ROUTES.Trade} component={Trade} />
							<Route path={ROUTES.Loans} component={Loans} />
							<Redirect to={ROUTES.Trade} />
						</Switch>
					</MainLayout>
				</RootContainer>
			</Router>
		</ThemeProvider>
	);
};

const RootContainer = styled.div`
	background-color: ${props => props.theme.colors.surfaceL1};
`;

const mapStateToProps = state => {
	return {
		availableSynths: getAvailableSynths(state),
		walletInfo: getWalletInfo(state),
		currentTheme: getCurrentTheme(state),
	};
};

const mapDispatchToProps = {
	updateExchangeRates,
	setAvailableSynths,
	setNetworkGasInfo,
	updateFrozenSynths,
	updateWalletStatus,
	updateWalletBalances,
	setExchangeFeeRate,
	updateTopSynthByVolume,
};

export default hot(connect(mapStateToProps, mapDispatchToProps)(Root));
