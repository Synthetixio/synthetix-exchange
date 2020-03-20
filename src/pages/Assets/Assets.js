import React, { memo } from 'react';
import styled from 'styled-components';
import { Switch, Route, Redirect } from 'react-router-dom';

import { ROUTES } from 'src/constants/routes';
import { CenteredPageLayout } from 'src/shared/commonStyles';
import AssetsNavigation from './components/AssetsNavigation';

import Overview from './Overview';
import Exchanges from './Exchanges';
import Transfers from './Transfers';

const Assets = memo(() => (
	<CenteredPageLayout>
		<AssetsNavigation />
		<Content>
			<Switch>
				<Route path={ROUTES.Assets.Overview} component={Overview} />
				<Route path={ROUTES.Assets.Exchanges} component={Exchanges} />
				{/* Transfers page is disabled for now. */}
				{/* <Route path={ROUTES.Assets.Transfers} component={Transfers} /> */}
				<Redirect to={ROUTES.Assets.Overview} />
			</Switch>
		</Content>
	</CenteredPageLayout>
));

const Content = styled.div`
	flex-grow: 1;
	display: flex;
	flex-direction: column;
`;

export default Assets;
