import React, { useMemo } from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { useTable, useFlexLayout, useSortBy } from 'react-table';

import { CARD_HEIGHT } from 'src/constants/ui';

import { ReactComponent as SortDownIcon } from 'src/assets/images/sort-down.svg';
import { ReactComponent as SortUpIcon } from 'src/assets/images/sort-up.svg';
import { ReactComponent as SortIcon } from 'src/assets/images/sort.svg';

import { lightTheme, darkTheme } from 'src/styles/theme';
import { FlexDivCentered } from 'src/shared/commonStyles';

import Spinner from 'src/components/Spinner';

import { TABLE_PALETTE } from './constants';

export const Table = ({
	columns = [],
	columnsDeps = [],
	data = [],
	options = {},
	noResultsMessage = null,
	onTableRowClick = undefined,
	palette = TABLE_PALETTE.PRIMARY,
	isLoading = false,
	cellHeight = null,
}) => {
	const memoizedColumns = useMemo(
		() => columns,
		// eslint-disable-next-line react-hooks/exhaustive-deps
		columnsDeps
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
		<ReactTable {...getTableProps()} palette={palette} cellHeight={cellHeight}>
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
			) : isLoading ? (
				<Spinner size="sm" fullscreen={true} />
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
		</ReactTable>
	);
};

Table.propTypes = {
	data: PropTypes.array.isRequired,
	columns: PropTypes.array.isRequired,
	columnsDeps: PropTypes.array,
	options: PropTypes.object,
	onTableRowClick: PropTypes.func,
	palette: PropTypes.string,
};

export const TableRow = styled.div``;

const TableBody = styled.div`
	overflow-y: auto;
	overflow-x: hidden;
`;

const TableBodyRow = styled(TableRow)`
	cursor: ${props => (props.onClick ? 'pointer' : 'default')};
`;

const TableCell = styled(FlexDivCentered)`
	box-sizing: border-box;
	&:first-child {
		padding-left: 18px;
	}
	&:last-child {
		padding-right: 18px;
	}
`;

const TableCellHead = styled(TableCell)`
	user-select: none;
	text-transform: uppercase;
`;

const SortIconContainer = styled.span`
	display: flex;
	align-items: center;
	margin-left: 5px;
`;

const ReactTable = styled.div`
	width: 100%;
	height: 100%;
	overflow-x: auto;
	position: relative;

	${props =>
		props.palette === TABLE_PALETTE.PRIMARY &&
		css`
			${TableBody} {
				max-height: calc(100% - ${CARD_HEIGHT});
			}
			${TableCell} {
				color: ${props => props.theme.colors.fontPrimary};
				font-size: 12px;
				height: ${props => props.cellHeight || CARD_HEIGHT};
			}
			${TableRow} {
				background-color: ${props => props.theme.colors.surfaceL3};
				margin-bottom: 8px;
			}
			${TableCellHead} {
				color: ${props => props.theme.colors.fontTertiary};
				background-color: ${props => props.theme.colors.surfaceL3};
			}
			${TableBodyRow} {
				background-color: ${props => props.theme.colors.surfaceL3};
				&:hover {
					background-color: ${props => props.theme.colors.accentL1};
					> * {
						transition: transform 0.2s ease-out;
						transform: scale(1.02);
					}
				}
			}
		`}

${props =>
	props.palette === TABLE_PALETTE.STRIPED &&
	css`
		${TableBody} {
			max-height: calc(100% - 48px);
		}
		${TableCell} {
			color: ${props => props.theme.colors.fontPrimary};
			font-size: 12px;
			height: ${props => props.cellHeight || '48px'};
		}
		${TableRow} {
			background-color: ${props => props.theme.colors.surfaceL3};
			&:nth-child(odd) {
				background-color: ${props => props.theme.colors.surfaceL2};
			}
		}
		${TableCellHead} {
			color: ${props => props.theme.colors.fontTertiary};
			background-color: ${props => props.theme.colors.surfaceL3};
		}
		${TableBodyRow} {
			background-color: ${props => props.theme.colors.surfaceL3};
		}
	`}

	${props =>
		props.palette === TABLE_PALETTE.LIGHT &&
		css`
			${TableBody} {
				max-height: calc(100% - ${CARD_HEIGHT});
			}
			${TableCell} {
				font-size: 14px;
				color: ${lightTheme.colors.fontPrimary};
				height: ${CARD_HEIGHT};
			}
			${TableRow} {
				background-color: ${darkTheme.colors.brand};
				margin-bottom: 8px;
			}
			${TableCellHead} {
				background-color: ${lightTheme.colors.brand};
				color: ${darkTheme.colors.fontSecondary};
				font-family: ${props => props.theme.fonts.bold};
				font-size: 12px;
			}
			${TableBodyRow} {
				background-color: ${darkTheme.colors.brand};
				border: 1px solid ${lightTheme.colors.surfaceL1};
				&:hover {
					transition: box-shadow 0.2s ease-in-out;
					box-shadow: rgba(188, 99, 255, 0.08) 0px 4px 6px;
				}
			}
		`}
`;

export default Table;
