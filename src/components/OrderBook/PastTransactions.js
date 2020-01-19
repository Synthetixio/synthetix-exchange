import React, { useRef } from 'react';
import styled, { withTheme } from 'styled-components';
import { connect } from 'react-redux';
import { format } from 'date-fns';
import { debounce } from 'lodash';

import { DataSmall } from '../Typography';
import { Table, Tr, Thead, Tbody, Th, Td, DataLabel } from '../Table';
import Spinner from '../Spinner';

const SCROLL_THRESHOLD = 0.8;

const getPrice = (fromSynth, toSynth, fromAmount, toAmount) => {
	if (toSynth === 'sUSD') return (toAmount / fromAmount).toFixed(4);

	return (fromAmount / toAmount).toFixed(4);
};

const formatAmount = amount => {
	if (amount > 1) {
		return amount.toFixed(2);
	} else if (amount > 0.001) {
		return amount.toFixed(4);
	} else if (amount) {
		return amount.toFixed(8);
	}
};

const PastTransactions = ({
	theme: { colors },
	transactions: { list, loading },
	onScrollPaging,
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
						{['Date | Time', 'Pair', 'Price', 'Amount', 'Total', 'Status', 'View'].map(
							(label, i) => {
								return (
									<Th key={i}>
										<ButtonSort>
											<DataSmall color={colors.fontTertiary}>{label}</DataSmall>
											{/* <SortIcon src={'/images/sort-arrows.svg'} /> */}
										</ButtonSort>
									</Th>
								);
							}
						)}
					</Tr>
				</Thead>
				<Tbody ref={tbodyEl} onScroll={onTableScroll}>
					{list.map(t => {
						return (
							<Tr key={t.hash}>
								<Td>
									<DataLabel>{format(t.timestamp, 'DD-MM-YY | HH:mmA')}</DataLabel>
								</Td>
								<Td>
									<DataLabel>
										{t.fromCurrencyKey}/{t.toCurrencyKey}
									</DataLabel>
								</Td>
								<Td>
									<DataLabel>
										{getPrice(t.fromCurrencyKey, t.toCurrencyKey, t.fromAmount, t.toAmount)}
									</DataLabel>
								</Td>
								<Td>
									<DataLabel>{formatAmount(t.fromAmount)}</DataLabel>
								</Td>
								<Td>
									<DataLabel>{formatAmount(t.toAmount)}</DataLabel>
								</Td>
								<Td>
									<DataLabel>COMPLETE</DataLabel>
								</Td>
								<Td>
									<DataLabel>
										<Link href={`https://etherscan.io/tx/${t.hash}`} target="_blank">
											VIEW
										</Link>
									</DataLabel>
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
	background-color: transparent;
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
	color: ${props => props.theme.colors.hyperLink};
	&:hover {
		text-decoration: underline;
	}

	text-decoration: none;
`;

const mapStateToProps = () => {
	return {};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(PastTransactions));
