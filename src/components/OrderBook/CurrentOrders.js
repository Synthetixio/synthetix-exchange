import React from 'react';
import { connect } from 'react-redux';
import styled, { withTheme } from 'styled-components';
import { format } from 'date-fns';

import { Table, Tr, Thead, Tbody, Th, Td, DataLabel } from '../Table';
import { getWalletInfo } from '../../ducks/';
import { DataSmall } from '../Typography';

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
			href={`https://${network === 'mainnet' ? '' : network + '.'}etherscan.io/tx/${hash}`}
			target="_blank"
		>
			<DataLabel color={color}>{status}</DataLabel>
		</Link>
	) : (
		<DataLabel color={color}>{status}</DataLabel>
	);
};

const CurrentOrders = ({ theme: { colors }, transactions, walletInfo: { networkName } }) => {
	return (
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
	);
};

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
		walletInfo: getWalletInfo(state),
	};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(CurrentOrders));
