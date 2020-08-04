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
import uniqWith from 'lodash/uniqWith';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';

import { getTransactions, getGasInfo } from 'ducks/transaction';
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
	SHORT_CRYPTO_CURRENCY_DECIMALS,
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
import { ESTIMATE_VALUE } from 'constants/placeholder';
import { normalizeGasLimit } from 'utils/transactions';
import { GWEI_UNIT } from 'utils/networkUtils';

const mapStateToProps = (state: RootState) => ({
	networkId: getNetworkId(state),
	transactions: getTransactions(state),
	currentWalletAddress: getCurrentWalletAddress(state),
	isWalletConnected: getIsWalletConnected(state),
	exchangeRates: getRatesExchangeRates(state),
	gasInfo: getGasInfo(state),
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type MyOrdersProps = PropsFromRedux;

const MyOrders: FC<MyOrdersProps> = ({
	transactions,
	networkId,
	currentWalletAddress,
	isWalletConnected,
	exchangeRates,
	gasInfo,
}) => {
	console.log(gasInfo);
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
					price: limitPrice,
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
		let combinedTransactions = transactions;

		if (limitOrders.status === 'success' && limitOrders.data && limitOrders.data.length) {
			const optimisticOrders = groupBy(transactions, 'orderType');
			const optimisticLimitOrders = optimisticOrders.limit ?? [];
			const optimisticMarketOrders = optimisticOrders.market ?? [];

			combinedTransactions = [
				// ensure unique orderIds for limit orders (when the graph + optimistic transactions are mixed)
				...uniqWith(
					[...limitOrders.data, ...optimisticLimitOrders],
					(arrVal: Transaction, othVal: Transaction) =>
						// optimistic transaction that are still in the pending phase have no orderId. we still want to show them.
						!arrVal.orderId ? false : arrVal.orderId === othVal.orderId
				),
				...optimisticMarketOrders,
			];
		}
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
			const gasEstimate = await limitOrdersContractWithSigner.estimate.cancelOrder(orderId);

			const tx = await limitOrdersContractWithSigner.cancelOrder(orderId, {
				gasPrice: gasInfo.gasPrice * GWEI_UNIT,
				gasLimit: normalizeGasLimit(Number(gasEstimate)),
			});
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
					Cell: (cellProps: CellProps<Transaction, Transaction['priceUSD']>) => {
						const { orderType, price, quote } = cellProps.row.original;

						const isLimitOrder = orderType === 'limit';

						const shouldShowPrice = isLimitOrder && quote !== SYNTHS_MAP.sUSD;
						const usdPrice = <span>{formatCurrencyWithSign(USD_SIGN, cellProps.cell.value)}</span>;

						return shouldShowPrice ? (
							<span>
								<Tooltip title={price} placement="top">
									<span>{price.toFixed(SHORT_CRYPTO_CURRENCY_DECIMALS)}</span>
								</Tooltip>{' '}
								({ESTIMATE_VALUE} {usdPrice})
							</span>
						) : (
							usdPrice
						);
					},
					width: 200,
					sortable: true,
				},
				{
					Header: <>{t('trade.order-book-card.table.total')}</>,
					accessor: 'totalUSD',
					sortType: 'basic',
					Cell: (cellProps: CellProps<Transaction, Transaction['totalUSD']>) => {
						const { orderType, quote } = cellProps.row.original;
						const isLimitOrder = orderType === 'limit';

						const prefix = isLimitOrder && quote !== SYNTHS_MAP.sUSD ? `${ESTIMATE_VALUE} ` : '';

						return (
							<span>
								{prefix}
								{formatCurrencyWithSign(USD_SIGN, cellProps.cell.value)}
							</span>
						);
					},
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
			columnsDeps={[gasInfo]}
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
