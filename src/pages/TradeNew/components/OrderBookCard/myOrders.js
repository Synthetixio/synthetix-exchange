import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import Tooltip from '@material-ui/core/Tooltip';

import {
	getPendingTransactions,
	getTransactions,
	removePendingTransaction,
	updateTransaction,
} from 'src/ducks/transaction';
import { getWalletInfo, getNetworkId } from 'src/ducks/wallet/walletDetails';

import { formatCurrency } from 'src/utils/formatters';
import { getEtherscanTxLink } from 'src/utils/explorers';

import Table from 'src/components/Table';
import { TABLE_PALETTE } from 'src/components/Table/constants';

import Currency from 'src/components/Currency';

import ViewLink, { ArrowIcon } from './ViewLink';

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

const MyOrders = ({ transactions, networkId }) => {
	const { t } = useTranslation();
	return (
		<Table
			data={transactions}
			palette={TABLE_PALETTE.STRIPED}
			cellHeight={'38px'}
			columns={[
				{
					Header: t('trade.order-book-card.table.date'),
					accessor: 'date',
					Cell: cellProps => format(cellProps.cell.value, 'DD-MM-YY | HH:mm'),
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
					Cell: cellProps =>
						formatCurrency(cellProps.cell.value, getPrecision(cellProps.cell.value)),
					sortable: true,
				},
				{
					Header: t('trade.order-book-card.table.selling'),
					accessor: 'fromAmount',
					Cell: cellProps =>
						formatCurrency(cellProps.cell.value, getPrecision(cellProps.cell.value)),
					sortable: true,
				},
				{
					Header: t('trade.order-book-card.table.price'),
					accessor: 'priceUSD',
					Cell: cellProps => (
						<Tooltip title={formatCurrency(cellProps.cell.value, 8)} placement="top">
							<span>
								${formatCurrency(cellProps.cell.value, getPrecision(cellProps.cell.value))}
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
					Header: t('trade.order-book-card.table.verify'),
					accessor: 'hash',
					Cell: cellProps => (
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
		></Table>
	);
};

const mapStateToProps = state => {
	return {
		networkId: getNetworkId(state),
		transactions: getTransactions(state),
		pendingTransactions: getPendingTransactions(state),
		walletInfo: getWalletInfo(state),
	};
};

const mapDispatchToProps = {
	updateTransaction,
	removePendingTransaction,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyOrders);
