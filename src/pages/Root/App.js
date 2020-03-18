import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';
import { Router, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import history from '../../utils/history';

import { ROUTES } from '../../constants/routes';

import { getCurrentTheme } from '../../ducks';

import GlobalEventsGate from '../../gates/GlobalEventsGate';

import { isDarkTheme, lightTheme, darkTheme } from '../../styles/theme';

import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import WalletPopup from '../../components/WalletPopup';
import GweiPopup from '../../components/GweiPopup';

import Trade from '../Trade';
import Loans from '../Loans';
import Assets from '../Assets';
import Home from '../Home';

const App = ({ isAppReady, currentTheme }) => {
	const themeStyle = isDarkTheme(currentTheme) ? darkTheme : lightTheme;

	return (
		<ThemeProvider theme={themeStyle}>
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
					<ProtectedRoute
						path={ROUTES.Assets.Home}
						render={routeProps => (
							<MainLayout isAppReady={isAppReady}>
								<Assets {...routeProps} />
							</MainLayout>
						)}
					/>

					<Route path={ROUTES.Home} component={Home} />
				</Switch>
			</Router>
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
