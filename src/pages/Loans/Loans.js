import React from 'react';
import styled from 'styled-components';

import { CenteredPageLayout, SectionVerticalSpacer } from '../../shared/commonStyles';

import LoanCard from './components/LoanCard';
import Dashboard from './components/Dashboard';

const Loans = () => (
	<CenteredPageLayout>
		<OverviewContainer>
			<Dashboard />
		</OverviewContainer>
		<LoanCardsContainer>
			<LoanCard type="create" isInteractive={true} />
			<SectionVerticalSpacer />
			<LoanCard type="close" isInteractive={false} />
		</LoanCardsContainer>
	</CenteredPageLayout>
);

const OverviewContainer = styled.div`
	flex: 1;
`;

const LoanCardsContainer = styled.div`
	min-width: 389px;
	max-width: 400px;
`;

export default Loans;
