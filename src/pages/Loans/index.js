import React from 'react';
import { LoanProvider } from './contexts/LoanContext';
import Loans from './Loans';

const LoanWrapper = () => (
	<LoanProvider>
		<Loans />
	</LoanProvider>
);

export default LoanWrapper;
