import React, { memo, FC } from 'react';

import NewUserPromo from 'pages/shared/components/NewUserPromo';
import TokensSection from './TokensSection';
import Hero from './Hero';

export const Tokens: FC = memo(() => (
	<>
		<Hero />
		<TokensSection />
		<NewUserPromo />
	</>
));

export default Tokens;
