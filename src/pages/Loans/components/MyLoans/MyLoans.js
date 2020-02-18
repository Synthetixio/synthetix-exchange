import React, { useMemo } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useTable, useFlexLayout, useSortBy } from 'react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Card from '../../../../components/Card';
import { ButtonPrimarySmall } from '../../../../components/Button';
import { HeadingSmall } from '../../../../components/Typography';

import { formatTxTimestamp, formatCurrencyWithKey } from '../../../../utils/formatters';

import { COLLATERAL_PAIR, LOAN_STATUS } from '../../constants';
import { CARD_HEIGHT } from '../../../../constants/ui';

const { COLLATERAL_CURRENCY_KEY, BORROWED_CURRENCY_KEY } = COLLATERAL_PAIR;

const data = [
	{
		loanId: 16,
		amountBorrowed: 100,
		collateralValue: 150,
		timeOpened: Date.now(),
		currentInterest: 20,
		feesPayable: 10,
		status: LOAN_STATUS.OPEN,
	},
	{
		loanId: 18,
		amountBorrowed: 1000,
		collateralValue: 1500,
		timeOpened: Date.now(),
		currentInterest: 30,
		feesPayable: 5,
		status: LOAN_STATUS.OPEN,
	},
];

export const MyLoans = ({ onSelectLoan, selectedLoan }) => {
	const { t } = useTranslation();

	const columns = useMemo(
		() => [
			{
				Header: t('loans.my-loans.table.amount-borrowed-col'),
				accessor: 'amountBorrowed',
				Cell: cellProps => formatCurrencyWithKey(BORROWED_CURRENCY_KEY, cellProps.cell.value),
				width: 200,
				sortable: true,
			},
			{
				Header: t('loans.my-loans.table.collateral-col'),
				accessor: 'collateralValue',
				Cell: cellProps => formatCurrencyWithKey(COLLATERAL_CURRENCY_KEY, cellProps.cell.value),
				sortable: true,
			},
			{
				Header: t('loans.my-loans.table.time-opened-col'),
				accessor: 'timeOpened',
				Cell: cellProps => formatTxTimestamp(cellProps.cell.value),
				sortable: true,
			},
			{
				Header: t('loans.my-loans.table.current-interest-col'),
				accessor: 'currentInterest',
				Cell: cellProps => formatCurrencyWithKey(BORROWED_CURRENCY_KEY, cellProps.cell.value),
				sortable: true,
			},
			{
				Header: t('loans.my-loans.table.fees-payable-col'),
				accessor: 'feesPayable',
				Cell: cellProps => formatCurrencyWithKey(BORROWED_CURRENCY_KEY, cellProps.cell.value),
				sortable: true,
			},
			{
				Header: t('loans.my-loans.table.status-col'),
				accessor: 'status',
				Cell: cellProps => t(`common.tx-status.${cellProps.cell.value}`),
				sortable: true,
			},
			{
				id: 'close',
				Cell: cellProps => (
					<ButtonPrimarySmall
						onClick={() => onSelectLoan(cellProps.row.values)}
						disabled={cellProps.row.values.status === LOAN_STATUS.CLOSED}
					>
						{t('common.actions.close')}
					</ButtonPrimarySmall>
				),
			},
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
		{
			columns,
			data,
		},
		useSortBy,
		useFlexLayout
	);

	return (
		<Card>
			<Card.Header>
				<HeadingSmall>{t('loans.my-loans.title')}</HeadingSmall>
			</Card.Header>
			<StyledCardBody>
				<Table {...getTableProps()}>
					{headerGroups.map(headerGroup => (
						<TableRow {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map(column => (
								<TableCellHead
									{...column.getHeaderProps(column.getSortByToggleProps())}
									className="th"
								>
									{column.render('Header')}
									{column.sortable && (
										<span style={{ marginLeft: '5px' }}>
											{column.isSorted ? (
												column.isSortedDesc ? (
													<FontAwesomeIcon icon="sort-down" />
												) : (
													<FontAwesomeIcon icon="sort-up" />
												)
											) : (
												<FontAwesomeIcon icon="sort" />
											)}
										</span>
									)}
								</TableCellHead>
							))}
						</TableRow>
					))}
					<TableBody {...getTableBodyProps()}>
						{rows.map(row => {
							prepareRow(row);

							const isLoanClosed = row.original.status === LOAN_STATUS.CLOSED;

							return (
								<TableBodyRow
									{...row.getRowProps()}
									className="tr"
									onClick={isLoanClosed ? undefined : () => onSelectLoan(row.original)}
									isLoanClosed={isLoanClosed}
									isSelectedLoan={
										selectedLoan != null && selectedLoan.loanId === row.original.loanId
									}
								>
									{row.cells.map(cell => (
										<TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
									))}
								</TableBodyRow>
							);
						})}
					</TableBody>
				</Table>
			</StyledCardBody>
		</Card>
	);
};

const StyledCardBody = styled(Card.Body)`
	padding: 0;
`;

const Table = styled.div`
	width: 100%;
`;

const TableRow = styled.div`
	background-color: ${props => props.theme.colors.surfaceL3};
	margin-bottom: 8px;
`;

const TableBody = styled.div`
	/* TODO: this is temporary to make sure scrolling looks good with multiple rows - it needs to stretch to the height of the remaining space. */
	max-height: 500px;
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
	cursor: ${props => (props.isLoanClosed ? 'default' : 'pointer')};
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
`;

MyLoans.propTypes = {
	onSelectLoan: PropTypes.func.isRequired,
	selectedLoan: PropTypes.object,
};

export default connect(null, null)(MyLoans);
