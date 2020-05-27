import React, { memo, FC } from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './Home';
import Overview from './Overview';
import ROUTES from 'constants/routes';

export const Synths: FC = memo(() => (
	<>
		<Switch>
			<Route exact path={ROUTES.Synths.OverviewMatch} component={Overview} />
			<Route component={Home} />
		</Switch>
	</>
));

export default Synths;
