import React, { useMemo, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useTable, useFlexLayout, useSortBy, useExpanded } from 'react-table';
import Tooltip from '@material-ui/core/Tooltip';

import { ReactComponent as NoWalletIcon } from 'assets/images/no-wallet.svg';
import { ReactComponent as ErrorCircleIcon } from 'assets/images/error-circle.svg';
import { ReactComponent as SortDownIcon } from 'assets/images/sort-down.svg';
import { ReactComponent as SortUpIcon } from 'assets/images/sort-up.svg';
import { ReactComponent as SortIcon } from 'assets/images/sort.svg';

import { ButtonPrimarySmall } from 'components/Button';
import Spinner from 'components/Spinner';

import { absoluteCenteredCSS, TableNoResults } from 'shared/commonStyles';

import {
	fetchLoans,
	getMyLoans,
	getIsLoadingMyLoans,
	getIsRefreshingMyLoans,
	getMyLoansLoadingError,
	getIsLoadedMyLoans,
	LOAN_STATUS,
} from 'ducks/loans/myLoans';
import { getNetworkId, getWalletInfo } from 'ducks/wallet/walletDetails';
import { showWalletPopup } from 'ducks/ui';

import { formatTxTimestamp, formatCurrencyWithKey, formatCurrency } from 'utils/formatters';

import { CARD_HEIGHT } from 'constants/ui';
import { getContractType, getLoansCollateralPair } from 'ducks/loans/contractInfo';
import Activity from '../Activity';
import { getEtherscanTxLink } from 'utils/explorers';
import ViewLink, { ArrowIcon } from '../Activity/ViewLink';

const Loans = ({
	onSelectLoan,
	selectedLoan,
	networkId,
	setVisiblePanel,
	fetchLoans,
	walletInfo: { currentWallet },
	loans,
	collateralPair,
	isLoadingMyLoans,
	myLoansLoadingError,
	isLoadedMyLoans,
	showWalletPopup,
	contractType,
}) => {
	const { t } = useTranslation();
	const { collateralCurrencyKey } = collateralPair;

	const columns = useMemo(
		() => [
			{
				Header: <>{t('loans.my-loans.table.amount-borrowed-col')}</>,
				accessor: 'loanAmount',
				Cell: (cellProps) => {
					const { loanType } = cellProps.row.original;
					return (
						<Tooltip title={formatCurrency(cellProps.cell.value, 18)}>
							<span>
								{formatCurrencyWithKey(
									loanType === 'sETH' ? 'sETH' : 'sUSD',
									cellProps.cell.value,
									4
								)}
							</span>
						</Tooltip>
					);
				},
				width: 150,
				sortable: true,
			},
			{
				Header: <>{t('loans.my-loans.table.collateral-col')}</>,
				accessor: 'collateralAmount',
				Cell: (cellProps) => (
					<Tooltip title={formatCurrency(cellProps.cell.value, 18)}>
						<span>{formatCurrencyWithKey(collateralCurrencyKey, cellProps.cell.value, 4)}</span>
					</Tooltip>
				),
				width: 150,
				sortable: true,
			},
			{
				Header: <>{t('loans.my-loans.table.c-ratio-col')}</>,
				accessor: 'cRatio',
				Cell: (cellProps) => `${cellProps.cell.value.toFixed(4)}%`,
				width: 150,
				sortable: true,
			},
			{
				Header: <>{t('loans.my-loans.table.time-opened-col')}</>,
				accessor: 'timeCreated',
				Cell: (cellProps) => formatTxTimestamp(cellProps.cell.value),
				width: 150,
				sortable: true,
			},
			{
				Header: <>{t('loans.my-loans.table.current-interest-fee-col')}</>,
				accessor: 'currentInterest',
				Cell: (cellProps) => {
					const { loanType } = cellProps.row.original;
					return (
						<Tooltip title={formatCurrency(cellProps.cell.value, 18)}>
							<span>
								{formatCurrencyWithKey(
									loanType === 'sETH' ? 'sETH' : 'sUSD',
									cellProps.cell.value,
									4
								)}
							</span>
						</Tooltip>
					);
				},
				width: 150,
				sortable: true,
			},
			{
				Header: <>{t('loans.my-loans.table.status-col')}</>,
				accessor: 'status',
				Cell: (cellProps) => t(`common.tx-status.${cellProps.cell.value}`),
				width: 100,
				sortable: true,
			},
			{
				Header: <>{t('loans.my-loans.table.verify-tx-col')}</>,
				accessor: 'txHash',
				Cell: (cellProps) => {
					return (
						<ViewLink
							isDisabled={!cellProps.cell.value}
							href={getEtherscanTxLink(networkId, cellProps.cell.value)}
						>
							{t('common.transaction.view')}
							<ArrowIcon width="8" height="8" />
						</ViewLink>
					);
				},
				width: 150,
				sortable: true,
			},
			{
				id: 'action',
				Cell: ({ row, rows, toggleRowExpanded }) => {
					const loanData = row.original;
					const isLoanClosed = loanData.status === LOAN_STATUS.CLOSED;
					return (
						<>
							{contractType === 'sUSD' && loanData.hasPartialLiquidations && (
								<ButtonPrimarySmall
									onClick={() => {
										const expandedRow = rows.find((row) => row.isExpanded);
										if (expandedRow) {
											const isSubItemOfRow = Boolean(
												expandedRow && row.id.split('.')[0] === expandedRow.id
											);

											if (isSubItemOfRow) {
												const expandedSubItem = expandedRow.subRows.find(
													(subRow) => subRow.isExpanded
												);

												if (expandedSubItem) {
													const isClickedOnExpandedSubItem = expandedSubItem.id === row.id;
													if (!isClickedOnExpandedSubItem) {
														toggleRowExpanded(expandedSubItem.id, false);
													}
												}
											} else {
												toggleRowExpanded(expandedRow.id, false);
											}
										}
										row.toggleRowExpanded();
									}}
								>
									{t('loans.liquidations.table.activity')}
								</ButtonPrimarySmall>
							)}
							{!isLoanClosed && (
								<ButtonPrimarySmall
									style={{
										marginLeft: 16,
									}}
									onClick={() => {
										setVisiblePanel(null);
										onSelectLoan(loanData);
									}}
								>
									{contractType === 'sETH'
										? t('common.actions.close')
										: t('common.actions.options')}
								</ButtonPrimarySmall>
							)}
						</>
					);
				},
			},
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[contractType, selectedLoan, loans]
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
		useExpanded,
		useFlexLayout
	);

	useEffect(() => {
		if (currentWallet) {
			fetchLoans();
		}
	}, [fetchLoans, currentWallet, contractType]);

	return (
		<Table {...getTableProps()}>
			{headerGroups.map((headerGroup) => (
				<TableRow {...headerGroup.getHeaderGroupProps()}>
					{headerGroup.headers.map((column) => (
						<TableCellHead {...column.getHeaderProps(column.getSortByToggleProps())} className="th">
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
			{!isLoadingMyLoans && isLoadedMyLoans && rows.length > 0 ? (
				<TableBody {...getTableBodyProps()}>
					{rows.map((row) => {
						prepareRow(row);
						const loanData = row.original;
						const isLoanClosed = loanData.status === LOAN_STATUS.CLOSED;
						return (
							<div key={row.id}>
								<TableBodyRow
									{...row.getRowProps()}
									className="tr"
									isSelectedLoan={
										selectedLoan != null && selectedLoan.loanID === row.original.loanID
									}
									onClick={() => {
										if (!isLoanClosed) {
											setVisiblePanel(null);
											onSelectLoan(loanData);
										}
									}}
									isLoanClosed={isLoanClosed}
								>
									{row.cells.map((cell) => (
										<TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
									))}
								</TableBodyRow>
								{row.isExpanded && (
									<Activity partialLiquidations={row.original.partialLiquidations} />
								)}
							</div>
						);
					})}
				</TableBody>
			) : currentWallet == null ? (
				<MessageContainer>
					<NoWalletIcon />
					<MessageLabel>{t('common.wallet.no-wallet-connected')}</MessageLabel>
					<ButtonPrimarySmall onClick={showWalletPopup}>
						{t('common.wallet.connect-currency-wallet', {
							currencyKey: collateralCurrencyKey,
						})}
					</ButtonPrimarySmall>
				</MessageContainer>
			) : myLoansLoadingError ? (
				<MessageContainer>
					<ErrorCircleIcon />
					<MessageLabel>{t('common.errors.error-loading')}</MessageLabel>
					<ButtonPrimarySmall onClick={() => fetchLoans()}>
						{t('common.actions.click-to-retry')}
					</ButtonPrimarySmall>
				</MessageContainer>
			) : isLoadingMyLoans && !isLoadedMyLoans ? (
				<HeaderSpinner size="sm" centered={true} />
			) : (
				rows.length === 0 &&
				isLoadedMyLoans && <TableNoResults>{t('loans.my-loans.table.no-results')}</TableNoResults>
			)}
		</Table>
	);
};

const HeaderSpinner = styled(Spinner)`
	${(props) =>
		props.centered
			? absoluteCenteredCSS
			: css`
					margin-left: 10px;
			  `};
`;

const Table = styled.div`
	width: 100%;
	height: 100%;
	overflow-x: auto;
	position: relative;
`;

const TableRow = styled.div`
	background-color: ${(props) => props.theme.colors.surfaceL3};
	margin-bottom: 8px;
`;

const TableBody = styled.div`
	max-height: calc(100% - 40px);
	overflow-y: auto;
	overflow-x: hidden;
`;

const TableBodyRow = styled(TableRow)`
	background-color: ${(props) =>
		props.isSelectedLoan ? props.theme.colors.accentL1 : props.theme.colors.surfaceL3};
	display: flex;
	flex-direction: row;
	cursor: ${(props) => (props.isLoanClosed ? 'auto' : 'cursor')};
	&:hover {
		background-color: ${(props) => props.theme.colors.accentL1};
		> * {
			transition: transform 0.2s ease-out;
			transform: scale(1.02);
		}
	}
`;

const TableCell = styled.div`
	display: flex;
	align-items: center;
	color: ${(props) => props.theme.colors.fontPrimary};
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
	color: ${(props) => props.theme.colors.fontTertiary};
	user-select: none;
	text-transform: uppercase;
	background-color: ${(props) => props.theme.colors.surfaceL3};
`;

const MessageContainer = styled.div`
	display: grid;
	grid-auto-flow: row;
	grid-gap: 20px;
	width: 300px;
	justify-items: center;
	padding: 30px;
	background-color: ${(props) => props.theme.colors.surfaceL3};
	${absoluteCenteredCSS};
`;

const MessageLabel = styled.div`
	font-size: 15px;
	color: ${(props) => props.theme.colors.fontPrimary};
`;

const SortIconContainer = styled.span`
	display: flex;
	align-items: center;
	margin-left: 5px;
`;

Loans.propTypes = {
	onSelectLoan: PropTypes.func.isRequired,
	selectedLoan: PropTypes.object,
	collateralPair: PropTypes.object,
	isLoadingMyLoans: PropTypes.bool,
	isRefreshingMyLoans: PropTypes.bool,
	myLoansLoadingError: PropTypes.string,
	isLoadedMyLoans: PropTypes.bool,
};

const mapStateToProps = (state) => ({
	walletInfo: getWalletInfo(state),
	loans: getMyLoans(state),
	isLoadingMyLoans: getIsLoadingMyLoans(state),
	isRefreshingMyLoans: getIsRefreshingMyLoans(state),
	myLoansLoadingError: getMyLoansLoadingError(state),
	isLoadedMyLoans: getIsLoadedMyLoans(state),
	contractType: getContractType(state),
	collateralPair: getLoansCollateralPair(state),
	networkId: getNetworkId(state),
});

const mapDispatchToProps = {
	fetchLoans,
	showWalletPopup,
};

export default connect(mapStateToProps, mapDispatchToProps)(Loans);
