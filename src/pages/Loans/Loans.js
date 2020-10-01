import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { CenteredPageLayout, SectionVerticalSpacer } from '../../shared/commonStyles';

import CreateLoanCard from './components/LoanCards/CreateLoanCard/CreateLoanCard';
import CreateLoanCardsUSD from './components/LoanCards/CreateLoanCard/CreateLoanCardsUSD';

import CloseLoanCard from './components/LoanCards/CloseLoanCard';

import Dashboard from './components/Dashboard';
import MyLoans from './components/MyLoans';

import Spinner from '../../components/Spinner';

import {
	fetchLoansContractInfo,
	getContractType,
	getLoansCollateralPair,
} from '../../ducks/loans/contractInfo';
import Actions, { ActionTypes } from './components/Actions';
import ModifyCollateral from './components/LoanCards/ModifyCollateral';
import LiquidateCard from './components/LiquidateCard';

export const VIEWS = {
	LOANS: 'loan',
	LIQUIDATIONS: 'liquidations',
};

const Loans = ({ collateralPair, fetchLoansContractInfo, contractType }) => {
	const [selectedLoan, setSelectedLoan] = useState(null);
	const [selectedLiquidation, setSelectedLiquidation] = useState(null);
	const [visiblePanel, setVisiblePanel] = useState(null);
	const [view, setView] = useState(VIEWS.LOANS);

	const handleSelectLoan = (loanInfo) => setSelectedLoan(loanInfo);
	const handleSelectLiquidation = (liquidationInfo) => setSelectedLiquidation(liquidationInfo);

	const clearSelectedLoan = () => {
		setVisiblePanel(null);
	};

	useEffect(() => {
		fetchLoansContractInfo();
		setSelectedLoan(null);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [contractType]);

	useEffect(() => {
		setVisiblePanel(null);
	}, [selectedLoan]);

	useEffect(() => {
		setVisiblePanel(null);
		setSelectedLoan(null);
	}, [view]);

	if (collateralPair == null) {
		return <Spinner centered={true} size="sm" />;
	}

	const onActionPress = (tab) => {
		switch (tab) {
			case ActionTypes.ADD:
				setVisiblePanel(ActionTypes.ADD);
				break;
			case ActionTypes.WITHDRAW:
				setVisiblePanel(ActionTypes.WITHDRAW);
				break;
			case ActionTypes.REPAY:
				setVisiblePanel(ActionTypes.REPAY);
				break;
			case ActionTypes.CLOSE:
				setVisiblePanel(ActionTypes.CLOSE);
				break;
			default:
				setVisiblePanel(null);
				break;
		}
	};

	const returnActions = () => {
		switch (visiblePanel) {
			case null:
				return <Actions onActionPress={onActionPress} isInteractive={selectedLoan != null} />;
			case ActionTypes.ADD:
				return (
					<ModifyCollateral
						onLoanModified={clearSelectedLoan}
						type={ActionTypes.ADD}
						selectedLoan={selectedLoan}
					/>
				);
			case ActionTypes.WITHDRAW:
				return (
					<ModifyCollateral
						onLoanModified={clearSelectedLoan}
						type={ActionTypes.WITHDRAW}
						selectedLoan={selectedLoan}
					/>
				);
			case ActionTypes.REPAY:
				return <></>;
			case ActionTypes.CLOSE:
				return (
					<CloseLoanCard
						collateralPair={collateralPair}
						isInteractive={selectedLoan != null}
						selectedLoan={selectedLoan}
						onLoanClosed={clearSelectedLoan}
					/>
				);
			default:
				return <Actions onActionPress={onActionPress} isInteractive={selectedLoan != null} />;
		}
	};

	return (
		<CenteredPageLayout>
			<OverviewContainer>
				<Dashboard collateralPair={collateralPair} />
				<SectionVerticalSpacer />
				<MyLoans
					onSelectLoan={handleSelectLoan}
					selectedLoan={selectedLoan}
					onSelectLiquidation={handleSelectLiquidation}
					selectedLiquidation={selectedLiquidation}
					setVisiblePanel={setVisiblePanel}
					setView={setView}
				/>
			</OverviewContainer>
			<LoanCardsContainer>
				{contractType === 'sETH' ? (
					<CreateLoanCard collateralPair={collateralPair} />
				) : (
					<CreateLoanCardsUSD collateralPair={collateralPair} />
				)}
				<SectionVerticalSpacer />
				{contractType === 'sETH' ? (
					<CloseLoanCard
						collateralPair={collateralPair}
						isInteractive={selectedLoan != null}
						selectedLoan={selectedLoan}
						onLoanClosed={clearSelectedLoan}
					/>
				) : view === VIEWS.LOANS ? (
					returnActions()
				) : (
					<LiquidateCard
						isInteractive={selectedLiquidation != null}
						selectedLiquidation={selectedLiquidation}
					/>
				)}
			</LoanCardsContainer>
		</CenteredPageLayout>
	);
};

Loans.propTypes = {
	updateLoan: PropTypes.func,
	fetchLoansContractInfo: PropTypes.func,
	collateralPair: PropTypes.object,
	contractType: PropTypes.string,
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

const mapStateToProps = (state) => ({
	collateralPair: getLoansCollateralPair(state),
	contractType: getContractType(state),
});

const mapDispatchToProps = {
	fetchLoansContractInfo,
};

export default connect(mapStateToProps, mapDispatchToProps)(Loans);
