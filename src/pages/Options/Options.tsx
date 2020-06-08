import React, { memo, FC } from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './Home';
import Market from './Market';
import CreateMarketModal from './CreateMarketModal';
import ROUTES from 'constants/routes';

export const Options: FC = memo(() => (
	<Switch>
		<Route exact path={ROUTES.Options.Home} component={Home} />
		<Route exact path={ROUTES.Options.CreateMarketModal} component={CreateMarketModal} />
		<Route exact path={ROUTES.Options.MarketMatch} component={Market} />
		<Route component={Home} />
	</Switch>
));

export default Options;
