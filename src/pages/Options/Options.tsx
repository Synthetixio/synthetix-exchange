import React, { memo, FC, lazy } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Switch, Route, RouteComponentProps, Redirect } from 'react-router-dom';

import ROUTES from 'constants/routes';

import { RootState } from 'ducks/types';
import HomeLayout from 'pages/Root/components/HomeLayout';
import MainLayout from 'pages/Root/components/MainLayout';
import { getIsLoggedIn } from 'ducks/wallet/walletDetails';

const Home = lazy(() => import('./Home'));
const CreateMarketModal = lazy(() => import('./CreateMarketModal'));
const Market = lazy(() => import('./Market'));

const mapStateToProps = (state: RootState) => ({
	isLoggedIn: getIsLoggedIn(state),
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type OptionsProps = PropsFromRedux &
	RouteComponentProps & {
		isAppReady: boolean;
	};

export const Options: FC<OptionsProps> = memo(({ isAppReady, isLoggedIn }) => (
	<Switch>
		<Route
			exact
			path={ROUTES.Options.Home}
			render={() => (
				<HomeLayout isAppReady={isAppReady}>
					<Home />
				</HomeLayout>
			)}
		/>
		<Route
			exact
			path={ROUTES.Options.CreateMarketModal}
			render={() =>
				isLoggedIn ? (
					<HomeLayout isAppReady={isAppReady}>
						<CreateMarketModal />
					</HomeLayout>
				) : (
					<Redirect to={ROUTES.Options.Home} />
				)
			}
		/>
		<Route
			exact
			path={ROUTES.Options.MarketMatch}
			render={(routeProps) => (
				<MainLayout isAppReady={isAppReady}>
					<Market {...routeProps} />
				</MainLayout>
			)}
		/>
		<Route component={Home} />
	</Switch>
));

export default connector(Options);
