import React, { useState } from 'react';
import styled, { withTheme } from 'styled-components';

import { DataSmall } from '../Typography';

const OrderBook = ({ theme: { colors } }) => {
	const [activeTab, setActiveTab] = useState('Your orders');
	return (
		<Container>
			<Tabs>
				{['Your orders', 'Your trades', 'Recent trades', '', 'Show all trades'].map(tab => {
					return (
						<Tab onClick={() => setActiveTab(tab)} hidden={!tab} active={tab === activeTab}>
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
							{[1, 2, 3, 4, 5, 6, 7].map(() => {
								return (
									<Th>
										<ButtonSort>
											<DataSmall color={colors.fontTertiary}>Date Time</DataSmall>
											<SortIcon src={'/images/sort-arrows.svg'} />
										</ButtonSort>
									</Th>
								);
							})}
						</Tr>
					</Thead>
					<Tbody>
						{[1, 2, 3, 4, 5, 6, 7].map(() => {
							return (
								<Tr>
									<Td>
										<TableData>blh fsdf fdsd</TableData>
									</Td>
									<Td>
										<TableData>blh fsdf fdsd</TableData>
									</Td>
									<Td>
										<TableData>blh fsdf fdsd</TableData>
									</Td>
									<Td>
										<TableData>blh fsdf fdsd</TableData>
									</Td>
									<Td>
										<TableData>blh fsdf fdsd</TableData>
									</Td>
									<Td>
										<TableData>blh fsdf fdsd</TableData>
									</Td>
									<Td>
										<TableData>blh fsdf fdsd</TableData>
									</Td>
								</Tr>
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
	background-color: ${props => props.theme.colors.surfaceL1};
`;

const Tabs = styled.div`
	display: flex;
	& > * {
		margin: 0 6px;
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
	visibility: ${props => (props.hidden ? 'hidden' : 'visible')};
	cursor: pointer;
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
`;

const Book = styled.div``;

const Table = styled.table`
	width: 100%;
`;

const Thead = styled.thead`
	background-color: ${props => props.theme.colors.surfaceL3};
`;

const Tbody = styled.tbody`
	background-color: ${props => props.theme.colors.surfaceL2};
`;

const Tr = styled.tr``;

const Th = styled.th`
	height: 42px;
	line-height: 12px;
	text-align: left;
	padding: 0 18px;
`;

const Td = styled.td`
	text-align: left;
	padding: 6px 18px;
`;

const TableData = styled(DataSmall)`
	text-transform: none;
	color: ${props => props.theme.colors.fontPrimary};
	font-family: 'apercu-regular';
`;

const SortIcon = styled.img`
	width: 6.5px;
	height: 8px;
	margin-left: 5px;
`;

const ButtonSort = styled.button`
	border: none;
	outline: none;
	cursor: pointer;
	background-color: transparent;
	padding: 0;
`;
export default withTheme(OrderBook);
