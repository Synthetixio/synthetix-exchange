import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import get from 'lodash/get';

import { getAvailableSynthsMap } from 'src/ducks/synths';
import { getNetworkId } from 'src/ducks/wallet/walletDetails';

import Table from 'src/components/Table';
import { TABLE_PALETTE } from 'src/components/Table/constants';
import Currency from 'src/components/Currency';

import { SYNTHS_MAP } from 'src/constants/currency';

import { TableNoResults } from 'src/shared/commonStyles';
import ViewLink, { ArrowIcon } from './ViewLink';

import { getEtherscanTxLink } from 'src/utils/explorers';
import {
	formatTxTimestamp,
	formatCurrency,
	formatCurrencyWithSign,
	formatCurrencyPair,
} from 'src/utils/formatters';

const TradeHistory = ({ trades, isLoading, isLoaded, synthsMap, networkId }) => {
	const { t } = useTranslation();
	return (
		<StyledTable
			palette={TABLE_PALETTE.STRIPED}
			columns={[
				{
					Header: t('assets.exchanges.table.date-time-col'),
					accessor: 'timestamp',
					Cell: cellProps => formatTxTimestamp(cellProps.cell.value),
					sortable: true,
				},
				{
					Header: t('assets.exchanges.table.pair-col'),
					accessor: d => formatCurrencyPair(d.fromCurrencyKey, d.toCurrencyKey),
					Cell: cellProps => {
						const { fromCurrencyKey, toCurrencyKey } = cellProps.row.original;

						return (
							<Currency.Pair baseCurrencyKey={fromCurrencyKey} quoteCurrencyKey={toCurrencyKey} />
						);
					},
				},
				{
					Header: t('assets.exchanges.table.buying-col'),
					accessor: 'fromAmount',
					Cell: cellProps => <span>{formatCurrency(cellProps.row.original.fromAmount, 4)}</span>,
				},
				{
					Header: t('assets.exchanges.table.selling-col'),
					accessor: 'toAmount',
					Cell: cellProps => <span>{formatCurrency(cellProps.row.original.toAmount, 4)}</span>,
				},
				{
					Header: t('assets.exchanges.table.price-col'),
					accessor: 'price',
					Cell: cellProps => (
						<span>
							{formatCurrencyWithSign(
								get(synthsMap, [SYNTHS_MAP.sUSD, 'sign']),
								cellProps.cell.value
							)}
						</span>
					),
				},
				{
					Header: t('assets.exchanges.table.total-col'),
					accessor: 'amount',
					Cell: cellProps => (
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
					Cell: cellProps => (
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
			isLoading={isLoading}
			noResultsMessage={
				isLoaded && trades.length === 0 ? (
					<TableNoResults>{t('assets.exchanges.table.no-results')}</TableNoResults>
				) : (
					undefined
				)
			}
		/>
	);
};

const StyledTable = styled(Table)`
	.table-body-cell {
		height: 38px;
	}
`;

const mapStateToProps = state => ({
	synthsMap: getAvailableSynthsMap(state),
	networkId: getNetworkId(state),
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TradeHistory);
