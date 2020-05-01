import React, { memo, FC } from 'react';

import NewUserPromo from 'pages/shared/components/NewUserPromo';
import SynthsSection from './SynthsSection';
import Hero from './Hero';

export const Synths: FC = memo(() => (
	<>
		<Hero />
		<SynthsSection />
		<NewUserPromo />
	</>
));

export default Synths;
