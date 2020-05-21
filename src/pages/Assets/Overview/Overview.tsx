import React, { FC, memo } from 'react';

import Dashboard from './Dashboard';
import YourSynths from './YourSynths';

export const Overview: FC = memo(() => (
	<>
		<Dashboard />
		<YourSynths />
	</>
));

export default Overview;
