import React, { useState } from 'react';
import styled from 'styled-components';

import { CenteredPageLayout, SectionVerticalSpacer } from '../../shared/commonStyles';

import LoanCard from './components/LoanCard';
import Dashboard from './components/Dashboard';
import MyLoans from './components/MyLoans';

const Loans = () => {
	const [selectedLoan, setSelectedLoan] = useState(null);

	const handleCloseLoan = loanInfo => setSelectedLoan(loanInfo);

	return (
		<CenteredPageLayout>
			<OverviewContainer>
				<Dashboard />
				<SectionVerticalSpacer />
				<MyLoans onSelectLoan={handleCloseLoan} selectedLoan={selectedLoan} />
			</OverviewContainer>
			<LoanCardsContainer>
				<LoanCard type="create" isInteractive={true} />
				<SectionVerticalSpacer />
				<LoanCard type="close" isInteractive={selectedLoan != null} selectedLoan={selectedLoan} />
			</LoanCardsContainer>
		</CenteredPageLayout>
	);
};

const OverviewContainer = styled.div`
	flex: 1;
`;

const LoanCardsContainer = styled.div`
	min-width: 389px;
	max-width: 400px;
`;

export default Loans;
