import React, { useMemo } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import get from 'lodash/get';
import orderBy from 'lodash/orderBy';

import { getPendingTransactions, getTransactions, updateTransaction } from 'src/ducks/transaction';
import { getWalletInfo } from 'src/ducks/wallet/walletDetails';
import { getAvailableSynthsMap } from 'src/ducks/synths';

import {
	formatCurrency,
	formatTxTimestamp,
	LONG_CRYPTO_CURRENCY_DECIMALS,
	formatCurrencyWithSign,
	formatCurrencyWithKey,
} from 'src/utils/formatters';

import Table from 'src/components/Table';
import { TABLE_PALETTE } from 'src/components/Table/constants';

import Currency from 'src/components/Currency';
import { SYNTHS_MAP } from 'src/constants/currency';

import ViewLink from './ViewLink';

const countDecimals = value => {
	if (Math.floor(value) === value) return 0;
	return value.toString().split('.')[1].length || 0;
};

const getPrecision = amount => {
	const amountToNumber = Number(amount);
	if (amountToNumber >= 1000 || countDecimals(amountToNumber) === 0) return 0;
	if (countDecimals(amountToNumber) <= 2) return 2;
	return 4;
};

const MyOrders = ({ transactions, synthsMap, isMobile = false }) => {
	const { t } = useTranslation();

	const orderedTransactions = useMemo(() => orderBy(transactions, 'id', 'desc'), [transactions]);

	const columns = useMemo(
		() =>
			isMobile
				? [
						{
							Header: t('trade.order-book-card.table.date'),
							accessor: 'date',
							Cell: cellProps => formatTxTimestamp(cellProps.cell.value),
							sortable: true,
						},
						{
							Header: t('trade.order-book-card.table.pair'),
							accessor: 'pair',
							Cell: cellProps => (
								<Currency.Pair
									baseCurrencyKey={cellProps.row.original.base}
									quoteCurrencyKey={cellProps.row.original.quote}
									showIcon={false}
								/>
							),
							sortable: true,
						},
						{
							Header: t('trade.order-book-card.table.total'),
							accessor: 'totalUSD',
							Cell: cellProps => <span>${cellProps.cell.value}</span>,
							sortable: true,
						},
						{
							Header: t('trade.order-book-card.table.status'),
							accessor: 'status',
							Cell: cellProps => t(`common.tx-status.${cellProps.cell.value}`),
							sortable: true,
						},
						{
							Header: t('trade.order-book-card.table.verify'),
							accessor: 'hash',
							Cell: cellProps => <ViewLink hash={cellProps.cell.value} />,
						},
				  ]
				: [
						{
							Header: t('trade.order-book-card.table.date'),
							accessor: 'date',
							Cell: cellProps => formatTxTimestamp(cellProps.cell.value),
							sortable: true,
						},
						{
							Header: t('trade.order-book-card.table.pair'),
							accessor: 'pair',
							Cell: cellProps => (
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
							Cell: cellProps => (
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
							Cell: cellProps => (
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
							Cell: cellProps => (
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
							Cell: cellProps => <span>${cellProps.cell.value}</span>,
							sortable: true,
						},
						{
							Header: t('trade.order-book-card.table.status'),
							accessor: 'status',
							Cell: cellProps => t(`common.tx-status.${cellProps.cell.value}`),
							sortable: true,
						},
						{
							Header: 'Confirmation time',
							accessor: 'confirmTxTime',
							Cell: cellProps => (
								<span>{cellProps.cell.value != null && `${cellProps.cell.value}ms`}</span>
							),
							sortable: true,
						},
						{
							Header: t('trade.order-book-card.table.verify'),
							accessor: 'hash',
							Cell: cellProps => <ViewLink hash={cellProps.cell.value} />,
						},
				  ],
		[isMobile, synthsMap, t]
	);

	return (
		<StyledTable
			data={orderedTransactions}
			palette={TABLE_PALETTE.STRIPED}
			columnsDeps={[orderedTransactions]}
			columns={columns}
		/>
	);
};

const StyledTable = styled(Table)`
	.table-body-cell {
		height: 38px;
	}
`;

const mapStateToProps = state => ({
	transactions: getTransactions(state),
	pendingTransactions: getPendingTransactions(state),
	walletInfo: getWalletInfo(state),
	synthsMap: getAvailableSynthsMap(state),
});

const mapDispatchToProps = {
	updateTransaction,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyOrders);
