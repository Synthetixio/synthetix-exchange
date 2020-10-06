import React, { useMemo, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
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
	fetchLiquidations,
	getLiquidations,
	getIsLoadingLiquidations,
	getIsRefreshingLiquidations,
	getLiquidationsLoadingError,
	getIsLoadedLiquidations,
} from 'ducks/loans/allLiquidations';

import { getWalletInfo } from 'ducks/wallet/walletDetails';
import { showWalletPopup } from 'ducks/ui';

import { formatCurrencyWithKey, truncateAddress, formatCurrency } from 'utils/formatters';

import { CARD_HEIGHT } from 'constants/ui';
import { getContractType, getLoansCollateralPair } from 'ducks/loans/contractInfo';
import Activity from '../Activity';
import { VIEWS } from 'pages/Loans/Loans';

const Liquidations = ({
	onSelectLiquidation,
	selectedLiquidation,
	fetchLiquidations,
	walletInfo: { currentWallet },
	liquidations,
	collateralPair,
	isLoadedLiquidations,
	liquidationsLoadingError,
	isLoadingLiquidations,
	showWalletPopup,
	contractType,
	setView,
}) => {
	const { t } = useTranslation();
	const { collateralCurrencyKey, loanCurrencyKey } = collateralPair;

	const columns = useMemo(
		() => [
			{
				Header: <>{t('loans.liquidations.table.address-col')}</>,
				accessor: 'account',
				Cell: (cellProps) => {
					return truncateAddress(cellProps.cell.value);
				},
				width: 150,
				sortable: true,
			},
			{
				Header: <>{t('loans.liquidations.table.c-ratio-col')}</>,
				accessor: 'cRatioPercentage',
				Cell: (cellProps) => `${cellProps.cell.value}%`,
				width: 150,
				sortable: true,
			},
			{
				Header: <>{t('loans.liquidations.table.collateral-col')}</>,
				accessor: 'collateralAmount',
				Cell: (cellProps) => (
					<Tooltip title={formatCurrency(cellProps.cell.value, 18)}>
						<span>{formatCurrencyWithKey(collateralCurrencyKey, cellProps.cell.value)}</span>
					</Tooltip>
				),
				width: 150,
				sortable: true,
			},
			{
				Header: <>{t('loans.liquidations.table.debt-col')}</>,
				accessor: 'totalDebtToCover',
				Cell: (cellProps) => (
					<Tooltip title={formatCurrency(cellProps.cell.value, 18)}>
						<span>{formatCurrencyWithKey(loanCurrencyKey, cellProps.cell.value)}</span>
					</Tooltip>
				),
				width: 150,
				sortable: true,
			},
			{
				id: 'action',
				Cell: ({ row, rows, toggleRowExpanded }) => {
					const liquidationsData = row.original;
					return (
						<>
							<ButtonPrimarySmall
								style={{
									marginRight: 16,
								}}
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
							<ButtonPrimarySmall
								onClick={() => {
									setView(VIEWS.LIQUIDATIONS);
									onSelectLiquidation(liquidationsData);
								}}
							>
								{t('loans.liquidations.table.liquidate')}
							</ButtonPrimarySmall>
						</>
					);
				},
			},
		],
		[collateralCurrencyKey, loanCurrencyKey, setView, t, onSelectLiquidation]
	);

	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
		{
			columns,
			data: liquidations,
			initialState: {
				sortBy: [{ id: 'cRatio', desc: false }],
			},
		},
		useSortBy,
		useExpanded,
		useFlexLayout
	);

	useEffect(() => {
		if (currentWallet) {
			fetchLiquidations();
		}
	}, [fetchLiquidations, currentWallet, contractType]);

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
			{!isLoadingLiquidations && isLoadedLiquidations && rows.length > 0 ? (
				<TableBody {...getTableBodyProps()}>
					{rows.map((row) => {
						prepareRow(row);
						return (
							<div key={row.id}>
								<TableBodyRow
									{...row.getRowProps()}
									className="tr"
									isSelectedLiquidation={
										selectedLiquidation != null && selectedLiquidation.id === row.original.id
									}
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
			) : liquidationsLoadingError ? (
				<MessageContainer>
					<ErrorCircleIcon />
					<MessageLabel>{t('common.errors.error-loading')}</MessageLabel>
					<ButtonPrimarySmall onClick={() => fetchLiquidations()}>
						{t('common.actions.click-to-retry')}
					</ButtonPrimarySmall>
				</MessageContainer>
			) : isLoadingLiquidations && !isLoadedLiquidations ? (
				<HeaderSpinner size="sm" centered={true} />
			) : (
				rows.length === 0 &&
				isLoadedLiquidations && (
					<TableNoResults>{t('loans.liquidations.table.no-results')}</TableNoResults>
				)
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
		props.isSelectedLiquidation ? props.theme.colors.accentL1 : props.theme.colors.surfaceL3};
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

const mapStateToProps = (state) => ({
	walletInfo: getWalletInfo(state),
	liquidations: getLiquidations(state),
	isLoadingLiquidations: getIsLoadingLiquidations(state),
	isRefreshingLiquidations: getIsRefreshingLiquidations(state),
	liquidationsLoadingError: getLiquidationsLoadingError(state),
	isLoadedLiquidations: getIsLoadedLiquidations(state),
	contractType: getContractType(state),
	collateralPair: getLoansCollateralPair(state),
});

const mapDispatchToProps = {
	fetchLiquidations,
	showWalletPopup,
};

export default connect(mapStateToProps, mapDispatchToProps)(Liquidations);
