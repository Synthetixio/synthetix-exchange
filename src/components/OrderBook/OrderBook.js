import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import styled, { withTheme } from 'styled-components';
import { format } from 'date-fns';

import { DataSmall } from '../Typography';
import { Table, Tr, Thead, Tbody, Th, Td, DataLabel } from '../Table';

import { getTransactions, getPendingTransactions, getWalletInfo } from '../../ducks/';
import { updateTransaction, removePendingTransaction } from '../../ducks/transaction';

import snxJSConnector from '../../utils/snxJSConnector';

const StatusLabel = ({ transaction: { status, hash }, colors, network, hasHash }) => {
	let color = '';
	switch (status) {
		case 'Cancelled':
		case 'Failed':
			color = colors.red;
			break;
		case 'Confirmed':
			color = colors.green;
			break;
		case 'Pending':
			color = colors.fontTertiary;
			break;
		default:
			color = '';
			break;
	}
	return hasHash ? (
		<Link
			color={color}
			href={`https://${network === 'mainnet' ? '' : network + '.'}etherscan.io/address/${hash}`}
			target="_blank"
		>
			<DataLabel color={color}>{status}</DataLabel>
		</Link>
	) : (
		<DataLabel color={color}>{status}</DataLabel>
	);
};

const OrderBook = ({
	theme: { colors },
	transactions,
	pendingTransactions,
	updateTransaction,
	removePendingTransaction,
	walletInfo: { networkName },
}) => {
	const [activeTab, setActiveTab] = useState('Your orders');

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

	return (
		<Container>
			<Tabs>
				{['Your orders', 'Your trades', 'Show all trades'].map(tab => {
					return (
						<Tab
							isDisabled={['Your trades', 'Show all trades'].includes(tab)}
							key={tab}
							onClick={() => {
								if (['Your trades', 'Show all trades'].includes(tab)) return;
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
				<Table cellSpacing="0">
					<Thead>
						<Tr>
							{['Date | Time', 'Pair', 'Price', 'Amount', 'Total', 'Status'].map((label, i) => {
								return (
									<Th key={i}>
										<ButtonSort>
											<DataSmall color={colors.fontTertiary}>{label}</DataSmall>
											{/* <SortIcon src={'/images/sort-arrows.svg'} /> */}
										</ButtonSort>
									</Th>
								);
							})}
						</Tr>
					</Thead>
					<Tbody>
						{transactions.map((transaction, i) => {
							const { date, pair, price, amount, totalUSD, status } = transaction;
							const isPending = ['Pending', 'Waiting'].includes(status);
							const hasHash = !!transaction.hash;
							return (
								<TransactionRow isPending={isPending} key={i}>
									<Td>
										<DataLabel>{format(date, 'DD-MM-YY')}</DataLabel>
									</Td>
									<Td>
										<DataLabel>{pair}</DataLabel>
									</Td>
									<Td>
										<DataLabel>{price}</DataLabel>
									</Td>
									<Td>
										<DataLabel>{amount}</DataLabel>
									</Td>
									<Td>
										<DataLabel>${totalUSD}</DataLabel>
									</Td>
									<Td>
										<StatusLabel
											transaction={transaction}
											colors={colors}
											network={networkName}
											hasHash={hasHash}
										/>
									</Td>
								</TransactionRow>
							);
						})}
						<Tr></Tr>
					</Tbody>
				</Table>
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
`;

// const SortIcon = styled.img`
// 	width: 6.5px;
// 	height: 8px;
// 	margin-left: 5px;
// `;

const ButtonSort = styled.button`
	text-align: left;
	display: flex;
	align-items: center;
	border: none;
	outline: none;
	cursor: pointer;
	background-color: transparent;
	padding: 0;
`;

const Link = styled.a`
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	text-decoration: underline;
	color: ${props => props.color};
`;

const TransactionRow = styled(Tr)`
	& span {
		color: ${props => (props.isPending ? props.theme.colors.fontTertiary : '')};
	}
`;

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
