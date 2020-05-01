import React, { useState, memo, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';

import { DataSmall } from 'src/components/Typography';

import Card from 'src/components/Card';
import MyOrders from './myOrders';
import MyTrades from './MyTrades';
import AllTrades from './AllTrades';

const OrderBookCard = memo(() => {
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
				<Tabs>
					{tabContent.map(tab => (
						<Tab key={tab.id} onClick={() => setActiveTab(tab)} active={tab.id === activeTab.id}>
							<DataSmall>{tab.name}</DataSmall>
						</Tab>
					))}
				</Tabs>
				{activeTab.component}
			</StyledCardBody>
		</StyledCard>
	);
});

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

export default OrderBookCard;
