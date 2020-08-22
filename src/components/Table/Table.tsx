import React, { FC, useMemo, DependencyList } from 'react';
import styled, { css } from 'styled-components';
import { useTable, useFlexLayout, useSortBy, Column, Row } from 'react-table';

import { CARD_HEIGHT } from 'constants/ui';

import { ReactComponent as SortDownIcon } from 'assets/images/sort-down.svg';
import { ReactComponent as SortUpIcon } from 'assets/images/sort-up.svg';
import { ReactComponent as SortIcon } from 'assets/images/sort.svg';

import { lightTheme, darkTheme } from 'styles/theme';
import { FlexDivCentered } from 'shared/commonStyles';

import Spinner from 'components/Spinner';
import { tableHeaderLargeCSS } from 'components/Typography/Table';
import { bodyCSS } from 'components/Typography/General';

export type TablePalette = 'primary' | 'light-secondary' | 'striped';

type ColumnWithSorting<D extends object = {}> = Column<D> & {
	sortType?: string;
	sortable?: boolean;
};

type TableProps = {
	palette?: TablePalette;
	data: object[];
	columns: ColumnWithSorting<object>[];
	columnsDeps?: DependencyList;
	options?: any;
	onTableRowClick?: (row: Row<any>) => void;
	className?: string;
	isLoading?: boolean;
	noResultsMessage?: React.ReactNode;
};

export const Table: FC<TableProps> = ({
	columns = [],
	columnsDeps = [],
	data = [],
	options = {},
	noResultsMessage = null,
	onTableRowClick = undefined,
	palette = 'primary',
	isLoading = false,
	className,
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
		<ReactTable {...getTableProps()} palette={palette} className={className}>
			{headerGroups.map((headerGroup) => (
				<TableRow className="table-row" {...headerGroup.getHeaderGroupProps()}>
					{headerGroup.headers.map((column: any) => (
						<TableCellHead
							{...column.getHeaderProps(
								column.sortable ? column.getSortByToggleProps() : undefined
							)}
						>
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
			{isLoading ? (
				<Spinner size="sm" centered={true} />
			) : noResultsMessage != null ? (
				noResultsMessage
			) : (
				<TableBody className="table-body" {...getTableBodyProps()}>
					{rows.map((row) => {
						prepareRow(row);

						return (
							<TableBodyRow
								className="table-body-row"
								{...row.getRowProps()}
								onClick={onTableRowClick ? () => onTableRowClick(row) : undefined}
							>
								{row.cells.map((cell) => (
									<TableCell className="table-body-cell" {...cell.getCellProps()}>
										{cell.render('Cell')}
									</TableCell>
								))}
							</TableBodyRow>
						);
					})}
				</TableBody>
			)}
		</ReactTable>
	);
};

export const TableRow = styled.div``;

const TableBody = styled.div`
	overflow-y: auto;
	overflow-x: hidden;
`;

const TableBodyRow = styled(TableRow)`
	cursor: ${(props) => (props.onClick ? 'pointer' : 'default')};
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

const ReactTable = styled.div<{ palette: TablePalette }>`
	width: 100%;
	height: 100%;
	overflow-x: auto;
	position: relative;

	${(props) =>
		props.palette === 'primary' &&
		css`
			${TableBody} {
				max-height: calc(100% - ${CARD_HEIGHT});
			}
			${TableCell} {
				color: ${(props) => props.theme.colors.fontPrimary};
				font-size: 12px;
				height: ${CARD_HEIGHT};
			}
			${TableRow} {
				background-color: ${(props) => props.theme.colors.surfaceL3};
				margin-bottom: 8px;
			}
			${TableCellHead} {
				font-family: ${(props) => props.theme.fonts.medium};
				color: ${(props) => props.theme.colors.fontTertiary};
				background-color: ${(props) => props.theme.colors.surfaceL3};
			}
			${TableBodyRow} {
				background-color: ${(props) => props.theme.colors.surfaceL3};
				&:hover {
					background-color: ${(props) => props.theme.colors.accentL1};
					> * {
						transition: transform 0.2s ease-out;
						transform: scale(1.02);
					}
				}
			}
		`}

${(props) =>
	props.palette === 'striped' &&
	css`
		${TableBody} {
			max-height: calc(100% - 48px);
		}
		${TableCell} {
			color: ${(props) => props.theme.colors.fontPrimary};
			font-size: 12px;
			height: 48px;
		}
		${TableRow} {
			background-color: ${(props) => props.theme.colors.surfaceL3};
			&:nth-child(odd) {
				background-color: ${(props) => props.theme.colors.surfaceL2};
			}
		}
		${TableCellHead} {
			font-family: ${(props) => props.theme.fonts.medium};
			color: ${(props) => props.theme.colors.fontTertiary};
			background-color: ${(props) => props.theme.colors.surfaceL3};
		}
		${TableBodyRow} {
			background-color: ${(props) => props.theme.colors.surfaceL3};
		}
	`}

	${(props) =>
		props.palette === 'light-secondary' &&
		css`
			${TableBody} {
				max-height: calc(100% - 56px);
			}
			${TableCell} {
				${bodyCSS};
				color: ${lightTheme.colors.fontPrimary};
				height: 56px;
			}
			${TableRow} {
				background-color: ${darkTheme.colors.brand};
				margin-bottom: 8px;
			}
			${TableCellHead} {
				background-color: ${lightTheme.colors.brand};
				color: ${darkTheme.colors.fontSecondary};
				font-family: ${(props) => props.theme.fonts.medium};
				${tableHeaderLargeCSS};
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
