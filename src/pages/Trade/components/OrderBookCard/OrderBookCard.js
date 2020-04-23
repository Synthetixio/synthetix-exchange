import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';

import { DataSmall } from 'src/components/Typography';

import { getWalletInfo } from 'src/ducks/wallet/walletDetails';

import {
	fetchAllTradesRequest,
	getAllTrades,
	getIsRefreshingAllTrades,
	getIsLoadedAllTrades,
} from 'src/ducks/trades/allTrades';
import {
	fetchMyTradesRequest,
	getMyTrades,
	getIsRefreshingMyTrades,
	getIsLoadedMyTrades,
} from 'src/ducks/trades/myTrades';

import Card from 'src/components/Card';
import MyOrders from './myOrders';
import TradeHistory from './TradeHistory';

const OrderBookCard = ({
	walletInfo: { currentWallet },
	fetchAllTradesRequest,
	fetchMyTradesRequest,
	myTrades,
	isLoadedMyTrades,
	isRefreshingMyTrades,
	allTrades,
	isLoadedAllTrades,
	isRefreshingAllTrades,
}) => {
	const { t } = useTranslation();

	const tabContent = useMemo(
		() => [
			{
				name: t('trade.order-book-card.tabs.your-orders'),
				id: 'yourOrder',
				component: <MyOrders />,
			},
			{
				name: t('trade.order-book-card.tabs.your-trades'),
				id: 'yourTrades',
				component: (
					<TradeHistory
						trades={myTrades}
						isLoading={isRefreshingMyTrades}
						isLoaded={isLoadedMyTrades}
					/>
				),
			},
			{
				name: t('trade.order-book-card.tabs.all-trades'),
				id: 'allTrades',
				component: (
					<TradeHistory
						trades={allTrades}
						isLoading={isRefreshingAllTrades}
						isLoaded={isLoadedAllTrades}
					/>
				),
			},
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[myTrades, allTrades]
	);

	const [activeTab, setActiveTab] = useState(tabContent[0]);

	useEffect(() => {
		fetchMyTradesRequest();
		fetchAllTradesRequest();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentWallet]);

	return (
		<StyledCard>
			<StyledCardBody>
				<Tabs>
					{tabContent.map((tab) => {
						return (
							<Tab
								key={tab.id}
								isDisabled={tab.id === 'yourTrades' && !currentWallet}
								onClick={() => setActiveTab(tab)}
								active={tab.id === activeTab.id}
							>
								<DataSmall>{tab.name}</DataSmall>
							</Tab>
						);
					})}
				</Tabs>
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
`;

const StyledCardBody = styled(Card.Body)`
	padding: 0;
	overflow: hidden;
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
	background: ${(props) =>
		props.active ? props.theme.colors.surfaceL3 : props.theme.colors.surfaceL2};
	&:hover {
		background: ${(props) => props.theme.colors.surfaceL3};
	}
	${(props) =>
		props.isDisabled &&
		css`
			opacity: 0.2;
			pointer-events: none;
		`}
`;

const mapStateToProps = (state) => ({
	walletInfo: getWalletInfo(state),
	allTrades: getAllTrades(state),
	isRefreshingAllTrades: getIsRefreshingAllTrades(state),
	isLoadedAllTrades: getIsLoadedAllTrades(state),
	myTrades: getMyTrades(state),
	isRefreshingMyTrades: getIsRefreshingMyTrades(state),
	isLoadedMyTrades: getIsLoadedMyTrades(state),
});

const mapDispatchToProps = {
	fetchAllTradesRequest,
	fetchMyTradesRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderBookCard);
