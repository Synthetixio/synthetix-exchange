import React from 'react';
import { connect } from 'react-redux';
import styled, { withTheme } from 'styled-components';
import { format } from 'date-fns';
import Tooltip from '@material-ui/core/Tooltip';

import { Table, Tr, Thead, Tbody, Th, Td, DataLabel } from '../deprecated/Table';
import { getWalletInfo } from '../../ducks/';
import { DataSmall } from '../Typography';
import { formatCurrency } from '../../utils/formatters';

const getAmountPrecision = (amount) => {
	if (amount >= 1000) return 0;
	return 2;
};

const getPricePrecision = (amount) => {
	if (amount >= 1) return 2;
	return 4;
};

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
					{['Date | Time', 'Pair', 'Buying', 'Selling', 'Price', 'Total', 'Status'].map(
						(label, i) => {
							return (
								<Th key={i}>
									<ButtonSort>
										<DataSmall style={{ whiteSpace: 'nowrap' }} color={colors.fontTertiary}>
											{label}
										</DataSmall>
									</ButtonSort>
								</Th>
							);
						}
					)}
				</Tr>
			</Thead>
			<Tbody>
				{transactions.map((transaction, i) => {
					const {
						date,
						base,
						quote,
						price,
						priceUSD,
						fromAmount,
						toAmount,
						totalUSD,
						status,
					} = transaction;
					const isPending = ['Pending', 'Waiting'].includes(status);
					const hasHash = !!transaction.hash;
					return (
						<TransactionRow isPending={isPending} key={i}>
							<Td>
								<TradeLabel style={{ whiteSpace: 'nowrap' }}>
									{format(date, 'DD-MM-YY | HH:mm')}
								</TradeLabel>
							</Td>
							<Td>
								<Tooltip title={`Ratio: ${formatCurrency(price, 8)}`} placement="top">
									<TradeLabel style={{ cursor: 'pointer' }}>
										{base}/{quote}
									</TradeLabel>
								</Tooltip>
							</Td>
							<Td>
								<TradeLabel>{formatCurrency(toAmount, getAmountPrecision(toAmount))}</TradeLabel>
							</Td>
							<Td>
								<TradeLabel>
									{formatCurrency(fromAmount, getAmountPrecision(fromAmount))}
								</TradeLabel>
							</Td>
							<Td>
								<Tooltip title={formatCurrency(priceUSD, 8)} placement="top">
									<TradeLabel style={{ cursor: 'pointer' }}>
										${formatCurrency(priceUSD, getPricePrecision(priceUSD))}
									</TradeLabel>
								</Tooltip>
							</Td>
							<Td>
								<TradeLabel>${totalUSD}</TradeLabel>
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

const TradeLabel = styled(DataLabel)`
	white-space: nowrap;
`;

const ButtonSort = styled.button`
	text-align: left;
	display: flex;
	align-items: center;
	border: none;
	outline: none;
	cursor: pointer;
	background: transparent;
	padding: 0;
`;

const Link = styled.a`
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	text-decoration: underline;
	color: ${(props) => props.color};
`;

const TransactionRow = styled(Tr)`
	& span {
		color: ${(props) => (props.isPending ? props.theme.colors.fontTertiary : '')};
	}
`;

const mapStateToProps = (state) => {
	return {
		walletInfo: getWalletInfo(state),
	};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(CurrentOrders));
