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
		all: {
			list: [],
			loading: false,
			maxBlock: Number.MAX_SAFE_INTEGER, // paging
		},
		wallet: {
			list: [],
			loading: false,
			maxBlock: Number.MAX_SAFE_INTEGER, // paging
		},
	});
	const [currentPastTransactions, setCurrentPastTransactions] = useState('wallet');

	useEffect(() => {
		const fetchTransactionResult = async () => {
			try {
				if (pendingTransactions.length === 0) return;
				const latestTransactionHash = pendingTransactions[pendingTransactions.length - 1];
				removePendingTransaction(latestTransactionHash);
				const status = await snxJSConnector.utils.waitForTransaction(latestTransactionHash);
				const matchingTransaction = transactions.find((tx) => tx.hash === latestTransactionHash);
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

	const fetchData = async () => {
		const { loading, list, maxBlock } = pastTransactions[currentPastTransactions];

		if (activeTab === 'Your orders') return;
		if (loading) return;
		setPastTransactions({
			...pastTransactions,
			[currentPastTransactions]: { ...pastTransactions[currentPastTransactions], loading: true },
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
			list.forEach((l) => {
				hashMap[l.hash] = true;
			});
			results = results.filter((r) => !hashMap[r.hash]);
			results = [...list, ...results];

			setPastTransactions({
				...pastTransactions,
				[currentPastTransactions]: { list: results, loading: false },
			});
		}
	};

	useEffect(() => {
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pastTransactions.wallet.maxBlock, pastTransactions.all.maxBlock]);

	useEffect(() => {
		const { list } = pastTransactions[currentPastTransactions];
		if (list.length > 0) return;
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeTab]);

	const onScrollPaging = () => {
		const transactions = pastTransactions[currentPastTransactions];
		const lastRow = transactions.list[transactions.list.length - 1];
		if (lastRow) {
			setPastTransactions({
				...pastTransactions,
				[currentPastTransactions]: {
					...pastTransactions[currentPastTransactions],
					maxBlock: lastRow.block,
				},
			});
		}
	};

	return (
		<Container>
			<Tabs>
				{['Your orders', 'Your trades', 'All trades'].map((tab) => {
					return (
						<Tab
							key={tab}
							isDisabled={tab === 'Your trades' && !walletInfo.currentWallet}
							onClick={() => {
								if (tab === 'Your trades' && !walletInfo.currentWallet) return;
								if (tab !== 'Your orders') {
									setCurrentPastTransactions(tab === 'Your trades' ? 'wallet' : 'all');
								}
								setActiveTab(tab);
							}}
							hidden={!tab}
							active={tab === activeTab}
						>
							<DataSmall
								style={{ whiteSpace: 'nowrap' }}
								color={tab === activeTab ? colors.fontPrimary : colors.fontTertiary}
							>
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
					pastTransactions={pastTransactions[currentPastTransactions]}
					onScrollPaging={onScrollPaging}
				/>
			</Book>
		</Container>
	);
};

const Container = styled.div`
	height: 100%;
	background-color: ${(props) => props.theme.colors.surfaceL1};
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
		&:last-child {
			margin-right: 0;
		}
	}
`;

const Tab = styled.button`
	padding: 0 18px;
	outline: none;
	border: none;
	visibility: ${(props) => (props.hidden ? 'hidden' : 'visible')};

	display: flex;
	justify-content: center;
	align-items: center;
	flex: 1;
	height: 42px;
	background-color: ${(props) =>
		props.active ? props.theme.colors.surfaceL3 : props.theme.colors.surfaceL2};
	&:hover {
		background-color: ${(props) => props.theme.colors.surfaceL3};
	}
	opacity: ${(props) => (props.isDisabled ? 0.2 : 1)};
	cursor: ${(props) => (props.isDisabled ? 'not-allowed' : 'pointer')};
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

const mapStateToProps = (state) => {
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
