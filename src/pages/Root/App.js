import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';
import { Router, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import history from '../../utils/history';

import { ROUTES } from '../../constants/routes';

import {
	getCurrentTheme,
	getLeaderboardPopupIsVisible,
	getTwitterPopupIsVisible,
	gweiPopupIsVisible,
	walletPopupIsVisible,
} from '../../ducks/ui';

import GlobalEventsGate from '../../gates/GlobalEventsGate';

import { darkTheme } from '../../styles/theme';

import MainLayout from './components/MainLayout';
import WalletPopup from 'src/components/WalletPopup';
import GweiPopup from 'src/components/GweiPopup';
import LeaderboardPopup from 'src/components/LeaderboardPopup';
import TwitterPopup from 'src/components/TwitterPopup';

import Trade from '../Trade';
import Onboarding from '../Onboarding';

const App = ({
	isAppReady,
	leaderboardPopupIsVisible,
	twitterPopupIsVisible,
	gweiPopupIsVisible,
	walletPopupIsVisible,
}) => {
	return (
		<ThemeProvider theme={darkTheme}>
			<Router history={history}>
				{isAppReady && (
					<>
						<GlobalEventsGate />
						{walletPopupIsVisible && <WalletPopup />}
						{gweiPopupIsVisible && <GweiPopup />}
						{leaderboardPopupIsVisible && <LeaderboardPopup />}
						{twitterPopupIsVisible && <TwitterPopup />}
					</>
				)}
				<Switch>
					<Route
						path={ROUTES.TradeMatch}
						render={routeProps => (
							<MainLayout isAppReady={isAppReady}>
								<Trade {...routeProps} />
							</MainLayout>
						)}
					/>
					<Route
						path={ROUTES.Trade}
						render={routeProps => (
							<MainLayout isAppReady={isAppReady}>
								<Trade {...routeProps} />
							</MainLayout>
						)}
					/>
					<Route path={ROUTES.Home} component={Onboarding} />
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
	leaderboardPopupIsVisible: getLeaderboardPopupIsVisible(state),
	twitterPopupIsVisible: getTwitterPopupIsVisible(state),
	gweiPopupIsVisible: gweiPopupIsVisible(state),
	walletPopupIsVisible: walletPopupIsVisible(state),
});

export default connect(mapStateToProps, null)(App);
