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
import { getNetworkId } from 'ducks/wallet/walletDetails';

import Notify from 'bnc-notify';
import RepayLoan from './components/LoanCards/RepayLoan';

export const VIEWS = {
	LOANS: 'loan',
	LIQUIDATIONS: 'liquidations',
};

const Loans = ({ collateralPair, fetchLoansContractInfo, contractType, networkId }) => {
	const [selectedLoan, setSelectedLoan] = useState(null);
	const [selectedLiquidation, setSelectedLiquidation] = useState(null);
	const [visiblePanel, setVisiblePanel] = useState(null);
	const [view, setView] = useState(VIEWS.LOANS);
	const [notify, setNotify] = useState(null);

	useEffect(() => {
		// @TODO REPLACE KEYS
		var notify = Notify({
			dappId: '95a4ea13-9af6-4ea1-89db-a2c333236a77',
			networkId: networkId,
		});
		setNotify(notify);
	}, [networkId]);

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
						notify={notify}
						onLoanModified={clearSelectedLoan}
						type={ActionTypes.ADD}
						selectedLoan={selectedLoan}
					/>
				);
			case ActionTypes.WITHDRAW:
				return (
					<ModifyCollateral
						notify={notify}
						onLoanModified={clearSelectedLoan}
						type={ActionTypes.WITHDRAW}
						selectedLoan={selectedLoan}
					/>
				);
			case ActionTypes.REPAY:
				return (
					<RepayLoan
						notify={notify}
						onLoanModified={clearSelectedLoan}
						selectedLoan={selectedLoan}
					/>
				);
			case ActionTypes.CLOSE:
				return (
					<CloseLoanCard
						notify={notify}
						collateralPair={collateralPair}
						isInteractive={selectedLoan != null}
						selectedLoan={selectedLoan}
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
					<CreateLoanCard notify={notify} collateralPair={collateralPair} />
				) : (
					<CreateLoanCardsUSD notify={notify} collateralPair={collateralPair} />
				)}
				<SectionVerticalSpacer />
				{contractType === 'sETH' ? (
					<CloseLoanCard
						notify={notify}
						collateralPair={collateralPair}
						isInteractive={selectedLoan != null}
						selectedLoan={selectedLoan}
					/>
				) : view === VIEWS.LOANS ? (
					returnActions()
				) : (
					<LiquidateCard
						notify={notify}
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
	networkId: getNetworkId(state),
});

const mapDispatchToProps = {
	fetchLoansContractInfo,
};

export default connect(mapStateToProps, mapDispatchToProps)(Loans);
