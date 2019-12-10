/* eslint-disable */
import { hot } from 'react-hot-loader/root';
import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import synthetixJsTools from '../../synthetixJsTool';
import { getEthereumNetwork } from '../../utils/metamaskTools';
import { getExchangeData } from '../../dataFetcher';

import { getAvailableSynths, getCurrentTheme } from '../../ducks';
import { updateExchangeRates, setAvailableSynths, updateFrozenSynths } from '../../ducks/synths';
import { updateWalletStatus } from '../../ducks/wallet';
// import { updateGasAndSpeedInfo, updateExchangeFeeRate } from '../../ducks/wallet';

import Trade from '../Trade';
import Home from '../Home';

import Theme from '../../styles/theme';

const Root = ({
	setAvailableSynths,
	updateExchangeRates,
	updateGasAndSpeedInfo,
	updateExchangeFeeRate,
	updateFrozenSynths,
	updateWalletStatus,
	currentTheme,
}) => {
	const [intervalId, setIntervalId] = useState(null);
	const fetchAndSetData = useCallback(async synths => {
		const { exchangeRates, exchangeFeeRate, networkPrices, frozenSynths } = await getExchangeData(
			synths
		);
		updateExchangeRates(exchangeRates);
		// updateExchangeFeeRate(exchangeFeeRate);
		// updateGasAndSpeedInfo(networkPrices);
		updateFrozenSynths(frozenSynths);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	useEffect(() => {
		const init = async () => {
			const { networkId, name } = await getEthereumNetwork();
			synthetixJsTools.setContractSettings({ networkId });
			updateWalletStatus({ networkId, networkName: name.toLowerCase() });
			const synths = synthetixJsTools.synthetixJs.contractSettings.synths.filter(
				synth => synth.asset
			);
			setAvailableSynths(synths);
			fetchAndSetData(synths);
			const intervalId = setInterval(() => {
				fetchAndSetData(synths);
			}, 30 * 1000);
			setIntervalId(intervalId);
		};
		init();
		return () => {
			clearInterval(intervalId);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetchAndSetData]);
	const themeStyle = currentTheme ? Theme(currentTheme) : Theme('light');
	return (
		<ThemeProvider theme={themeStyle}>
			<div>
				<Router>
					<RootContainer>
						<Switch>
							<Route path="/trade">
								<Trade />
							</Route>
							<Route path="/">
								<Trade />
							</Route>
						</Switch>
					</RootContainer>
				</Router>
			</div>
		</ThemeProvider>
	);
};

const RootContainer = styled.div`
	background-color: ${props => props.theme.colors.surfaceL1};
`;

const mapStateToProps = state => {
	return {
		availableSynths: getAvailableSynths(state),
		currentTheme: getCurrentTheme(state),
	};
};

const mapDispatchToProps = {
	updateExchangeRates,
	setAvailableSynths,
	// updateGasAndSpeedInfo,
	updateFrozenSynths,
	updateWalletStatus,
	// updateExchangeFeeRate,
};

export default hot(connect(mapStateToProps, mapDispatchToProps)(Root));
