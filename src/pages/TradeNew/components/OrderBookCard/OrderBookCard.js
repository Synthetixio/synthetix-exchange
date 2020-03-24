import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
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

import Card from 'src/components/Card';
import YourOrders from './YourOrders';
import Trades from './Trades';

const OrderBookCard = ({
	walletInfo: { currentWallet },
	pendingTransactions,
	transactions,
	removePendingTransaction,
	updateTransaction,
}) => {
	const { t } = useTranslation();

	const tabContent = [
		{
			name: t('trade.order-book-card.tabs.your-orders'),
			id: 'yourOrder',
			component: <YourOrders />,
		},
		{
			name: t('trade.order-book-card.tabs.your-trades'),
			id: 'yourTrades',
			component: <Trades />,
		},
		{
			name: t('trade.order-book-card.tabs.all-trades'),
			id: 'allTrades',
			component: <Trades />,
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

	return (
		<Card>
			<Card.Body style={{ padding: 0 }}>
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
				<BookContainer>{activeTab.component}</BookContainer>
			</Card.Body>
		</Card>
	);
};

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
	background-color: ${props =>
		props.active ? props.theme.colors.surfaceL3 : props.theme.colors.surfaceL2};
	opacity: ${props => (props.isDisabled ? 0.2 : 1)};
	cursor: ${props => (props.isDisabled ? 'not-allowed' : 'pointer')};
	&:hover {
		background-color: ${props => props.theme.colors.surfaceL3};
	}
`;

const BookContainer = styled.div``;

const mapStateToProps = state => {
	return {
		transactions: getTransactions(state),
		pendingTransactions: getPendingTransactions(state),
		walletInfo: getWalletInfo(state),
	};
};

const mapDispatchToProps = {
	updateTransaction,
	removePendingTransaction,
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderBookCard);
