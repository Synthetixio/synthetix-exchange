import React from 'react';
import styled from 'styled-components';

import TotalBalance from './TotalBalance';
import BalanceChart from './BalanceChart';
import SynthBreakdown from './SynthBreakdown';

export const Dashboard = () => (
	<Container>
		<TotalBalance />
		<BalanceChart />
		<SynthBreakdown />
	</Container>
);

const Container = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	grid-gap: 8px;
	margin-bottom: 8px;
`;

export default Dashboard;
