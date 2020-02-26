import React, { useState, useEffect, useCallback } from 'react';
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
import { LOAN_EVENTS } from '../../constants/events';
import { bigNumberFormatter } from '../../utils/formatters';

import { updateLoan, LOAN_STATUS } from '../../ducks/loans';
import { fetchWalletBalances } from '../../ducks/wallet';

const Loans = ({ updateLoan, fetchWalletBalances }) => {
	const [selectedLoan, setSelectedLoan] = useState(null);
	const [collateralPair, setCollateralPair] = useState(null);
	const [initialized, setInitialized] = useState(false);

	const handleSelectLoan = loanInfo => setSelectedLoan(loanInfo);
	const clearSelectedLoan = () => {
		setSelectedLoan(null);
	};
	const fetchContractData = useCallback(async () => {
		const {
			snxJS: { EtherCollateral },
		} = snxJSConnector;

		const [contractInfo, lockedETHBalance] = await Promise.all([
			EtherCollateral.getContractInfo(),
			snxJSConnector.provider.getBalance(snxJSConnector.snxJS.EtherCollateral.contract.address),
		]);

		setCollateralPair({
			collateralCurrencyKey: CRYPTO_CURRENCY_MAP.ETH,
			loanCurrencyKey: SYNTHS_MAP.sETH,
			minLoanSize: bigNumberFormatter(contractInfo._minLoanSize),
			issuanceRatio: 100 / bigNumberFormatter(contractInfo._collateralizationRatio),
			issueFeeRatePercent: bigNumberFormatter(contractInfo._issueFeeRate),
			collateralizationRatioPercent: bigNumberFormatter(contractInfo._collateralizationRatio) / 100,
			interestRatePercent: bigNumberFormatter(contractInfo._interestRate),
			totalOpenLoanCount: Number(contractInfo._totalOpenLoanCount),
			issueLimit: bigNumberFormatter(contractInfo._issueLimit),
			totalIssuedSynths: bigNumberFormatter(contractInfo._totalIssuedSynths),
			lockedCollateralAmount: bigNumberFormatter(lockedETHBalance),
		});
		setInitialized(true);
	}, []);

	useEffect(() => {
		fetchContractData();
	}, [fetchContractData]);

	useEffect(() => {
		const {
			snxJS: { EtherCollateral },
		} = snxJSConnector;

		EtherCollateral.contract.on(LOAN_EVENTS.LOAN_CREATED, (_account, loanID, _amount, tx) => {
			fetchContractData();
			fetchWalletBalances();
			updateLoan({
				transactionHash: tx.transactionHash,
				loanInfo: {
					loanID: Number(loanID),
					status: LOAN_STATUS.OPEN,
				},
			});
		});

		EtherCollateral.contract.on(LOAN_EVENTS.LOAN_CLOSED, (_, loanID) => {
			fetchContractData();
			fetchWalletBalances();
			updateLoan({
				loanID: Number(loanID),
				loanInfo: {
					status: LOAN_STATUS.CLOSED,
				},
			});
		});

		return () => {
			Object.values(LOAN_EVENTS).forEach(event =>
				EtherCollateral.contract.removeAllListeners(event)
			);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
	updateLoan: PropTypes.func,
};

const OverviewContainer = styled.div`
	flex: 1;
	overflow-x: auto;
	display: flex;
	flex-direction: column;
`;

const LoanCardsContainer = styled.div`
	min-width: 389px;
	max-width: 400px;
`;

const mapDispatchToProps = {
	updateLoan,
	fetchWalletBalances,
};

export default connect(null, mapDispatchToProps)(Loans);
