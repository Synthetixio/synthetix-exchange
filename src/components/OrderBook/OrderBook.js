import React, { useState, useEffect } from 'react';
import styled, { withTheme } from 'styled-components';
import { connect } from 'react-redux';
import { getWalletInfo } from '../../ducks';
import { subHours, format } from 'date-fns';
import snxData from 'synthetix-data';

import { DataSmall } from '../Typography';
import { Table, Tr, Thead, Tbody, Th, Td, DataLabel } from '../Table';
import Spinner from '../Spinner';

const useOrderBookTab = (tab, walletInfo, setIsLoading, setList) => {
	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			const now = new Date().getTime();
			let results = [];
			if (tab === 'Your trades') {
				const { currentWallet } = walletInfo;
				results = await snxData.exchanges.since({
					fromAddress: currentWallet,
					maxTimestamp: Math.trunc(now / 1000),
					minTimestamp: Math.trunc(subHours(now, 168).getTime() / 1000), // last week
					max: 50,
				});
			} else if (tab === 'Show all trades') {
				results = await snxData.exchanges.since({
					maxTimestamp: Math.trunc(now / 1000),
					minTimestamp: Math.trunc(subHours(now, 168).getTime() / 1000),
					max: 50,
				});
			}

			console.log(results);
			setList(results);
			setIsLoading(false);
		};
		fetchData();
	}, [tab]);
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
	const [activeTab, setActiveTab] = useState('Your orders');
	const [list, setList] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	useOrderBookTab(activeTab, walletInfo, setIsLoading, setList);
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
					{isLoading ? null : (
						<Tbody>
							{list.map(t => {
								return (
									<Tr key={t.hash}>
										<Td>
											<DataLabel>{format(t.timestamp, 'DD-MM-YY | HH:mmA')}</DataLabel>
										</Td>
										<Td>
											<DataLabel>
												{t.fromCurrencyKey} / {t.toCurrencyKey}
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
					)}
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
