/* eslint-disable */
import { hot } from 'react-hot-loader/root';
import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
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

import { HeadingMedium, HeadingSmall } from '../../components/Typography';
import Trade from '../Trade';
import Home from '../Home';

import { lightTheme, darkTheme } from '../../styles/theme';

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
	const [isOnMaintenance, setIsOnMaintenance] = useState(false);
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

	const getAppState = useCallback(async () => {
		try {
			setIsOnMaintenance(await snxJSConnector.snxJS.DappMaintenance.isPausedSX());
		} catch (err) {
			console.log('Could not get DappMaintenance contract data', err);
			setIsOnMaintenance(false);
		}
	}, []);

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
			getAppState();
			intervalId = setInterval(() => {
				fetchAndSetExchangeData(synths);
				fetchAndSetWalletBalances(synths);
				getAppState();
			}, 3 * 60 * 1000);
			setIntervalId(intervalId);
		};
		init();
		return () => {
			clearInterval(intervalId);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetchAndSetExchangeData, fetchAndSetWalletBalances]);
	const themeStyle = currentTheme === 'dark' ? darkTheme : lightTheme;

	return (
		<ThemeProvider theme={themeStyle}>
			<div>
				<Router>
					<RootContainer>
						{isOnMaintenance ? (
							<MaintenanceMessage>
								<HeadingMedium>sX is currently unavailable due to upgrades.</HeadingMedium>
								<HeadingSmall style={{ marginTop: '40px', fontSize: '18px' }}>
									Sorry for the inconvenience, it will be back shortly.
								</HeadingSmall>
							</MaintenanceMessage>
						) : (
							<Switch>
								<Route path="/trade">
									<Trade />
								</Route>
								<Route path="/">
									<Trade />
								</Route>
							</Switch>
						)}
					</RootContainer>
				</Router>
			</div>
		</ThemeProvider>
	);
};

const RootContainer = styled.div`
	background-color: ${props => props.theme.colors.surfaceL1};
`;

const MaintenanceMessage = styled.div`
	height: 100vh;
	display: flex;
	align-items: center;
	flex-direction: column;
	justify-content: center;
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
