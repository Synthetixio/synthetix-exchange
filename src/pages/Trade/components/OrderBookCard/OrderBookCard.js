import React, { memo, useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';

import snxJSConnector from 'utils/snxJSConnector';
import { TRANSACTION_STATUS } from 'constants/transaction';

import { DataSmall } from 'components/Typography';

import {
	getPendingTransactions,
	getTransactions,
	removePendingTransaction,
	updateTransaction,
} from 'ducks/transaction';
import { getWalletInfo } from 'ducks/wallet/walletDetails';

import Card from 'components/Card';
import MyOrders from './myOrders';
import AllTrades from './AllTrades';
import MyTrades from './MyTrades';

const OrderBookCard = memo(
	({
		walletInfo: { currentWallet },
		pendingTransactions,
		transactions,
		removePendingTransaction,
		updateTransaction,
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
					const matchingTransaction = transactions.find((tx) => tx.hash === latestTransactionHash);
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
			<StyledCard>
				<StyledCardBody>
					<Tabs>
						{tabContent.map((tab) => (
							<Tab
								key={tab.id}
								isDisabled={tab.id === 'yourTrades' && !currentWallet}
								onClick={() => setActiveTab(tab)}
								active={tab.id === activeTab.id}
							>
								<DataSmall>{tab.name}</DataSmall>
							</Tab>
						))}
					</Tabs>
					{activeTab.component}
				</StyledCardBody>
			</StyledCard>
		);
	}
);

const StyledCard = styled(Card)`
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	position: relative;
`;

const StyledCardBody = styled(Card.Body)`
	padding: 0;
	overflow: hidden;
	position: initial;
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
	background-color: ${(props) =>
		props.active ? props.theme.colors.surfaceL3 : props.theme.colors.surfaceL2};
	&:hover {
		background-color: ${(props) => props.theme.colors.surfaceL3};
	}
	${(props) =>
		props.isDisabled &&
		css`
			opacity: 0.2;
			pointer-events: none;
		`}
`;

const mapStateToProps = (state) => ({
	transactions: getTransactions(state),
	pendingTransactions: getPendingTransactions(state),
	walletInfo: getWalletInfo(state),
});

const mapDispatchToProps = {
	updateTransaction,
	removePendingTransaction,
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderBookCard);
