import React, { memo, FC, lazy } from 'react';
import { Switch, Route, RouteComponentProps, Redirect } from 'react-router-dom';

import ROUTES from 'constants/routes';

import HomeLayout from 'pages/Root/components/HomeLayout';
import MainLayout from 'pages/Root/components/MainLayout';

const Home = lazy(() => import('./Home'));
const CreateMarketModal = lazy(() => import('./CreateMarketModal'));
const Market = lazy(() => import('./Market'));

type OptionsProps = RouteComponentProps & {
	isAppReady: boolean;
	isLoggedIn: boolean;
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
					<Redirect to={{ pathname: ROUTES.Options.Home }} />
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

export default Options;
