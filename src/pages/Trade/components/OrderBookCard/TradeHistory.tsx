import React, { FC } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import get from 'lodash/get';
import Tooltip from '@material-ui/core/Tooltip';

import { getAvailableSynthsMap, SynthDefinition } from 'ducks/synths';
import { getNetworkId } from 'ducks/wallet/walletDetails';

import Table from 'components/Table';
import { TABLE_PALETTE } from 'components/Table/constants';
import Currency from 'components/Currency';

import { SYNTHS_MAP } from 'constants/currency';

import { RootState } from 'ducks/types';
import { HistoricalTrades } from 'ducks/trades/types';

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
	formatCurrencyPair,
} from 'utils/formatters';

type StateProps = {
	networkId: number;
	synthsMap: Record<string, SynthDefinition>;
};

type Props = {
	trades: HistoricalTrades;
	isLoading: boolean;
	isLoaded: boolean;
};

type TradeHistoryProps = StateProps & Props;

const TradeHistory: FC<TradeHistoryProps> = ({
	trades,
	isLoading,
	isLoaded,
	synthsMap,
	networkId,
}) => {
	const { t } = useTranslation();

	return (
		<StyledTable<any>
			palette={TABLE_PALETTE.STRIPED}
			columns={[
				{
					Header: t('assets.exchanges.table.date-time-col'),
					accessor: 'timestamp',
					Cell: (cellProps: any) => formatTxTimestamp(cellProps.cell.value),
					sortable: true,
				},
				{
					Header: t('assets.exchanges.table.pair-col'),
					accessor: (d: any) => formatCurrencyPair(d.toCurrencyKey, d.fromCurrencyKey),
					Cell: (cellProps: any) => {
						const { fromCurrencyKey, toCurrencyKey } = cellProps.row.original;

						return (
							<Currency.Pair baseCurrencyKey={fromCurrencyKey} quoteCurrencyKey={toCurrencyKey} />
						);
					},
				},
				{
					Header: t('assets.exchanges.table.buying-col'),
					accessor: 'toAmount',
					sortType: 'basic',
					Cell: (cellProps: any) => (
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
					Header: t('assets.exchanges.table.selling-col'),
					accessor: 'fromAmount',
					sortType: 'basic',
					Cell: (cellProps: any) => (
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
					Header: t('assets.exchanges.table.price-col'),
					accessor: 'price',
					sortType: 'basic',
					Cell: (cellProps: any) => (
						<span>
							{formatCurrencyWithSign(
								get(synthsMap, [SYNTHS_MAP.sUSD, 'sign']),
								cellProps.cell.value
							)}
						</span>
					),
					sortable: true,
				},
				{
					Header: t('assets.exchanges.table.total-col'),
					accessor: 'amount',
					sortType: 'basic',
					Cell: (cellProps: any) => (
						<span>
							{formatCurrencyWithSign(
								get(synthsMap, [SYNTHS_MAP.sUSD, 'sign']),
								cellProps.cell.value
							)}
						</span>
					),
					sortable: true,
				},
				{
					Header: t('assets.exchanges.table.status-col'),
					accessor: 'status',
					Cell: () => t('common.tx-status.complete'),
					sortable: true,
				},
				{
					Header: t('assets.exchanges.table.verify-col'),
					accessor: 'actions',
					Cell: (cellProps: any) => (
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
};

const StyledTable = styled(Table)`
	position: initial;

	.table-body-cell {
		height: 38px;
	}
`;

const mapStateToProps = (state: RootState): StateProps => ({
	synthsMap: getAvailableSynthsMap(state),
	networkId: getNetworkId(state),
});

export default connect<StateProps, {}, {}, RootState>(mapStateToProps)(TradeHistory);
