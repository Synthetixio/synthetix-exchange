import React, { memo, FC } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';

import { getNetworkId } from 'ducks/wallet/walletDetails';

import Table from 'components/Table';
import Currency from 'components/Currency';

import { USD_SIGN } from 'constants/currency';

import { RootState } from 'ducks/types';
import { HistoricalTrade, HistoricalTrades } from 'ducks/trades/types';

import { TableNoResults } from 'shared/commonStyles';
import ViewLink, { ArrowIcon } from './ViewLink';

import { getEtherscanTxLink } from 'utils/explorers';
import {
	LONG_CRYPTO_CURRENCY_DECIMALS,
	SHORT_CRYPTO_CURRENCY_DECIMALS,
	formatCurrencyWithKey,
	formatTxTimestamp,
	formatCurrency,
	formatCurrencyWithSign,
} from 'utils/formatters';
import { CellProps } from 'react-table';

type StateProps = {
	networkId: number;
};

type Props = {
	trades: HistoricalTrades;
	isLoading: boolean;
	isLoaded: boolean;
};

type TradeHistoryProps = StateProps & Props;

const TradeHistory: FC<TradeHistoryProps> = memo(({ trades, isLoading, isLoaded, networkId }) => {
	const { t } = useTranslation();

	return (
		<StyledTable
			palette="striped"
			columns={[
				{
					Header: <>{t('assets.exchanges.table.date-time-col')}</>,
					accessor: 'timestamp',
					Cell: (cellProps: CellProps<HistoricalTrade, HistoricalTrade['timestamp']>) =>
						formatTxTimestamp(cellProps.cell.value),
					sortable: true,
				},
				{
					Header: <>{t('assets.exchanges.table.pair-col')}</>,
					id: 'trade-pair',
					Cell: (cellProps: CellProps<HistoricalTrade>) => {
						const { fromCurrencyKey, toCurrencyKey } = cellProps.row.original;

						return (
							<Currency.Pair baseCurrencyKey={fromCurrencyKey} quoteCurrencyKey={toCurrencyKey} />
						);
					},
				},
				{
					Header: <>{t('assets.exchanges.table.buying-col')}</>,
					accessor: 'toAmount',
					sortType: 'basic',
					Cell: (cellProps: CellProps<HistoricalTrade>) => (
						<Tooltip
							title={formatCurrency(cellProps.row.original.toAmount, LONG_CRYPTO_CURRENCY_DECIMALS)}
							placement="top"
						>
							<span>
								{formatCurrencyWithKey(
									cellProps.row.original.toCurrencyKey,
									cellProps.row.original.toAmount,
									SHORT_CRYPTO_CURRENCY_DECIMALS
								)}
							</span>
						</Tooltip>
					),
					sortable: true,
				},
				{
					Header: <>{t('assets.exchanges.table.selling-col')}</>,
					accessor: 'fromAmount',
					sortType: 'basic',
					Cell: (cellProps: CellProps<HistoricalTrade>) => (
						<Tooltip
							title={formatCurrency(
								cellProps.row.original.fromAmount,
								LONG_CRYPTO_CURRENCY_DECIMALS
							)}
							placement="top"
						>
							<span>
								{formatCurrencyWithKey(
									cellProps.row.original.fromCurrencyKey,
									cellProps.row.original.fromAmount,
									SHORT_CRYPTO_CURRENCY_DECIMALS
								)}
							</span>
						</Tooltip>
					),
					sortable: true,
				},
				{
					Header: <>{t('assets.exchanges.table.price-col')}</>,
					accessor: 'price',
					sortType: 'basic',
					Cell: (cellProps: CellProps<HistoricalTrade, HistoricalTrade['price']>) => (
						<span>{formatCurrencyWithSign(USD_SIGN, cellProps.cell.value)}</span>
					),
					sortable: true,
				},
				{
					Header: <>{t('assets.exchanges.table.total-col')}</>,
					accessor: 'amount',
					sortType: 'basic',
					Cell: (cellProps: CellProps<HistoricalTrade, HistoricalTrade['amount']>) => (
						<span>{formatCurrencyWithSign(USD_SIGN, cellProps.cell.value)}</span>
					),
					sortable: true,
				},
				{
					Header: <>{t('assets.exchanges.table.status-col')}</>,
					accessor: 'status',
					Cell: () => t('common.tx-status.complete'),
					sortable: true,
				},
				{
					Header: <>{t('assets.exchanges.table.verify-col')}</>,
					accessor: 'actions',
					Cell: (cellProps: CellProps<HistoricalTrade>) => (
						<ViewLink
							isDisabled={!cellProps.row.original.hash}
							href={getEtherscanTxLink(networkId, cellProps.row.original.hash)}
						>
							{t('common.transaction.view')}
							<ArrowIcon width="8" height="8" />
						</ViewLink>
					),
				},
			]}
			data={trades}
			isLoading={isLoading && !isLoaded}
			noResultsMessage={
				isLoaded && trades.length === 0 ? (
					<TableNoResults>{t('assets.exchanges.table.no-results')}</TableNoResults>
				) : undefined
			}
		/>
	);
});

const StyledTable = styled(Table)`
	position: initial;

	.table-body-cell {
		height: 38px;
	}
`;

const mapStateToProps = (state: RootState): StateProps => ({
	networkId: getNetworkId(state),
});

export default connect<StateProps, {}, {}, RootState>(mapStateToProps)(TradeHistory);
