import React, { useMemo, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useTable, useFlexLayout, useSortBy } from 'react-table';
import Tooltip from '@material-ui/core/Tooltip';

import { ReactComponent as NoWalletIcon } from 'src/assets/images/no-wallet.svg';
import { ReactComponent as ErrorCircleIcon } from 'src/assets/images/error-circle.svg';
import { ReactComponent as SortDownIcon } from 'src/assets/images/sort-down.svg';
import { ReactComponent as SortUpIcon } from 'src/assets/images/sort-up.svg';
import { ReactComponent as SortIcon } from 'src/assets/images/sort.svg';

import Card from 'src/components/Card';
import { ButtonPrimarySmall } from 'src/components/Button';
import { HeadingSmall } from 'src/components/Typography';
import Spinner from 'src/components/Spinner';

import { absoluteCenteredCSS, TableNoResults } from 'src/shared/commonStyles';

import {
	fetchLoans,
	getMyLoans,
	getIsLoadingMyLoans,
	getIsRefreshingMyLoans,
	getMyLoansLoadingError,
	getIsLoadedMyLoans,
	LOAN_STATUS,
} from 'src/ducks/loans/myLoans';
import { getWalletInfo } from 'src/ducks/wallet/walletDetails';
import { showWalletPopup } from 'src/ducks/ui';

import { formatTxTimestamp, formatCurrencyWithKey, formatCurrency } from 'src/utils/formatters';

import { CARD_HEIGHT } from 'src/constants/ui';

export const MyLoans = ({
	onSelectLoan,
	selectedLoan,
	fetchLoans,
	walletInfo: { currentWallet },
	loans,
	collateralPair,
	isLoadingMyLoans,
	isRefreshingMyLoans,
	myLoansLoadingError,
	isLoadedMyLoans,
	showWalletPopup,
}) => {
	const { t } = useTranslation();
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
				Header: t('loans.my-loans.table.current-interest-fee-col'),
				accessor: 'currentInterest',
				Cell: cellProps => (
					<Tooltip title={formatCurrency(cellProps.cell.value, 18)}>
						<span>{formatCurrencyWithKey(loanCurrencyKey, cellProps.cell.value, 4)}</span>
					</Tooltip>
				),
				width: 150,
				sortable: true,
			},
			{
				Header: t('loans.my-loans.table.fees-payable-col'),
				accessor: 'feesPayable',
				Cell: cellProps => (
					<Tooltip title={formatCurrency(cellProps.cell.value, 18)}>
						<span>{formatCurrencyWithKey(loanCurrencyKey, cellProps.cell.value, 4)}</span>
					</Tooltip>
				),
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

	useEffect(() => {
		if (currentWallet) {
			fetchLoans();
		}
	}, [fetchLoans, currentWallet]);

	return (
		<StyledCard>
			<Card.Header>
				<HeadingSmall>{t('loans.my-loans.title')}</HeadingSmall>
				{isRefreshingMyLoans && <Spinner size="sm" />}
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
					{isLoadedMyLoans && rows.length > 0 ? (
						<TableBody {...getTableBodyProps()}>
							{rows.map(row => {
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
						isLoadedMyLoans && (
							<TableNoResults>{t('loans.my-loans.table.no-results')}</TableNoResults>
						)
					)}
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
	${props =>
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
	background: ${props => props.theme.colors.surfaceL3};
	margin-bottom: 8px;
`;

const TableBody = styled.div`
	max-height: calc(100% - 40px);
	overflow-y: auto;
	overflow-x: hidden;
`;

const TableBodyRow = styled(TableRow)`
	background: ${props =>
		props.isSelectedLoan ? props.theme.colors.accentL1 : props.theme.colors.surfaceL3};
	&:hover {
		background: ${props => props.theme.colors.accentL1};
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
	background: ${props => props.theme.colors.surfaceL3};
`;

const MessageContainer = styled.div`
	display: grid;
	grid-auto-flow: row;
	grid-gap: 20px;
	width: 300px;
	justify-items: center;
	padding: 30px;
	background: ${props => props.theme.colors.surfaceL3};
	${absoluteCenteredCSS};
`;

const MessageLabel = styled.div`
	font-size: 15px;
	color: ${props => props.theme.colors.fontPrimary};
`;

const SortIconContainer = styled.span`
	display: flex;
	align-items: center;
	margin-left: 5px;
`;

MyLoans.propTypes = {
	onSelectLoan: PropTypes.func.isRequired,
	selectedLoan: PropTypes.object,
	collateralPair: PropTypes.object,
	isLoadingMyLoans: PropTypes.bool,
	isRefreshingMyLoans: PropTypes.bool,
	myLoansLoadingError: PropTypes.string,
	isLoadedMyLoans: PropTypes.bool,
};

const mapStateToProps = state => ({
	walletInfo: getWalletInfo(state),
	loans: getMyLoans(state),
	isLoadingMyLoans: getIsLoadingMyLoans(state),
	isRefreshingMyLoans: getIsRefreshingMyLoans(state),
	myLoansLoadingError: getMyLoansLoadingError(state),
	isLoadedMyLoans: getIsLoadedMyLoans(state),
});

const mapDispatchToProps = {
	fetchLoans,
	showWalletPopup,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyLoans);
