import React, { memo, useMemo } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import get from 'lodash/get';
import Tooltip from '@material-ui/core/Tooltip';

import { getAvailableSynthsMap } from 'src/ducks/synths';
import { getNetworkId } from 'src/ducks/wallet/walletDetails';

import Table from 'src/components/Table';
import { TABLE_PALETTE } from 'src/components/Table/constants';
import Currency from 'src/components/Currency';
import Link from 'src/components/Link';

import { SYNTHS_MAP } from 'src/constants/currency';

import { TableNoResults } from 'src/shared/commonStyles';

import ViewLink from './ViewLink';

import {
	LONG_CRYPTO_CURRENCY_DECIMALS,
	SHORT_CRYPTO_CURRENCY_DECIMALS,
	formatCurrencyWithKey,
	formatTxTimestamp,
	formatCurrency,
	formatCurrencyWithSign,
	formatCurrencyPair,
} from 'src/utils/formatters';

const TradeHistory = memo(
	({ trades, isLoading, isLoaded, synthsMap, showTwitterHandle = false }) => {
		const { t } = useTranslation();

		const columns = useMemo(() => {
			const cols = [
				{
					Header: t('assets.exchanges.table.date-time-col'),
					accessor: 'timestamp',
					Cell: cellProps => formatTxTimestamp(cellProps.cell.value),
					sortable: true,
				},
				{
					Header: t('assets.exchanges.table.pair-col'),
					accessor: d => formatCurrencyPair(d.toCurrencyKey, d.fromCurrencyKey),
					Cell: cellProps => {
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
					sortable: true,
					Cell: cellProps => (
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
				},
				{
					Header: t('assets.exchanges.table.selling-col'),
					accessor: 'fromAmount',
					sortType: 'basic',
					sortable: true,
					Cell: cellProps => (
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
				},
				{
					Header: t('assets.exchanges.table.price-col'),
					accessor: 'price',
					sortType: 'basic',
					sortable: true,
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
					sortType: 'basic',
					sortable: true,
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
					Header: t('assets.exchanges.table.status-col'),
					accessor: 'status',
					Cell: () => t('common.tx-status.complete'),
					sortable: true,
					width: 100,
				},
				{
					Header: t('trade.order-book-card.table.verify'),
					accessor: 'hash',
					Cell: cellProps => <ViewLink hash={cellProps.cell.value} />,
					width: 100,
				},
			];

			if (showTwitterHandle) {
				cols.push({
					Header: <span>Twitter handle</span>,
					accessor: 'twitterHandle',
					show: false,
					Cell: cellProps => {
						const twitterHandle = cellProps.cell.value;

						return twitterHandle ? (
							<StyledLink to={`https://twitter.com/${cellProps.cell.value}`} isExternal={true}>
								@{cellProps.cell.value}
							</StyledLink>
						) : (
							'-'
						);
					},
				});
			}
			return cols;
			// eslint-disable-next-line
		}, [showTwitterHandle]);

		return (
			<StyledTable
				palette={TABLE_PALETTE.STRIPED}
				columns={columns}
				data={trades}
				isLoading={isLoading && !isLoaded}
				noResultsMessage={
					isLoaded && trades.length === 0 ? (
						<TableNoResults>{t('assets.exchanges.table.no-results')}</TableNoResults>
					) : undefined
				}
			/>
		);
	}
);

const StyledLink = styled(Link)`
	color: ${props => props.theme.colors.hyperlink};
`;

const StyledTable = styled(Table)`
	position: initial;
	.table-body-cell {
		height: 38px;
	}
`;

const mapStateToProps = state => ({
	synthsMap: getAvailableSynthsMap(state),
	networkId: getNetworkId(state),
});

export default connect(mapStateToProps, null)(TradeHistory);
