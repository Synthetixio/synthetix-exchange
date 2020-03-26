import React, { memo } from 'react';

import Hero from './Hero';
import MarketsSection from 'src/pages/shared/components/MarketsSection';
import NewUserPromo from 'src/pages/shared/components/NewUserPromo';
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
