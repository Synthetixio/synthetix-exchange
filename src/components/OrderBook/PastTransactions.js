import React, { useRef } from 'react';
import styled, { withTheme } from 'styled-components';
import { connect } from 'react-redux';
import { format } from 'date-fns';
import { debounce } from 'lodash';
import Tooltip from '@material-ui/core/Tooltip';

import { DataSmall } from '../Typography';
import { getNetworkId } from '../../ducks';
import { Table, Tr, Thead, Tbody, Th, Td, DataLabel } from '../deprecated/Table';
import { formatCurrency } from '../../utils/formatters';
import { getEtherscanTxLink } from '../../utils/explorers';

import Spinner from '../Spinner';
const SCROLL_THRESHOLD = 0.8;

const getPrecision = amount => {
	if (amount >= 1) return 2;
	return 4;
};

const getAmountPrecision = amount => {
	if (amount >= 1000) return 0;
	return 2;
};

const getPrice = ({ toAmountInUSD, toAmount, toCurrencyKey, fromAmountInUSD, fromAmount }) => {
	return toCurrencyKey === 'sUSD' ? fromAmountInUSD / fromAmount : toAmountInUSD / toAmount;
};

const getTotal = (toAmountInUSD, toCurrencyKey, fromAmountInUSD) => {
	const amount = toCurrencyKey === 'sUSD' ? fromAmountInUSD : toAmountInUSD;
	return formatCurrency(amount, getPrecision(amount));
};

const getTradeAmount = (key, amount) => {
	return `${formatCurrency(amount, getAmountPrecision(amount))} ${key}`;
};

const getRatio = ({ toAmount, toCurrencyKey, fromAmount }) => {
	const ratio = toCurrencyKey === 'sUSD' ? toAmount / fromAmount : fromAmount / toAmount;
	return formatCurrency(ratio, 8);
};

const PastTransactions = ({
	theme: { colors },
	transactions: { list, loading },
	onScrollPaging,
	networkId,
}) => {
	const tbodyEl = useRef(null);

	const onTableScroll = () => {
		if (loading) return;
		checkScroll();
	};

	const checkScroll = debounce(() => {
		if (!tbodyEl.current) return;

		const { scrollTop, scrollHeight, clientHeight } = tbodyEl.current;
		if (scrollTop + clientHeight > SCROLL_THRESHOLD * scrollHeight) {
			onScrollPaging();
		}
	}, 200);
	return (
		<>
			<Table cellSpacing="0">
				<Thead>
					<Tr>
						{['Date | Time', 'Pair', 'Bought', 'Sold', 'Price', 'Total', ''].map((label, i) => {
							return (
								<Th key={i} align={i >= 2 ? 'right' : 'left'}>
									<ButtonSort>
										<DataSmall color={colors.fontTertiary}>{label}</DataSmall>
									</ButtonSort>
								</Th>
							);
						})}
					</Tr>
				</Thead>
				<Tbody
					style={{ transition: 'opacity ease-in-out .1s', opacity: loading ? 0.25 : 1 }}
					ref={tbodyEl}
					onScroll={onTableScroll}
				>
					{list.map((t, i) => {
						const price = getPrice(t);
						return (
							<Tr key={`${t.hash}-${i}`}>
								<Td>
									<TradeLabel>{format(t.timestamp, 'DD-MM-YY | HH:mm')}</TradeLabel>
								</Td>
								<Td>
									<Tooltip title={`Ratio: ${getRatio(t)}`} placement="top">
										<TradeLabel style={{ cursor: 'pointer' }}>
											{t.toCurrencyKey}/{t.fromCurrencyKey}
										</TradeLabel>
									</Tooltip>
								</Td>
								<Td>
									<TradeLabel>{getTradeAmount(t.toCurrencyKey, t.toAmount)}</TradeLabel>
								</Td>
								<Td>
									<TradeLabel>{getTradeAmount(t.fromCurrencyKey, t.fromAmount)}</TradeLabel>
								</Td>
								<Td>
									<Tooltip title={formatCurrency(price, 8)} placement="top">
										<TradeLabel style={{ cursor: 'pointer' }}>
											${formatCurrency(price, getPrecision(price))}
										</TradeLabel>
									</Tooltip>
								</Td>
								<Td>
									<TradeLabel>
										${getTotal(t.toAmountInUSD, t.toCurrencyKey, t.fromAmountInUSD)}
									</TradeLabel>
								</Td>

								<Td>
									<TradeLabel>
										<Link href={getEtherscanTxLink(networkId, t.hash)} target="_blank">
											VIEW
										</Link>
									</TradeLabel>
								</Td>
							</Tr>
						);
					})}
				</Tbody>
			</Table>
			{loading ? <CenteredSpinner size="big" /> : null}
		</>
	);
};

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
const CenteredSpinner = styled(Spinner)`
	position: absolute;
	top: 50%;
	left: 50%;
	margin-top: -20px;
	margin-left: -41px;
	transform: scale(0.5);
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Link = styled.a`
	letter-spacing: 0.2px;
	color: ${props => props.theme.colors.hyperlink};
	&:hover {
		text-decoration: underline;
	}

	text-decoration: none;
`;

const TradeLabel = styled(DataLabel)`
	white-space: nowrap;
`;

const mapStateToProps = state => {
	return {
		networkId: getNetworkId(state),
	};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(PastTransactions));
