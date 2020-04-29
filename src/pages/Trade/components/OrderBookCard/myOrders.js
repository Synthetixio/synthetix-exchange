import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import get from 'lodash/get';

import {
	getPendingTransactions,
	getTransactions,
	removePendingTransaction,
	updateTransaction,
} from 'ducks/transaction';
import { getWalletInfo, getNetworkId } from 'ducks/wallet/walletDetails';
import { getAvailableSynthsMap } from 'ducks/synths';

import {
	formatCurrency,
	formatTxTimestamp,
	LONG_CRYPTO_CURRENCY_DECIMALS,
	formatCurrencyWithSign,
	formatCurrencyWithKey,
} from 'utils/formatters';
import { getEtherscanTxLink } from 'utils/explorers';

import Table from 'components/Table';
import { TABLE_PALETTE } from 'components/Table/constants';

import Currency from 'components/Currency';
import { SYNTHS_MAP } from 'constants/currency';

import ViewLink, { ArrowIcon } from './ViewLink';

const countDecimals = (value) => {
	if (Math.floor(value) === value) return 0;
	return value.toString().split('.')[1].length || 0;
};

const getPrecision = (amount) => {
	const amountToNumber = Number(amount);
	if (amountToNumber >= 1000 || countDecimals(amountToNumber) === 0) return 0;
	if (countDecimals(amountToNumber) <= 2) return 2;
	return 4;
};

const MyOrders = ({ transactions, networkId, synthsMap }) => {
	const { t } = useTranslation();
	return (
		<StyledTable
			data={transactions}
			palette={TABLE_PALETTE.STRIPED}
			columns={[
				{
					Header: t('trade.order-book-card.table.date'),
					accessor: 'date',
					Cell: (cellProps) => formatTxTimestamp(cellProps.cell.value),
					sortable: true,
				},
				{
					Header: t('trade.order-book-card.table.pair'),
					accessor: 'pair',
					Cell: (cellProps) => (
						<Currency.Pair
							baseCurrencyKey={cellProps.row.original.base}
							quoteCurrencyKey={cellProps.row.original.quote}
							showIcon={true}
						/>
					),
					sortable: true,
				},
				{
					Header: t('trade.order-book-card.table.buying'),
					accessor: 'toAmount',
					sortType: 'basic',
					Cell: (cellProps) => (
						<Tooltip
							title={formatCurrency(cellProps.cell.value, LONG_CRYPTO_CURRENCY_DECIMALS)}
							placement="top"
						>
							<span>
								{formatCurrencyWithKey(
									cellProps.row.original.base,
									cellProps.cell.value,
									getPrecision(cellProps.cell.value)
								)}
							</span>
						</Tooltip>
					),
					sortable: true,
				},
				{
					Header: t('trade.order-book-card.table.selling'),
					accessor: 'fromAmount',
					sortType: 'basic',
					Cell: (cellProps) => (
						<Tooltip
							title={formatCurrency(cellProps.cell.value, LONG_CRYPTO_CURRENCY_DECIMALS)}
							placement="top"
						>
							<span>
								{formatCurrencyWithKey(
									cellProps.row.original.quote,
									cellProps.cell.value,
									getPrecision(cellProps.cell.value)
								)}
							</span>
						</Tooltip>
					),
					sortable: true,
				},
				{
					Header: t('trade.order-book-card.table.price'),
					accessor: 'priceUSD',
					sortType: 'basic',
					Cell: (cellProps) => (
						<Tooltip
							title={formatCurrency(cellProps.cell.value, LONG_CRYPTO_CURRENCY_DECIMALS)}
							placement="top"
						>
							<span>
								{formatCurrencyWithSign(
									get(synthsMap, [SYNTHS_MAP.sUSD, 'sign']),
									cellProps.cell.value,
									getPrecision(cellProps.cell.value)
								)}
							</span>
						</Tooltip>
					),
					sortable: true,
				},
				{
					Header: t('trade.order-book-card.table.total'),
					accessor: 'totalUSD',
					sortType: 'basic',
					Cell: (cellProps) => <span>${cellProps.cell.value}</span>,
					sortable: true,
				},
				{
					Header: t('trade.order-book-card.table.status'),
					accessor: 'status',
					Cell: (cellProps) => t(`common.tx-status.${cellProps.cell.value}`),
					sortable: true,
				},
				{
					Header: t('trade.order-book-card.table.verify'),
					accessor: 'hash',
					Cell: (cellProps) => (
						<ViewLink
							isDisabled={!cellProps.cell.value}
							href={getEtherscanTxLink(networkId, cellProps.cell.value)}
						>
							{t('common.transaction.view')}
							<ArrowIcon width="8" height="8" />
						</ViewLink>
					),
				},
			]}
		></StyledTable>
	);
};

const StyledTable = styled(Table)`
	.table-body-cell {
		height: 38px;
	}
`;

const mapStateToProps = (state) => ({
	networkId: getNetworkId(state),
	transactions: getTransactions(state),
	pendingTransactions: getPendingTransactions(state),
	walletInfo: getWalletInfo(state),
	synthsMap: getAvailableSynthsMap(state),
});

const mapDispatchToProps = {
	updateTransaction,
	removePendingTransaction,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyOrders);
