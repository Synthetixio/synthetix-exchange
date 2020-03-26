import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';

import snxJSConnector from 'src/utils/snxJSConnector';
import { TRANSACTION_STATUS } from 'src/constants/transaction';

import { DataSmall } from 'src/components/Typography';

import {
	getPendingTransactions,
	getTransactions,
	removePendingTransaction,
	updateTransaction,
} from 'src/ducks/transaction';
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
	pendingTransactions,
	transactions,
	removePendingTransaction,
	updateTransaction,
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

	const tabContent = [
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
	];
	const [activeTab, setActiveTab] = useState(tabContent[0]);

	// TODO: Move this logic into Redux
	useEffect(() => {
		const handlePendingTransactions = async () => {
			const {
				utils: { waitForTransaction },
			} = snxJSConnector;
			try {
				if (pendingTransactions.length === 0) return;
				const latestTransactionHash = pendingTransactions[pendingTransactions.length - 1];
				removePendingTransaction(latestTransactionHash);
				const status = await waitForTransaction(latestTransactionHash);
				const matchingTransaction = transactions.find(tx => tx.hash === latestTransactionHash);
				if (status) {
					updateTransaction({ status: TRANSACTION_STATUS.CONFIRMED }, matchingTransaction.id);
				} else {
					updateTransaction(
						{ status: TRANSACTION_STATUS.FAILED, error: 'Transaction failed' },
						matchingTransaction.id
					);
				}
			} catch (e) {
				console.log(e);
			}
		};
		handlePendingTransactions();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pendingTransactions.length]);

	useEffect(() => {
		fetchMyTradesRequest();
		fetchAllTradesRequest();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentWallet]);

	return (
		<StyledCard>
			<Card.Body style={{ padding: 0, overflow: 'hidden' }}>
				<Tabs>
					{tabContent.map(tab => {
						return (
							<Tab
								key={`tab-${tab.id}`}
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
			</Card.Body>
		</StyledCard>
	);
};

const StyledCard = styled(Card)`
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	overflow: hidden;
`;

const Tabs = styled.div`
	display: flex;
`;

const isDisabled = css`
	opacity: 0.2;
	pointer-events: none;
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
	background-color: ${props =>
		props.active ? props.theme.colors.surfaceL3 : props.theme.colors.surfaceL2};
	&:hover {
		background-color: ${props => props.theme.colors.surfaceL3};
	}
	${props => props.isDisabled && isDisabled}
`;

const mapStateToProps = state => {
	return {
		transactions: getTransactions(state),
		pendingTransactions: getPendingTransactions(state),
		walletInfo: getWalletInfo(state),
		allTrades: getAllTrades(state),
		isRefreshingAllTrades: getIsRefreshingAllTrades(state),
		isLoadedAllTrades: getIsLoadedAllTrades(state),
		myTrades: getMyTrades(state),
		isRefreshingMyTrades: getIsRefreshingMyTrades(state),
		isLoadedMyTrades: getIsLoadedMyTrades(state),
	};
};

const mapDispatchToProps = {
	updateTransaction,
	removePendingTransaction,
	fetchAllTradesRequest,
	fetchMyTradesRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderBookCard);
