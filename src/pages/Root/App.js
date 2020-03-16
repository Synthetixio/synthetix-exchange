import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';
import { Router, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import snxJSConnector from '../../utils/snxJSConnector';

import history from '../../utils/history';

import { ROUTES } from '../../constants/routes';

import { getCurrentTheme } from '../../ducks';

import GlobalEventsGate from '../../gates/GlobalEventsGate';

import { isDarkTheme, lightTheme, darkTheme } from '../../styles/theme';

import MainLayout from './components/MainLayout';
import WalletPopup from '../../components/WalletPopup';
import GweiPopup from '../../components/GweiPopup';

import Trade from '../Trade';
import Loans from '../Loans';
import Home from '../Home';

import MaintenanceMessage from './components/MaintenanceMessage';

const REFRESH_INTERVAL = 3 * 60 * 1000;

const App = ({ isAppReady, currentTheme }) => {
	const [intervalId, setIntervalId] = useState(null);
	const [appIsOnMaintenance, setAppIsOnMaintenace] = useState(false);
	const themeStyle = isDarkTheme(currentTheme) ? darkTheme : lightTheme;

	const fetchMaintenanceState = async () => {
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
	};

	useEffect(() => {
		if (!isAppReady) return;
		fetchMaintenanceState();
		clearInterval(intervalId);
		const _intervalId = setInterval(() => {
			fetchMaintenanceState();
		}, REFRESH_INTERVAL);
		setIntervalId(_intervalId);
		return () => {
			clearInterval(intervalId);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAppReady]);

	return (
		<ThemeProvider theme={themeStyle}>
			{appIsOnMaintenance ? (
				<MaintenanceMessage />
			) : (
				<Router history={history}>
					{isAppReady && (
						<>
							<GlobalEventsGate />
							<WalletPopup />
							<GweiPopup />
						</>
					)}
					<Switch>
						<Route
							path={ROUTES.Trade}
							render={routeProps => (
								<MainLayout isAppReady={isAppReady}>
									<Trade {...routeProps} />
								</MainLayout>
							)}
						/>
						<Route
							path={ROUTES.Loans}
							render={routeProps => (
								<MainLayout isAppReady={isAppReady}>
									<Loans {...routeProps} />
								</MainLayout>
							)}
						/>
						<Route path={ROUTES.Home} component={Home} />
					</Switch>
				</Router>
			)}
		</ThemeProvider>
	);
};

App.propTypes = {
	isAppReady: PropTypes.bool.isRequired,
	currentTheme: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
	currentTheme: getCurrentTheme(state),
});

export default connect(mapStateToProps, null)(App);
