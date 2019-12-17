import React, { useState, useEffect, useRef } from 'react';
import styled, { withTheme } from 'styled-components';
import { connect } from 'react-redux';
import { getWalletInfo } from '../../ducks';
import { format } from 'date-fns';
import { last, debounce } from 'lodash';
import snxData from 'synthetix-data';

import { DataSmall } from '../Typography';
import { Table, Tr, Thead, Tbody, Th, Td, DataLabel } from '../Table';
import Spinner from '../Spinner';

const SCROLL_THRESHOLD = 0.8;

const useOrderBookTab = (walletInfo, isLoading, setIsLoading, listData, setListData) => {
	useEffect(() => {
		const fetchData = async () => {
			const { tab, list, maxBlock } = listData;

			if (isLoading) return;
			setIsLoading(true);

			let results;
			if (tab === 'Your trades') {
				const { currentWallet } = walletInfo;
				results = await snxData.exchanges.since({
					fromAddress: currentWallet,
					maxBlock: maxBlock,
					max: 100,
				});
			} else if (tab === 'Show all trades') {
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

				setListData({ ...listData, list: results });
			}

			setIsLoading(false);
		};
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [listData.tab, listData.maxBlock]);
};

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

const OrderBook = ({ theme: { colors }, walletInfo }) => {
	const [listData, setListData] = useState({
		tab: 'Your orders',
		list: [],
		maxBlock: Number.MAX_SAFE_INTEGER, // now
	});
	const { list } = listData;

	const [isLoading, setIsLoading] = useState(false);
	const tbodyEl = useRef(null);

	const onTableScroll = () => {
		if (isLoading) return;
		checkScroll();
	};

	const checkScroll = debounce(() => {
		if (!tbodyEl.current) return;

		const { scrollTop, scrollHeight, clientHeight } = tbodyEl.current;
		if (scrollTop + clientHeight > SCROLL_THRESHOLD * scrollHeight) {
			const lastRow = last(list);
			if (lastRow) {
				setListData({ ...listData, maxBlock: lastRow.block });
			}
		}
	}, 200);

	useOrderBookTab(walletInfo, isLoading, setIsLoading, listData, setListData);
	return (
		<Container>
			<Tabs>
				{['Your orders', 'Your trades', 'Show all trades'].map(tab => {
					return (
						<Tab
							key={tab}
							isDisabled={tab === 'Your trades' && !walletInfo.currentWallet}
							onClick={() => {
								if (tab === 'Your trades' && !walletInfo.currentWallet) return;
								setListData({
									tab: tab,
									list: [],
									maxBlock: Number.MAX_SAFE_INTEGER,
								});
							}}
							hidden={!tab}
							active={tab === listData.tab}
						>
							<DataSmall color={tab === listData.tab ? colors.fontPrimary : colors.fontTertiary}>
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
							{['date | time', 'pair', 'price', 'amount', 'total', 'status', 'view'].map(column => {
								return (
									<Th key={column}>
										<ButtonSort>
											<DataSmall color={colors.fontTertiary}>{column.toUpperCase()}</DataSmall>
											<SortIcon src={'/images/sort-arrows.svg'} />
										</ButtonSort>
									</Th>
								);
							})}
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
				{isLoading ? <CenteredSpinner size="big" /> : null}
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

const SortIcon = styled.img`
	width: 6.5px;
	height: 8px;
	margin-left: 5px;
`;

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
	margin-left: -20px;
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

const mapStateToProps = state => {
	return {
		walletInfo: getWalletInfo(state),
	};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(OrderBook));
