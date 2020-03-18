import React, { memo } from 'react';

import Dashboard from './Dashboard';
import YourSynths from './YourSynths';

export const Overview = memo(() => (
	<>
		<Dashboard />
		<YourSynths />
	</>
));

export default Overview;
