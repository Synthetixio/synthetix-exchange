import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import history from '../../utils/history';

import { ROUTES } from '../../constants/routes';

import {
	getCurrentTheme,
	getLeaderboardPopupIsVisible,
	getDashboardPopupIsVisible,
	getTwitterPopupIsVisible,
	getViewTxModalVisible,
} from '../../ducks/ui';

import { getWalletInfo } from 'src/ducks/wallet/walletDetails';

import GlobalEventsGate from '../../gates/GlobalEventsGate';

import { darkTheme } from '../../styles/theme';

import MainLayout from './components/MainLayout';
import LeaderboardPopup from 'src/components/LeaderboardPopup';
import DashboardPopup from 'src/components/DashboardPopup';
import TwitterPopup from 'src/components/TwitterPopup';
import ViewTxModal from 'src/components/ViewTxModal';

import Trade from '../Trade';
import Onboarding from '../Onboarding';

const App = ({
	isAppReady,
	leaderboardPopupIsVisible,
	dashboardPopupIsVisible,
	twitterPopupIsVisible,
	walletInfo,
	viewTxModalVisible,
}) => (
	<ThemeProvider theme={darkTheme}>
		{isAppReady ? (
			<>
				<GlobalEventsGate />
				{leaderboardPopupIsVisible && <LeaderboardPopup />}
				{dashboardPopupIsVisible && <DashboardPopup />}
				{twitterPopupIsVisible && <TwitterPopup />}
				{viewTxModalVisible && <ViewTxModal />}
				<Router history={history}>
					<Switch>
						<Route
							path={ROUTES.TradeMatch}
							render={routeProps => (
								<>
									{walletInfo.twitterFaucet > 0 ? (
										<MainLayout isAppReady={isAppReady}>
											<Trade {...routeProps} />
										</MainLayout>
									) : (
										<Redirect to={ROUTES.Home} />
									)}
								</>
							)}
						/>
						<Route
							path={ROUTES.Trade}
							render={routeProps => (
								<>
									{walletInfo.twitterFaucet > 0 ? (
										<MainLayout isAppReady={isAppReady}>
											<Trade {...routeProps} />
										</MainLayout>
									) : (
										<Redirect to={ROUTES.Home} />
									)}
								</>
							)}
						/>
						<Route path={ROUTES.Home} component={Onboarding} />
					</Switch>
				</Router>
			</>
		) : (
			<MainLayout isAppReady={isAppReady} isOnSplashPage={true}>
				<div />
				{/* TODO: handle retries */}
			</MainLayout>
		)}
	</ThemeProvider>
);

App.propTypes = {
	isAppReady: PropTypes.bool.isRequired,
	currentTheme: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
	walletInfo: getWalletInfo(state),
	currentTheme: getCurrentTheme(state),
	leaderboardPopupIsVisible: getLeaderboardPopupIsVisible(state),
	dashboardPopupIsVisible: getDashboardPopupIsVisible(state),
	twitterPopupIsVisible: getTwitterPopupIsVisible(state),
	viewTxModalVisible: getViewTxModalVisible(state),
});

export default connect(mapStateToProps, null)(App);
