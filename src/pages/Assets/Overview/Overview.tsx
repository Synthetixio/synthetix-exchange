import React, { FC } from 'react';

import Dashboard from './Dashboard';
import YourSynths from './YourSynths';

export const Overview: FC = () => (
	<>
		<Dashboard />
		<YourSynths />
	</>
);

export default Overview;
