import React, { memo } from 'react';
import styled from 'styled-components';

import TotalBalance from './TotalBalance';
import BalanceChart from './BalanceChart';
import SynthBreakdown from './SynthBreakdown';

export const Dashboard = memo(() => (
	<Container>
		<TotalBalance />
		<BalanceChart />
		<SynthBreakdown />
	</Container>
));

const Container = styled.div`
	display: grid;
	grid-template-columns: auto auto auto;
	grid-gap: 8px;
	margin-bottom: 8px;
`;

export default Dashboard;
