import React, { useMemo } from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { useTable, useFlexLayout, useSortBy } from 'react-table';

import { CARD_HEIGHT } from 'src/constants/ui';

import { ReactComponent as SortDownIcon } from 'src/assets/images/sort-down.svg';
import { ReactComponent as SortUpIcon } from 'src/assets/images/sort-up.svg';
import { ReactComponent as SortIcon } from 'src/assets/images/sort.svg';

import { lightTheme, darkTheme } from 'src/styles/theme';

import { TABLE_PALETTE } from './constants';

export const TableV2 = ({
	columns = [],
	data = [],
	options = {},
	noResultsMessage = null,
	onTableRowClick = undefined,
	palette,
}) => {
	const memoizedColumns = useMemo(
		() => columns,
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
		{
			columns: memoizedColumns,
			data,
			...options,
		},
		useSortBy,
		useFlexLayout
	);

	return (
		<Table {...getTableProps()} palette={palette}>
			{headerGroups.map(headerGroup => (
				<TableRow {...headerGroup.getHeaderGroupProps()}>
					{headerGroup.headers.map(column => (
						<TableCellHead {...column.getHeaderProps(column.getSortByToggleProps())}>
							{column.render('Header')}
							{column.sortable && (
								<SortIconContainer>
									{column.isSorted ? (
										column.isSortedDesc ? (
											<SortDownIcon />
										) : (
											<SortUpIcon />
										)
									) : (
										<SortIcon />
									)}
								</SortIconContainer>
							)}
						</TableCellHead>
					))}
				</TableRow>
			))}
			{noResultsMessage != null ? (
				noResultsMessage
			) : (
				<TableBody {...getTableBodyProps()}>
					{rows.map(row => {
						prepareRow(row);

						return (
							<TableBodyRow
								{...row.getRowProps()}
								onClick={onTableRowClick ? () => onTableRowClick(row) : undefined}
							>
								{row.cells.map(cell => (
									<TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
								))}
							</TableBodyRow>
						);
					})}
				</TableBody>
			)}
		</Table>
	);
};

TableV2.propTypes = {
	data: PropTypes.array.isRequired,
	columns: PropTypes.array.isRequired,
	options: PropTypes.object,
	onTableRowClick: PropTypes.func,
	palette: PropTypes.string,
};

export const TableRow = styled.div`
	background-color: ${props => props.theme.colors.surfaceL3};
	margin-bottom: 8px;
`;

const TableBody = styled.div`
	max-height: calc(100% - 40px);
	overflow-y: auto;
	overflow-x: hidden;
`;

const TableBodyRow = styled(TableRow)`
	background-color: ${props =>
		props.isSelectedLoan ? props.theme.colors.accentDark : props.theme.colors.surfaceL3};
	&:hover {
		background-color: ${props => props.theme.colors.accentDark};
		> * {
			transition: transform 0.2s ease-out;
			transform: scale(1.02);
		}
	}
	cursor: ${props => (props.onClick ? 'pointer' : 'default')};
`;

const TableCell = styled.div`
	display: flex;
	align-items: center;
	color: ${props => props.theme.colors.fontPrimary};
	font-size: 12px;
	padding: 10px 0;
	height: ${CARD_HEIGHT};
	box-sizing: border-box;
	&:first-child {
		padding-left: 18px;
	}
	&:last-child {
		justify-content: flex-end;
		padding-right: 18px;
	}
`;

const TableCellHead = styled(TableCell)`
	color: ${props => props.theme.colors.fontTertiary};
	user-select: none;
	text-transform: uppercase;
	background-color: ${props => props.theme.colors.surfaceL3};
`;

const SortIconContainer = styled.span`
	display: flex;
	align-items: center;
	margin-left: 5px;
`;

const Table = styled.div`
	width: 100%;
	height: 100%;
	overflow-x: auto;
	position: relative;

	${props =>
		props.palette === TABLE_PALETTE.LIGHT_SECONDARY &&
		css`
			${TableCell} {
				font-size: 14px;
			}
			${TableRow}, ${TableCellHead} {
				background-color: ${lightTheme.colors.brand};
			}
			${TableCellHead} {
				background-color: ${lightTheme.colors.brand};
				color: ${darkTheme.colors.fontSecondary};
				font-family: ${props => props.theme.fonts.bold};
				font-size: 12px;
			}
			${TableBodyRow} {
				background-color: transparent;
				border: 1px solid ${lightTheme.colors.surfaceL1};
				&:hover {
					> * {
						transition: none;
						transform: none;
					}
					transition: box-shadow 0.2s ease-in-out;
					box-shadow: rgba(188, 99, 255, 0.08) 0px 4px 6px;
				}
			}
		`}
`;

export default TableV2;
