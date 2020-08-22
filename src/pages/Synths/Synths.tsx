import React, { lazy, FC } from 'react';
import { Switch, Route } from 'react-router-dom';

import ROUTES from 'constants/routes';

const Home = lazy(() => import('./Home'));
const Overview = lazy(() => import('./Overview'));

export const Synths: FC = () => (
	<>
		<Switch>
			<Route exact path={ROUTES.Synths.OverviewMatch} component={Overview} />
			<Route component={Home} />
		</Switch>
	</>
);

export default Synths;
