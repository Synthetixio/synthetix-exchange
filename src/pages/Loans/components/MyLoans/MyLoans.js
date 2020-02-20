import React, { useMemo, useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useTable, useFlexLayout, useSortBy } from 'react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Card from '../../../../components/Card';
import { ButtonPrimarySmall } from '../../../../components/Button';
import { HeadingSmall } from '../../../../components/Typography';
import Spinner from '../../../../components/Spinner';

import { fetchLoans, LOAN_STATUS } from '../../../../ducks/loans';

import { formatTxTimestamp, formatCurrencyWithKey } from '../../../../utils/formatters';

import { CARD_HEIGHT } from '../../../../constants/ui';
import { getWalletInfo, getLoans, getIsFetchingLoans } from '../../../../ducks';

export const MyLoans = ({
	onSelectLoan,
	selectedLoan,
	fetchLoans,
	walletInfo: { currentWallet },
	loans,
	collateralPair,
	isFetchingLoans,
}) => {
	const { t } = useTranslation();
	const [hasFetchError, setHasFetchError] = useState(false);
	const [isLoansFetched, setIsLoansFetched] = useState(false);
	const { collateralCurrencyKey, loanCurrencyKey } = collateralPair;

	const columns = useMemo(
		() => [
			{
				Header: t('loans.my-loans.table.amount-borrowed-col'),
				accessor: 'loanAmount',
				Cell: cellProps => formatCurrencyWithKey(loanCurrencyKey, cellProps.cell.value),
				width: 150,
				sortable: true,
			},
			{
				Header: t('loans.my-loans.table.collateral-col'),
				accessor: 'collateralAmount',
				Cell: cellProps => formatCurrencyWithKey(collateralCurrencyKey, cellProps.cell.value),
				width: 150,
				sortable: true,
			},
			{
				Header: t('loans.my-loans.table.time-opened-col'),
				accessor: 'timeCreated',
				Cell: cellProps => formatTxTimestamp(cellProps.cell.value),
				width: 150,
				sortable: true,
			},
			{
				Header: t('loans.my-loans.table.current-interest-col'),
				accessor: 'currentInterest',
				Cell: cellProps => formatCurrencyWithKey(loanCurrencyKey, cellProps.cell.value),
				width: 150,
				sortable: true,
			},
			{
				Header: t('loans.my-loans.table.fees-payable-col'),
				accessor: 'feesPayable',
				Cell: cellProps => formatCurrencyWithKey(loanCurrencyKey, cellProps.cell.value),
				width: 150,
				sortable: true,
			},
			{
				Header: t('loans.my-loans.table.status-col'),
				accessor: 'status',
				Cell: cellProps => t(`common.tx-status.${cellProps.cell.value}`),
				width: 100,
				sortable: true,
			},
			{
				id: 'close',
				Cell: cellProps => {
					const loanData = cellProps.row.original;
					const isLoanClosed = loanData.status === LOAN_STATUS.CLOSED;

					return isLoanClosed ? null : (
						<ButtonPrimarySmall
							onClick={() => onSelectLoan(loanData)}
							disabled={loanData.status !== LOAN_STATUS.OPEN}
						>
							{t('common.actions.close')}
						</ButtonPrimarySmall>
					);
				},
			},
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
		{
			columns,
			data: loans,
			initialState: {
				sortBy: [{ id: 'timeCreated', desc: true }],
			},
		},
		useSortBy,
		useFlexLayout
	);

	const fetchMyLoans = useCallback(async () => {
		setHasFetchError(false);

		const result = await fetchLoans();
		if (result) {
			setIsLoansFetched(true);
		} else {
			setHasFetchError(true);
		}
	}, [fetchLoans, setIsLoansFetched, setHasFetchError]);

	useEffect(() => {
		if (currentWallet) {
			fetchMyLoans();
		}
	}, [fetchMyLoans, currentWallet]);

	return (
		<StyledCard>
			<Card.Header>
				<HeadingSmall>{t('loans.my-loans.title')}</HeadingSmall>
				{isFetchingLoans && !isLoansFetched && <HeaderSpinner size="sm" />}
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
						{currentWallet &&
							isLoansFetched &&
							rows.length > 0 &&
							rows.map(row => {
								prepareRow(row);

								return (
									<TableBodyRow
										{...row.getRowProps()}
										className="tr"
										isSelectedLoan={
											selectedLoan != null && selectedLoan.loanID === row.original.loanID
										}
									>
										{row.cells.map(cell => (
											<TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
										))}
									</TableBodyRow>
								);
							})}
						{currentWallet && isLoansFetched && rows.length === 0 && (
							<NoResults>{t('loans.my-loans.table.no-results')}</NoResults>
						)}
						{/* {currentWallet && !isLoansFetched && !hasFetchError && <Spinner size="sm" />} */}
						{!currentWallet && <ButtonPrimarySmall>Connect</ButtonPrimarySmall>}
						{hasFetchError && <ButtonPrimarySmall onClick={fetchMyLoans}>Retry</ButtonPrimarySmall>}
					</TableBody>
				</Table>
			</StyledCardBody>
		</StyledCard>
	);
};

const StyledCard = styled(Card)`
	flex-grow: 1;
	display: flex;
	flex-direction: column;
`;

const StyledCardBody = styled(Card.Body)`
	padding: 0;
	flex-grow: 1;
`;

const HeaderSpinner = styled(Spinner)`
	margin-left: 10px;
`;

const Table = styled.div`
	width: 100%;
	height: 100%;
	overflow-x: auto;
`;

const TableRow = styled.div`
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

const NoResults = styled.div`
	margin-top: 20px;
	color: ${props => props.theme.colors.fontPrimary};
	font-size: 13px;
	padding: 0 18px;
`;

MyLoans.propTypes = {
	onSelectLoan: PropTypes.func.isRequired,
	selectedLoan: PropTypes.object,
	collateralPair: PropTypes.object,
	isFetchingLoans: PropTypes.bool,
};

const mapStateToProps = state => ({
	walletInfo: getWalletInfo(state),
	loans: getLoans(state),
	isFetchingLoans: getIsFetchingLoans(state),
});

const mapDispatchToProps = {
	fetchLoans,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyLoans);
