import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import orderBy from 'lodash/orderBy';
import snxData from 'synthetix-data';
import { useQuery } from 'react-query';
import { CellProps } from 'react-table';
import { useImmer } from 'use-immer';
import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy';
import get from 'lodash/get';

import { getTransactions, updateTransaction } from 'ducks/transaction';
import {
	getNetworkId,
	getIsWalletConnected,
	getCurrentWalletAddress,
} from 'ducks/wallet/walletDetails';

import {
	formatCurrency,
	formatTxTimestamp,
	LONG_CRYPTO_CURRENCY_DECIMALS,
	formatCurrencyWithSign,
	formatCurrencyWithKey,
} from 'utils/formatters';
import { getEtherscanTxLink } from 'utils/explorers';

import Table from 'components/Table';
import Currency from 'components/Currency';

import { USD_SIGN, SYNTHS_MAP } from 'constants/currency';
import { TRANSACTION_STATUS, Transactions, LimitOrders, Transaction } from 'constants/transaction';
import QUERY_KEYS from 'constants/queryKeys';

import { TableNoResults, TextButton } from 'shared/commonStyles';

import { RootState } from 'ducks/types';
import snxJSConnector from 'utils/snxJSConnector';

import ViewLink, { ArrowIcon } from './ViewLink';
import { getRatesExchangeRates } from 'ducks/rates';

const mapStateToProps = (state: RootState) => ({
	networkId: getNetworkId(state),
	transactions: getTransactions(state),
	currentWalletAddress: getCurrentWalletAddress(state),
	isWalletConnected: getIsWalletConnected(state),
	exchangeRates: getRatesExchangeRates(state),
});

const mapDispatchToProps = {
	updateTransaction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type MyOrdersProps = PropsFromRedux;

const MyOrders: FC<MyOrdersProps> = ({
	transactions,
	networkId,
	updateTransaction,
	currentWalletAddress,
	isWalletConnected,
	exchangeRates,
}) => {
	const { t } = useTranslation();

	// this allows for overriding certain transaction info for both optimistic updates and the fetched data from the graph.
	const [overrideTransactionInfo, setOverrideTransactionInfo] = useImmer<
		Record<
			number,
			{
				status: Transaction['status'];
				hash?: Transaction['hash'];
			}
		>
	>({});

	const limitOrdersQueryKey = QUERY_KEYS.Trades.LimitOrders(currentWalletAddress || '');

	const limitOrders = useQuery<Transactions, any>(
		limitOrdersQueryKey,
		async () => {
			const orders = (await snxData.limitOrders.orders({
				account: currentWalletAddress,
			})) as LimitOrders;

			return orders.map((order) => {
				const baseCurrencyKey = order.destinationCurrencyKey;
				const quoteCurrencyKey = order.sourceCurrencyKey;

				const baseAmount = order.minDestinationAmount;
				const quoteAmount = order.sourceAmount;

				const baseExchangeRateInUSD = get(exchangeRates, [baseCurrencyKey], 0);
				const quoteExchangeRateInUSD = get(exchangeRates, [quoteCurrencyKey], 0);

				const isBaseCurrencySUSD = order.destinationCurrencyKey === SYNTHS_MAP.sUSD;
				const limitPrice = quoteAmount / baseAmount;

				const priceUSD = isBaseCurrencySUSD
					? (1 / limitPrice) * baseExchangeRateInUSD
					: limitPrice * quoteExchangeRateInUSD;

				const totalUSD = baseAmount * (isBaseCurrencySUSD ? baseExchangeRateInUSD : priceUSD);

				return {
					timestamp: order.timestamp,
					orderId: order.id,
					base: baseCurrencyKey,
					quote: quoteCurrencyKey,
					fromAmount: quoteAmount,
					toAmount: baseAmount,
					orderType: 'limit',
					priceUSD,
					totalUSD,
					hash: order.hash,
					status: order.status,
				};
			});
		},
		{
			enabled: isWalletConnected,
		}
	);

	const orderedTransactions = useMemo(() => {
		const combinedTransactions =
			limitOrders.status === 'success'
				? [
						// ensure unique orderIds for limit orders (when the graph + optimistic transactions are mixed)
						// TODO: maybe remove the optimistic transaction from the transactions in an effect
						...uniqBy(
							[
								...limitOrders.data,
								...transactions.filter(
									(transaction: Transaction) => transaction.orderType === 'limit'
								),
							],
							'orderId'
						),
						// add market orders
						...transactions.filter(
							(transaction: Transaction) => transaction.orderType === 'market'
						),
				  ]
				: transactions;

		const orderedTransactions = orderBy(combinedTransactions, 'timestamp', 'desc') as Transactions;

		return !isEmpty(overrideTransactionInfo)
			? orderedTransactions.map((transaction) => ({
					...transaction,
					...overrideTransactionInfo[transaction.orderId],
			  }))
			: orderedTransactions;
	}, [transactions, limitOrders.status, limitOrders.data, overrideTransactionInfo]);

	const handleCancelLimitOrder = async (transaction: Transaction) => {
		const {
			utils: { waitForTransaction },
		} = snxJSConnector as any;

		const { orderId } = transaction;

		setOverrideTransactionInfo((draft) => {
			draft[orderId] = {
				status: TRANSACTION_STATUS.CANCELLING,
			};
		});

		const { limitOrdersContract } = snxJSConnector;
		const limitOrdersContractWithSigner = limitOrdersContract.connect(snxJSConnector.signer);

		try {
			const tx = await limitOrdersContractWithSigner.cancelOrder(orderId);
			const status = await waitForTransaction(tx.hash);
			if (status) {
				setOverrideTransactionInfo((draft) => {
					draft[orderId] = {
						status: TRANSACTION_STATUS.CANCELLED,
						hash: tx.hash,
					};
				});
			} else {
				setOverrideTransactionInfo((draft) => {
					delete draft[orderId];
				});
			}
		} catch (e) {
			console.log(e);
			setOverrideTransactionInfo((draft) => {
				delete draft[orderId];
			});
		}
	};

	return (
		<StyledTable
			data={orderedTransactions}
			palette="striped"
			columns={[
				{
					Header: <>{t('trade.order-book-card.table.date')}</>,
					accessor: 'timestamp',
					Cell: (cellProps: CellProps<Transaction, Transaction['timestamp']>) =>
						formatTxTimestamp(cellProps.cell.value),
					sortable: true,
				},
				{
					Header: <>{t('trade.order-book-card.table.pair')}</>,
					accessor: 'pair',
					Cell: (cellProps: CellProps<Transaction>) => (
						<Currency.Pair
							baseCurrencyKey={cellProps.row.original.base}
							quoteCurrencyKey={cellProps.row.original.quote}
							showIcon={true}
						/>
					),
					sortable: true,
				},
				{
					Header: <>{t('trade.order-book-card.table.type')}</>,
					accessor: 'orderType',
					Cell: (cellProps: CellProps<Transaction, Transaction['orderType']>) => (
						<span style={{ textTransform: 'uppercase' }}>{cellProps.cell.value}</span>
					),
					sortable: true,
				},
				{
					Header: <>{t('trade.order-book-card.table.buying')}</>,
					accessor: 'toAmount',
					sortType: 'basic',
					Cell: (cellProps: CellProps<Transaction, Transaction['toAmount']>) => (
						<Tooltip
							title={formatCurrency(cellProps.cell.value, LONG_CRYPTO_CURRENCY_DECIMALS)}
							placement="top"
						>
							<span>
								{formatCurrencyWithKey(cellProps.row.original.base, cellProps.cell.value)}
							</span>
						</Tooltip>
					),
					sortable: true,
				},
				{
					Header: <>{t('trade.order-book-card.table.selling')}</>,
					accessor: 'fromAmount',
					sortType: 'basic',
					Cell: (cellProps: CellProps<Transaction, Transaction['fromAmount']>) => (
						<Tooltip
							title={formatCurrency(cellProps.cell.value, LONG_CRYPTO_CURRENCY_DECIMALS)}
							placement="top"
						>
							<span>
								{formatCurrencyWithKey(cellProps.row.original.quote, cellProps.cell.value)}
							</span>
						</Tooltip>
					),
					sortable: true,
				},
				{
					Header: <>{t('trade.order-book-card.table.price')}</>,
					accessor: 'priceUSD',
					sortType: 'basic',
					Cell: (cellProps: CellProps<Transaction, Transaction['priceUSD']>) => (
						<Tooltip
							title={formatCurrency(cellProps.cell.value, LONG_CRYPTO_CURRENCY_DECIMALS)}
							placement="top"
						>
							<span>{formatCurrencyWithSign(USD_SIGN, cellProps.cell.value)}</span>
						</Tooltip>
					),
					sortable: true,
				},
				{
					Header: <>{t('trade.order-book-card.table.total')}</>,
					accessor: 'totalUSD',
					sortType: 'basic',
					Cell: (cellProps: CellProps<Transaction, Transaction['totalUSD']>) => (
						<span>{formatCurrencyWithSign(USD_SIGN, cellProps.cell.value)}</span>
					),
					sortable: true,
				},
				{
					Header: <>{t('trade.order-book-card.table.status')}</>,
					accessor: 'status',
					Cell: (cellProps: CellProps<Transaction, Transaction['status']>) =>
						t(`common.tx-status.${cellProps.cell.value}`),
					sortable: true,
				},
				{
					Header: <>{t('trade.order-book-card.table.cancel')}</>,
					id: 'cancel',
					Cell: (cellProps: CellProps<Transaction>) =>
						cellProps.row.original.orderType === 'limit' &&
						cellProps.row.original.status === TRANSACTION_STATUS.PENDING &&
						cellProps.row.original.orderId ? (
							<CancelButton onClick={() => handleCancelLimitOrder(cellProps.row.original)}>
								{t('trade.order-book-card.table.cancel')}
							</CancelButton>
						) : null,
				},
				{
					Header: <>{t('trade.order-book-card.table.verify')}</>,
					accessor: 'hash',
					Cell: (cellProps: CellProps<Transaction>) => (
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
			noResultsMessage={
				orderedTransactions.length === 0 ? (
					<TableNoResults>{t('trade.order-book-card.table.no-results')}</TableNoResults>
				) : undefined
			}
		/>
	);
};

const StyledTable = styled(Table)`
	.table-body-cell {
		height: 38px;
	}
`;

const CancelButton = styled(TextButton)`
	color: ${(props) => props.theme.colors.red};
	font-size: 12px;
`;

export default connector(MyOrders);
