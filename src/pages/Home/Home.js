import React, { memo } from 'react';

import Hero from './Hero';
import MarketsSection from 'pages/shared/components/MarketsSection';
import NewUserPromo from 'pages/shared/components/NewUserPromo';
import ExchangeFeatures from './ExchangeFeatures';

const Home = memo(() => (
	<>
		<Hero />
		<MarketsSection isOnSplashPage={true} />
		<NewUserPromo />
		<ExchangeFeatures />
	</>
));

export default Home;
