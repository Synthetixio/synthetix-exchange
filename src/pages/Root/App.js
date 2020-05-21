import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import history from '../../utils/history';

import { ROUTES } from '../../constants/routes';

import { getCurrentTheme } from '../../ducks/ui';

import GlobalEventsGate from '../../gates/GlobalEventsGate';

import { isDarkTheme, lightTheme, darkTheme } from '../../styles/theme';

import MainLayout from './components/MainLayout';
import HomeLayout from './components/HomeLayout';
import ProtectedRoute from './components/ProtectedRoute';
import WalletPopup from '../../components/WalletPopup';
import GweiPopup from '../../components/GweiPopup';
// import AppBanner from './components/AppBanner';

import Trade from '../Trade';
import Loans from '../Loans';
import Assets from '../Assets';
import Home from '../Home';
import Markets from '../Markets';
import Synths from '../Synths';

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
						{/* <AppBanner /> */}
					</>
				)}
				<Switch>
					<Route
						path={ROUTES.TradeMatch}
						render={(routeProps) => (
							<MainLayout isAppReady={isAppReady}>
								<Trade {...routeProps} />
							</MainLayout>
						)}
					/>
					<Route
						path={ROUTES.Trade}
						render={(routeProps) => (
							<MainLayout isAppReady={isAppReady}>
								<Trade {...routeProps} />
							</MainLayout>
						)}
					/>
					<Route
						path={ROUTES.Loans}
						render={(routeProps) => (
							<MainLayout isAppReady={isAppReady}>
								<Loans {...routeProps} />
							</MainLayout>
						)}
					/>
					<ProtectedRoute
						path={ROUTES.Assets.Home}
						render={(routeProps) => (
							<MainLayout isAppReady={isAppReady}>
								<Assets {...routeProps} />
							</MainLayout>
						)}
					/>
					<Route
						path={ROUTES.Markets}
						render={(routeProps) => (
							<HomeLayout>
								<Markets {...routeProps} />
							</HomeLayout>
						)}
					/>
					<Route
						path={ROUTES.Synths.Home}
						render={(routeProps) => (
							<HomeLayout>
								<Synths {...routeProps} />
							</HomeLayout>
						)}
					/>
					<Route
						path={ROUTES.Home}
						render={(routeProps) => (
							<HomeLayout>
								<Home {...routeProps} />
							</HomeLayout>
						)}
					/>
				</Switch>
			</Router>
		</ThemeProvider>
	);
};

App.propTypes = {
	isAppReady: PropTypes.bool.isRequired,
	currentTheme: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
	currentTheme: getCurrentTheme(state),
});

export default connect(mapStateToProps, null)(App);
