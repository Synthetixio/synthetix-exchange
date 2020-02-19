import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { CenteredPageLayout, SectionVerticalSpacer } from '../../shared/commonStyles';

import snxJSConnector from '../../utils/snxJSConnector';

import CreateLoanCard from './components/LoanCards/CreateLoanCard';
import CloseLoanCard from './components/LoanCards/CloseLoanCard';

import Dashboard from './components/Dashboard';
import MyLoans from './components/MyLoans';

import Spinner from '../../components/Spinner';

import { CRYPTO_CURRENCY_MAP, SYNTHS_MAP } from '../../constants/currency';
import { bigNumberFormatter } from '../../utils/formatters';
import { updateLoan, removeLoan, LOAN_STATUS } from '../../ducks/loans';

const Loans = ({ updateLoan, removeLoan }) => {
	const [selectedLoan, setSelectedLoan] = useState(null);
	const [collateralPair, setCollateralPair] = useState(null);
	const [initialized, setInitialized] = useState(false);

	const handleSelectLoan = loanInfo => setSelectedLoan(loanInfo);
	const clearSelectedLoan = () => {
		setSelectedLoan(null);
	};

	useEffect(() => {
		const init = async () => {
			if (snxJSConnector.initialized) {
				const {
					snxJS: { EtherCollateral },
				} = snxJSConnector;

				const contractInfo = await EtherCollateral.getContractInfo();

				EtherCollateral.contract.on('LoanCreated', (_account, loanID, _amount, tx) => {
					updateLoan({
						transactionHash: tx.transactionHash,
						loanInfo: {
							loanID: Number(loanID),
							status: LOAN_STATUS.OPEN,
						},
					});
				});

				EtherCollateral.contract.on('LoanClosed', (_, loanID) => {
					removeLoan({ loanID: Number(loanID) });
				});

				setCollateralPair({
					collateralCurrencyKey: CRYPTO_CURRENCY_MAP.ETH,
					loanCurrencyKey: SYNTHS_MAP.sETH,
					minLoanSize: bigNumberFormatter(contractInfo._minLoanSize),
					issuanceRatio: 100 / bigNumberFormatter(contractInfo._collateralizationRatio),
					issueFeeRatePercent: bigNumberFormatter(contractInfo._issueFeeRate),
					collateralizationRatioPercent:
						bigNumberFormatter(contractInfo._collateralizationRatio) / 100,
					interestRatePercent: bigNumberFormatter(contractInfo._interestRate),
					totalOpenLoanCount: Number(contractInfo._totalOpenLoanCount),
					issueLimit: bigNumberFormatter(contractInfo._issueLimit),
					totalIssuedSynths: bigNumberFormatter(contractInfo._totalIssuedSynths),
				});
				setInitialized(true);
			}
		};
		init();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [snxJSConnector.initialized]);

	if (!initialized || collateralPair == null) {
		return <Spinner fullscreen={true} size="sm" />;
	}

	return (
		<CenteredPageLayout>
			<OverviewContainer>
				<Dashboard collateralPair={collateralPair} />
				<SectionVerticalSpacer />
				<MyLoans
					onSelectLoan={handleSelectLoan}
					selectedLoan={selectedLoan}
					collateralPair={collateralPair}
				/>
			</OverviewContainer>
			<LoanCardsContainer>
				<CreateLoanCard collateralPair={collateralPair} />
				<SectionVerticalSpacer />
				<CloseLoanCard
					collateralPair={collateralPair}
					isInteractive={selectedLoan != null}
					selectedLoan={selectedLoan}
					onLoanClosed={clearSelectedLoan}
				/>
			</LoanCardsContainer>
		</CenteredPageLayout>
	);
};

Loans.propTypes = {
	removeLoan: PropTypes.func,
	updateLoan: PropTypes.func,
};

const OverviewContainer = styled.div`
	flex: 1;
`;

const LoanCardsContainer = styled.div`
	min-width: 389px;
	max-width: 400px;
`;

const mapDispatchToProps = {
	updateLoan,
	removeLoan,
};

export default connect(null, mapDispatchToProps)(Loans);
