import React, { FC, lazy } from 'react';
import { ThemeProvider } from 'styled-components';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';

import { ROUTES } from 'constants/routes';

import { getCurrentTheme } from 'ducks/ui';
import { getIsSystemSuspended } from 'ducks/app';
import { RootState } from 'ducks/types';

import { isDarkTheme, lightTheme, darkTheme } from 'styles/theme';

import MaterialUIThemeProvider from './components/MaterialUIThemeProvider';
import MaintenanceMessage from './components/MaintenanceMessage';
import MainLayout from './components/MainLayout';
import WalletPopup from '../../components/WalletPopup';
import AppBanner from './components/AppBanner';

const Futures = lazy(() => import('../Futures'));

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
			<MaterialUIThemeProvider>
				{isSystemSuspended ? (
					<>
						<MaintenanceMessage />
					</>
				) : (
					<>
						<Router>
							<AppBanner />
							{isAppReady && (
								<>
									<WalletPopup />
								</>
							)}
							<Switch>
								<Route
									path={ROUTES.FuturesMatch}
									render={(routeProps) => (
										<MainLayout isAppReady={isAppReady}>
											<Futures {...routeProps} />
										</MainLayout>
									)}
								/>
								<Route
									path={ROUTES.Futures}
									render={(routeProps) => (
										<MainLayout isAppReady={isAppReady}>
											<Futures {...routeProps} />
										</MainLayout>
									)}
								/>
							</Switch>
						</Router>
					</>
				)}
			</MaterialUIThemeProvider>
		</ThemeProvider>
	);
};

export default connector(App);
