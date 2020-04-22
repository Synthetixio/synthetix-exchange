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
	getTwitterPopupIsVisible,
	gweiPopupIsVisible,
	walletPopupIsVisible,
	getViewTxModalVisible,
} from '../../ducks/ui';

import { getWalletInfo } from 'src/ducks/wallet/walletDetails';

import GlobalEventsGate from '../../gates/GlobalEventsGate';

import { darkTheme } from '../../styles/theme';

import MainLayout from './components/MainLayout';
import WalletPopup from 'src/components/WalletPopup';
import GweiPopup from 'src/components/GweiPopup';
import LeaderboardPopup from 'src/components/LeaderboardPopup';
import TwitterPopup from 'src/components/TwitterPopup';
import ViewTxModal from 'src/components/ViewTxModal';

import Trade from '../Trade';
import Onboarding from '../Onboarding';

const App = ({
	isAppReady,
	leaderboardPopupIsVisible,
	twitterPopupIsVisible,
	gweiPopupIsVisible,
	walletPopupIsVisible,
	walletInfo,
	viewTxModalVisible,
}) => (
	<ThemeProvider theme={darkTheme}>
		<Router history={history}>
			{isAppReady && (
				<>
					<GlobalEventsGate />
					{walletPopupIsVisible && <WalletPopup />}
					{gweiPopupIsVisible && <GweiPopup />}
					{leaderboardPopupIsVisible && <LeaderboardPopup />}
					{twitterPopupIsVisible && <TwitterPopup />}
					{viewTxModalVisible && <ViewTxModal />}
				</>
			)}
			<Switch>
				<Route
					path={ROUTES.TradeMatch}
					render={(routeProps) => (
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
					render={(routeProps) => (
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
	</ThemeProvider>
);

App.propTypes = {
	isAppReady: PropTypes.bool.isRequired,
	currentTheme: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
	walletInfo: getWalletInfo(state),
	currentTheme: getCurrentTheme(state),
	leaderboardPopupIsVisible: getLeaderboardPopupIsVisible(state),
	twitterPopupIsVisible: getTwitterPopupIsVisible(state),
	gweiPopupIsVisible: gweiPopupIsVisible(state),
	walletPopupIsVisible: walletPopupIsVisible(state),
	viewTxModalVisible: getViewTxModalVisible(state),
});

export default connect(mapStateToProps, null)(App);
