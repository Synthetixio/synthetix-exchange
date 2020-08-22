import React, { FC, useState, useEffect, useMemo } from 'react';
import { connect, ConnectedProps } from 'react-redux';
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
import { getIsWalletConnected } from 'ducks/wallet/walletDetails';

import Card from 'components/Card';

import MyOrders from './myOrders';
import AllTrades from './AllTrades';
import MyTrades from './MyTrades';
import { RootState } from 'ducks/types';

const mapStateToProps = (state: RootState) => ({
	transactions: getTransactions(state),
	pendingTransactions: getPendingTransactions(state),
	isWalletConnected: getIsWalletConnected(state),
});

const mapDispatchToProps = {
	updateTransaction,
	removePendingTransaction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type OrderBookCardProps = PropsFromRedux;

const OrderBookCard: FC<OrderBookCardProps> = ({
	isWalletConnected,
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
				// @ts-ignore
				component: <MyOrders />,
				isDisabled: false,
			},
			{
				name: t('trade.order-book-card.tabs.your-trades'),
				id: 'yourTrades',
				component: <MyTrades />,
				isDisabled: !isWalletConnected,
			},
			{
				name: t('trade.order-book-card.tabs.all-trades'),
				id: 'allTrades',
				component: <AllTrades />,
				isDisabled: false,
			},
		],
		[t, isWalletConnected]
	);

	const [activeTab, setActiveTab] = useState(tabContent[0]);

	// TODO: Move this logic into Redux
	useEffect(() => {
		const handlePendingTransactions = async () => {
			const {
				// @ts-ignore
				utils: { waitForTransaction },
			} = snxJSConnector;
			try {
				if (pendingTransactions.length === 0) return;
				const latestTransactionHash = pendingTransactions[pendingTransactions.length - 1];
				removePendingTransaction(latestTransactionHash);
				const status = await waitForTransaction(latestTransactionHash);
				// @ts-ignore
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
							isDisabled={tab.isDisabled}
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
	overflow: hidden;
	position: initial;
	display: flex;
	flex-direction: column;
`;

const Tabs = styled.div`
	display: flex;
`;

const Tab = styled.button<{ isDisabled: boolean; active: boolean }>`
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

export default connector(OrderBookCard);
