import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import snxData from 'synthetix-data';
import styled, { withTheme } from 'styled-components';

import { DataSmall } from '../Typography';
import CurrentOrders from './CurrentOrders';

import { getTransactions, getPendingTransactions, getWalletInfo } from '../../ducks/';
import { updateTransaction, removePendingTransaction } from '../../ducks/transaction';

import snxJSConnector from '../../utils/snxJSConnector';
import PastTransactions from './PastTransactions';

const BookContent = ({ tab, transactions, pastTransactions, onScrollPaging }) => {
	switch (tab) {
		case 'Your orders':
			return <CurrentOrders transactions={transactions} />;
		case 'Your trades':
		case 'All trades':
			return <PastTransactions transactions={pastTransactions} onScrollPaging={onScrollPaging} />;
	}
};

const OrderBook = ({
	theme: { colors },
	transactions,
	pendingTransactions,
	updateTransaction,
	removePendingTransaction,
	walletInfo,
}) => {
	const [activeTab, setActiveTab] = useState('Your orders');
	const [pastTransactions, setPastTransactions] = useState({
		list: [],
		loading: false,
		maxBlock: Number.MAX_SAFE_INTEGER, // paging
	});

	useEffect(() => {
		const fetchTransactionResult = async () => {
			try {
				if (pendingTransactions.length === 0) return;
				const latestTransactionHash = pendingTransactions[pendingTransactions.length - 1];
				removePendingTransaction(latestTransactionHash);
				const status = await snxJSConnector.utils.waitForTransaction(latestTransactionHash);
				const matchingTransaction = transactions.find(tx => tx.hash === latestTransactionHash);
				if (status) {
					updateTransaction({ status: 'Confirmed' }, matchingTransaction.id);
				} else {
					updateTransaction(
						{ status: 'Failed', error: 'Transaction failed' },
						matchingTransaction.id
					);
				}
			} catch (e) {
				console.log(e);
			}
		};
		fetchTransactionResult();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pendingTransactions.length]);

	useEffect(() => {
		const fetchData = async () => {
			const { loading, list, maxBlock } = pastTransactions;

			if (activeTab === 'Your orders') return;
			if (loading) return;
			setPastTransactions({
				...pastTransactions,
				loading: true,
			});

			let results;
			if (activeTab === 'Your trades') {
				const { currentWallet } = walletInfo;
				results = await snxData.exchanges.since({
					fromAddress: currentWallet,
					maxBlock: maxBlock,
					max: 100,
				});
			} else if (activeTab === 'All trades') {
				results = await snxData.exchanges.since({
					maxBlock: maxBlock,
					max: 100,
				});
			}

			if (results && results.length) {
				const hashMap = {};
				list.forEach(l => {
					hashMap[l.hash] = true;
				});
				results = results.filter(r => !hashMap[r.hash]);
				results = [...list, ...results];

				setPastTransactions({ ...pastTransactions, list: results, loading: false });
			}
		};

		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pastTransactions.maxBlock, activeTab]);

	const onScrollPaging = () => {
		const lastRow = pastTransactions.list[pastTransactions.list.length - 1];
		if (lastRow) {
			setPastTransactions({
				...pastTransactions,
				maxBlock: lastRow.block,
			});
		}
	};

	return (
		<Container>
			<Tabs>
				{['Your orders', 'Your trades', 'All trades'].map(tab => {
					return (
						<Tab
							key={tab}
							isDisabled={tab === 'Your trades' && !walletInfo.currentWallet}
							onClick={() => {
								if (tab === 'Your trades' && !walletInfo.currentWallet) return;
								if (tab !== 'Your orders') {
									setPastTransactions({
										list: [],
										maxBlock: Number.MAX_SAFE_INTEGER,
									});
								}
								setActiveTab(tab);
							}}
							hidden={!tab}
							active={tab === activeTab}
						>
							<DataSmall color={tab === activeTab ? colors.fontPrimary : colors.fontTertiary}>
								{tab}
							</DataSmall>
						</Tab>
					);
				})}
			</Tabs>
			<Book>
				<BookContent
					tab={activeTab}
					transactions={transactions}
					pastTransactions={pastTransactions}
					onScrollPaging={onScrollPaging}
				/>
			</Book>
		</Container>
	);
};

const Container = styled.div`
	height: 100%;
	background-color: ${props => props.theme.colors.surfaceL1};
	display: flex;
	flex-direction: column;
`;

const Tabs = styled.div`
	display: flex;
	& > * {
		margin: 0 4px;
		&:first-child {
			margin-left: 0;
		}
	}
`;

const Tab = styled.button`
	padding: 0 18px;
	outline: none;
	border: none;
	visibility: ${props => (props.hidden ? 'hidden' : 'visible')};

	display: flex;
	justify-content: center;
	align-items: center;
	flex: 1;
	height: 42px;
	background-color: ${props =>
		props.active ? props.theme.colors.surfaceL3 : props.theme.colors.surfaceL2};
	&:hover {
		background-color: ${props => props.theme.colors.surfaceL3};
	}
	opacity: ${props => (props.isDisabled ? 0.2 : 1)};
	cursor: ${props => (props.isDisabled ? 'not-allowed' : 'pointer')};
`;

const Book = styled.div`
	height: 100%;
	min-height: 0;
	position: relative;
`;

// const SortIcon = styled.img`
// 	width: 6.5px;
// 	height: 8px;
// 	margin-left: 5px;
// `;

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

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(OrderBook));
