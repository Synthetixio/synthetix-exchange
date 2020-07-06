import React, { FC, lazy } from 'react';
import { ThemeProvider } from 'styled-components';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';

import { ROUTES } from 'constants/routes';

import { getCurrentTheme } from 'ducks/ui';
import { getIsSystemSuspended } from 'ducks/app';
import { RootState } from 'ducks/types';

import GlobalEventsGate from 'gates/GlobalEventsGate';

import { isDarkTheme, lightTheme, darkTheme } from 'styles/theme';

import MaintenanceMessage from './components/MaintenanceMessage';
import MainLayout from './components/MainLayout';
import HomeLayout from './components/HomeLayout';
import ProtectedRoute from './components/ProtectedRoute';
import WalletPopup from '../../components/WalletPopup';
import GweiPopup from '../../components/GweiPopup';
// import AppBanner from './components/AppBanner';

import Home from '../Home';
import Options from '../Options';
import Synths from '../Synths';

const Trade = lazy(() => import('../Trade'));
const Loans = lazy(() => import('../Loans'));
const Markets = lazy(() => import('../Markets'));
const Assets = lazy(() => import('../Assets'));

const mapStateToProps = (state: RootState) => ({
	currentTheme: getCurrentTheme(state),
	isSystemSuspended: getIsSystemSuspended(state),
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type AppProps = PropsFromRedux & {
	isAppReady: boolean;
};

const App: FC<AppProps> = ({ isAppReady, currentTheme, isSystemSuspended }) => {
	const themeStyle = isDarkTheme(currentTheme) ? darkTheme : lightTheme;

	return (
		<ThemeProvider theme={themeStyle}>
			{isSystemSuspended ? (
				<>
					<GlobalEventsGate />
					<MaintenanceMessage />
				</>
			) : (
				<>
					<Router>
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
								render={() => (
									<MainLayout isAppReady={isAppReady}>
										<Loans />
									</MainLayout>
								)}
							/>
							<ProtectedRoute
								path={ROUTES.Assets.Home}
								render={() => (
									<MainLayout isAppReady={isAppReady}>
										<Assets />
									</MainLayout>
								)}
							/>
							<Route
								path={ROUTES.Markets}
								render={() => (
									<HomeLayout>
										<Markets />
									</HomeLayout>
								)}
							/>
							<Route
								path={ROUTES.Synths.Home}
								render={() => (
									<HomeLayout>
										<Synths />
									</HomeLayout>
								)}
							/>
							<Route
								path={ROUTES.Options.Home}
								render={(routeProps) => <Options isAppReady={isAppReady} {...routeProps} />}
							/>
							<Route
								path={ROUTES.Home}
								render={() => (
									<HomeLayout>
										<Home />
									</HomeLayout>
								)}
							/>
						</Switch>
					</Router>
				</>
			)}
		</ThemeProvider>
	);
};

export default connector(App);
