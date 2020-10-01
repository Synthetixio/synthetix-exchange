import React, { useState } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Card from 'components/Card';
import { Button } from 'components/Button';
import { HeadingSmall } from 'components/Typography';
import Spinner from 'components/Spinner';

import { getIsRefreshingMyLoans } from 'ducks/loans/myLoans';

import { getContractType } from 'ducks/loans/contractInfo';
import Loans from './Loans';
import Liquidations from './Liquidations';
import { VIEWS } from 'pages/Loans/Loans';

export const MyLoans = ({
	isRefreshingMyLoans,
	contractType,
	setVisiblePanel,
	selectedLoan,
	onSelectLoan,
	onSelectLiquidation,
	selectedLiquidation,
	setView,
}) => {
	const { t } = useTranslation();
	const [activeTab, setActiveTab] = useState(0);
	return (
		<StyledCard>
			<Card.Header>
				<StyledButton
					isActive={activeTab === 0}
					size="sm"
					palette="tab"
					onClick={() => {
						setActiveTab(0);
						setView(VIEWS.LOANS);
					}}
				>
					<HeadingSmall>{t('loans.my-loans.title')}</HeadingSmall>
				</StyledButton>
				{contractType === 'sUSD' && (
					<StyledButton
						isActive={activeTab === 1}
						size="sm"
						palette="tab"
						onClick={() => {
							setActiveTab(1);
							setView(VIEWS.LIQUIDATIONS);
						}}
					>
						<HeadingSmall>{t('loans.liquidations.title')}</HeadingSmall>
					</StyledButton>
				)}
				{isRefreshingMyLoans && <Spinner size="sm" />}
			</Card.Header>
			<StyledCardBody>
				{activeTab === 0 ? (
					<Loans
						setVisiblePanel={setVisiblePanel}
						selectedLoan={selectedLoan}
						onSelectLoan={onSelectLoan}
					/>
				) : (
					<Liquidations
						setView={setView}
						selectedLiquidation={selectedLiquidation}
						onSelectLiquidation={onSelectLiquidation}
					/>
				)}
			</StyledCardBody>
		</StyledCard>
	);
};

const StyledCard = styled(Card)`
	flex-grow: 1;
	display: flex;
	flex-direction: column;
`;

const StyledCardBody = styled(Card.Body)`
	padding: 0;
	flex-grow: 1;
`;

const StyledButton = styled(Button)`
	color: ${(props) => (props.isActive ? 'white' : props.theme.colors.secondary)};
	margin: 0;
	height: 100%;
`;

const mapStateToProps = (state) => ({
	isRefreshingMyLoans: getIsRefreshingMyLoans(state),
	contractType: getContractType(state),
});

export default connect(mapStateToProps, null)(MyLoans);
