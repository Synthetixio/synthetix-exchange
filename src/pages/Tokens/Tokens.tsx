import React, { memo, FC } from 'react';

import NewUserPromo from 'pages/shared/components/NewUserPromo';
import TokensSection from './TokensSection';

export const Tokens: FC = memo(() => (
	<>
		<TokensSection />
		<NewUserPromo />
	</>
));

export default Tokens;
