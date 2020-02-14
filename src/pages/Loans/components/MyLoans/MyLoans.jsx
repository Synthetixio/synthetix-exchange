import React, { useMemo } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useTable, useSortBy } from 'react-table';

import Card from '../../../../components/Card';
import { ButtonPrimarySmall } from '../../../../components/Button';
import { HeadingSmall } from '../../../../components/Typography';

import { formatTxTimestamp, formatCurrencyWithKey } from '../../../../utils/formatters';

import { ReactComponent as SortIconUp } from '../../../../assets/images/icon-sort-up.svg';
import { ReactComponent as SortIconDown } from '../../../../assets/images/icon-sort-down.svg';
import { ReactComponent as SortIconNeutral } from '../../../../assets/images/icon-sort-neutral.svg';

import { CARD_HEIGHT } from '../../../../constants/ui';
import { COLLATERAL_PAIR, LOAN_STATUS } from '../../constants';

const { LOCKED_CURRENCY_KEY, BORROWED_CURRENCY_KEY } = COLLATERAL_PAIR;

const data = [
	{
		loanId: '1',
		amountBorrowed: 100,
		collateralValue: 150,
		timeOpened: Date.now(),
		currentInterest: 20,
		feesPayable: 10,
		status: LOAN_STATUS.WAITING,
	},
	{
		loanId: '2',
		amountBorrowed: 1000,
		collateralValue: 1500,
		timeOpened: Date.now(),
		currentInterest: 30,
		feesPayable: 5,
		status: LOAN_STATUS.CLOSED,
	},
];

export const MyLoans = ({ onCloseButtonClick }) => {
	const { t } = useTranslation();

	const columns = useMemo(
		() => [
			{
				Header: t('loans.my-loans.table.amount-borrowed-col'),
				accessor: 'amountBorrowed',
				Cell: cellProps => formatCurrencyWithKey(BORROWED_CURRENCY_KEY, cellProps.cell.value),
				sortable: true,
			},
			{
				Header: t('loans.my-loans.table.collateral-col'),
				accessor: 'collateralValue',
				Cell: cellProps => formatCurrencyWithKey(LOCKED_CURRENCY_KEY, cellProps.cell.value),
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
					<ButtonPrimarySmall onClick={() => onCloseButtonClick(cellProps.row.values)}>
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
		useSortBy
	);

	return (
		<Card>
			<Card.Header>
				<HeadingSmall>{t('loans.my-loans.title')}</HeadingSmall>
			</Card.Header>
			<StyledCardBody>
				<Table {...getTableProps()}>
					<thead>
						{headerGroups.map(headerGroup => (
							<tr {...headerGroup.getHeaderGroupProps()}>
								{headerGroup.headers.map(column => (
									<th {...column.getHeaderProps(column.getSortByToggleProps())}>
										{column.render('Header')}
										{column.sortable && (
											<span style={{ marginLeft: '5px' }}>
												{column.isSorted ? (
													column.isSortedDesc ? (
														<SortIconDown />
													) : (
														<SortIconUp />
													)
												) : (
													<SortIconNeutral />
												)}
											</span>
										)}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody {...getTableBodyProps()}>
						{rows.map(row => {
							prepareRow(row);

							return (
								<tr {...row.getRowProps()}>
									{row.cells.map(cell => (
										<td {...cell.getCellProps()}>{cell.render('Cell')}</td>
									))}
								</tr>
							);
						})}
					</tbody>
				</Table>
			</StyledCardBody>
		</Card>
	);
};

const StyledCardBody = styled(Card.Body)`
	padding: 0;
`;

const Table = styled.table`
	border-collapse: collapse;
	width: 100%;
	tr {
		> * {
			color: ${props => props.theme.colors.fontPrimary};
			height: ${CARD_HEIGHT};
			text-align: left;
			font-size: 12px;
			padding: 10px 0;
			&:first-child {
				padding-left: 18px;
			}
			&:last-child {
				text-align: right;
				padding-right: 18px;
			}
		}
		> th {
			background-color: ${props => props.theme.colors.surfaceL3};
			color: ${props => props.theme.colors.fontTertiary};
			user-select: none;
		}
	}
`;

MyLoans.propTypes = {
	onCloseButtonClick: PropTypes.func.isRequired,
};

export default connect(null, null)(MyLoans);
