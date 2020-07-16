import React, { FC, lazy } from 'react';
import styled from 'styled-components';
import { Switch, Route, Redirect } from 'react-router-dom';

import { ROUTES, navigateTo } from 'constants/routes';
import { CenteredPageLayout } from 'shared/commonStyles';
import AssetsNavigation from './components/AssetsNavigation';

const Overview = lazy(() => import('./Overview'));
const Exchanges = lazy(() => import('./Exchanges'));
const Options = lazy(() => import('./Options'));
const CreateMarketModal = lazy(() => import('pages/Options/CreateMarketModal'));

// import Transfers from './Transfers';

const Assets: FC = () => (
	<StyledCenteredPageLayout>
		<AssetsNavigation />
		<Content>
			<Switch>
				<Route exact={true} path={ROUTES.Assets.Overview} component={Overview} />
				<Route exact={true} path={ROUTES.Assets.Exchanges} component={Exchanges} />
				<Route exact={true} path={ROUTES.Assets.Options.Home} component={Options} />
				<Route
					exact={true}
					path={ROUTES.Assets.Options.CreateMarketModal}
					render={() => (
						<CreateMarketModal onClose={() => navigateTo(ROUTES.Assets.Options.Home)} />
					)}
				/>
				{/* Transfers page is disabled for now. */}
				{/* <Route path={ROUTES.Assets.Transfers} component={Transfers} /> */}
				<Redirect to={ROUTES.Assets.Overview} />
			</Switch>
		</Content>
	</StyledCenteredPageLayout>
);

const StyledCenteredPageLayout = styled(CenteredPageLayout)`
	padding: 0;
`;

const Content = styled.div`
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	padding: 20px;
	overflow: auto;
`;

export default Assets;
