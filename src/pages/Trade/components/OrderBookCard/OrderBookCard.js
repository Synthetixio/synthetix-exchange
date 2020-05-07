import React, { useState, useMemo } from 'react';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';

import { getDashboardData, fetchDashboardRequest } from 'src/ducks/dashboard';
import { getAvailableSynthsMap } from 'src/ducks/synths';

import { DataSmall } from 'src/components/Typography';
import { FlexDivRow } from 'src/shared/commonStyles';

import Card from 'src/components/Card';
import MyOrders from './myOrders';
import MyTrades from './MyTrades';
import AllTrades from './AllTrades';

const OrderBookCard = () => {
	const { t } = useTranslation();

	const tabContent = useMemo(
		() => [
			{
				name: t('trade.order-book-card.tabs.your-orders'),
				id: 'myOrders',
				component: <MyOrders />,
			},
			{
				name: t('trade.order-book-card.tabs.your-trades'),
				id: 'myTrades',
				component: <MyTrades />,
			},
			{
				name: t('trade.order-book-card.tabs.all-trades'),
				id: 'allTrades',
				component: <AllTrades />,
			},
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	const [activeTab, setActiveTab] = useState(tabContent[0]);

	return (
		<StyledCard>
			<StyledCardBody>
				<FlexDivRow>
					<Tabs>
						{tabContent.map(tab => (
							<Tab key={tab.id} onClick={() => setActiveTab(tab)} active={tab.id === activeTab.id}>
								<DataSmall>{tab.name}</DataSmall>
							</Tab>
						))}
					</Tabs>
				</FlexDivRow>
				{activeTab.component}
			</StyledCardBody>
		</StyledCard>
	);
};

const StyledCard = styled(Card)`
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	position: relative;
`;

const StyledCardBody = styled(Card.Body)`
	padding: 0;
	flex-grow: 1;
	height: 100%;
	overflow: hidden;
	position: initial;
	display: flex;
	flex-direction: column;
`;

const Tabs = styled.div`
	display: flex;
`;

const Tab = styled.button`
	min-width: 134px;
	height: 42px;
	padding: 0 18px;
	display: flex;
	justify-content: center;
	align-items: center;
	outline: none;
	border: none;
	cursor: pointer;
	background: ${props =>
		props.active ? props.theme.colors.surfaceL3 : props.theme.colors.surfaceL2};
	&:hover {
		background: ${props => props.theme.colors.surfaceL3};
	}
	${props =>
		props.isDisabled &&
		css`
			opacity: 0.2;
			pointer-events: none;
		`}
`;

const mapStateToProps = state => ({
	dashboardData: getDashboardData(state),
	synthsMap: getAvailableSynthsMap(state),
});

const mapDispatchToProps = {
	fetchDashboardRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderBookCard);
