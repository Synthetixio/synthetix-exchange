import React, { FC, lazy } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Switch, Route, RouteComponentProps, Redirect } from 'react-router-dom';

import ROUTES from 'constants/routes';

import { RootState } from 'ducks/types';
import HomeLayout from 'pages/Root/components/HomeLayout';
import MainLayout from 'pages/Root/components/MainLayout';
import { getIsWalletConnected } from 'ducks/wallet/walletDetails';
import { Button } from 'components/Button';
import Link from 'components/Link';

const Home = lazy(() => import('./Home'));
const CreateMarketModal = lazy(() => import('./CreateMarketModal'));
const Market = lazy(() => import('./Market'));

const mapStateToProps = (state: RootState) => ({
	isWalletConnected: getIsWalletConnected(state),
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type OptionsProps = PropsFromRedux &
	RouteComponentProps & {
		isAppReady: boolean;
	};

const isPaused = false;

export const Options: FC<OptionsProps> = ({ isAppReady /*isWalletConnected*/ }) =>
	isPaused ? (
		<HomeLayout isAppReady={isAppReady}>
			<div
				style={{
					height: '600px',
					background: '#fff',
					display: 'grid',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<div style={{ textAlign: 'center' }}>
					<div style={{ paddingBottom: '17px' }}>Binary Options has been paused for upgrades.</div>
					<Link to="https://blog.synthetix.io/the-antares-release/" isExternal={true}>
						<Button palette="primary" size="md">
							read this post for info
						</Button>
					</Link>
				</div>
			</div>
		</HomeLayout>
	) : (
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
				render={
					() => (
						// isWalletConnected ? (
						<HomeLayout isAppReady={isAppReady}>
							<CreateMarketModal />
						</HomeLayout>
						// ) : (
						// <Redirect to={ROUTES.Options.Home} />
					)
					// )
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
	);

export default connector(Options);
