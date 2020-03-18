import React, { memo } from 'react';

import Dashboard from './Dashboard';
import YourAssets from './YourAssets';

export const Overview = memo(() => (
	<>
		<Dashboard />
		<YourAssets />
	</>
));

export default Overview;
