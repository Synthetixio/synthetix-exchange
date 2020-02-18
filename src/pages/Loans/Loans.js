import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { CenteredPageLayout, SectionVerticalSpacer } from '../../shared/commonStyles';

import CreateLoanCard from './components/LoanCards/CreateLoanCard';
import CloseLoanCard from './components/LoanCards/CloseLoanCard';

import Dashboard from './components/Dashboard';
import MyLoans from './components/MyLoans';

const Loans = () => {
	const [selectedLoan, setSelectedLoan] = useState(null);

	const handleSelectLoan = loanInfo => setSelectedLoan(loanInfo);

	return (
		<CenteredPageLayout>
			<OverviewContainer>
				<Dashboard />
				<SectionVerticalSpacer />
				<MyLoans onSelectLoan={handleSelectLoan} selectedLoan={selectedLoan} />
			</OverviewContainer>
			<LoanCardsContainer>
				<CreateLoanCard />
				<SectionVerticalSpacer />
				<CloseLoanCard isInteractive={selectedLoan != null} selectedLoan={selectedLoan} />
			</LoanCardsContainer>
		</CenteredPageLayout>
	);
};

Loans.propTypes = {
	createLoan: PropTypes.func,
};

const OverviewContainer = styled.div`
	flex: 1;
`;

const LoanCardsContainer = styled.div`
	min-width: 389px;
	max-width: 400px;
`;

export default Loans;
