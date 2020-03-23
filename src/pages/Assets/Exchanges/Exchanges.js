import React, { memo, useEffect } from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';

import { SYNTHS_MAP } from 'src/constants/currency';

import Table from 'src/components/Table';
import { TABLE_PALETTE } from 'src/components/Table/constants';
import Currency from 'src/components/Currency';
import Card from 'src/components/Card';
import Link from 'src/components/Link';
import { HeadingSmall } from 'src/components/Typography';
import { ButtonPrimary } from 'src/components/Button';
import Spinner from 'src/components/Spinner';

import { getEtherscanTxLink } from 'src/utils/explorers';
import {
	LONG_CRYPTO_CURRENCY_DECIMALS,
	SHORT_CRYPTO_CURRENCY_DECIMALS,
	formatTxTimestamp,
	formatCurrency,
	formatCurrencyWithSign,
	formatCurrencyPair,
} from 'src/utils/formatters';

import { TableNoResults } from 'src/shared/commonStyles';

import { getNetworkId } from 'src/ducks';
import {
	fetchMyTradesRequest,
	getMyTrades,
	getIsLoadingMyTrades,
	getIsRefreshingMyTrades,
	getIsLoadedMyTrades,
} from 'src/ducks/trades/myTrades';

import { getAvailableSynthsMap } from 'src/ducks/synths';

export const Exchanges = memo(
	({
		myTrades,
		isLoadingMyTrades,
		isLoadedMyTrades,
		isRefreshingMyTrades,
		networkId,
		fetchMyTradesRequest,
		synthsMap,
	}) => {
		const { t } = useTranslation();

		useEffect(() => {
			fetchMyTradesRequest();
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);

		return (
			<StyledCard>
				<Card.Header>
					<HeadingSmall>{t('assets.exchanges.title')}</HeadingSmall>
					{isRefreshingMyTrades && <Spinner size="sm" />}
				</Card.Header>
				<StyledCardBody>
					<Table
						palette={TABLE_PALETTE.STRIPED}
						columns={[
							{
								Header: t('assets.exchanges.table.date-time-col'),
								accessor: 'timestamp',
								Cell: cellProps => formatTxTimestamp(cellProps.cell.value),
								width: 150,
								sortable: true,
							},
							{
								Header: t('assets.exchanges.table.pair-col'),
								accessor: d => formatCurrencyPair(d.fromCurrencyKey, d.toCurrencyKey),
								Cell: cellProps => {
									const { fromCurrencyKey, toCurrencyKey } = cellProps.row.original;

									return (
										<Currency.Pair
											baseCurrencyKey={fromCurrencyKey}
											quoteCurrencyKey={toCurrencyKey}
										/>
									);
								},
								width: 150,
							},
							{
								Header: t('assets.exchanges.table.buying-col'),
								accessor: 'toAmount',
								Cell: cellProps => (
									<Tooltip
										title={formatCurrency(
											cellProps.row.original.toAmount,
											LONG_CRYPTO_CURRENCY_DECIMALS
										)}
										placement="top"
									>
										<span>
											{formatCurrency(
												cellProps.row.original.toAmount,
												SHORT_CRYPTO_CURRENCY_DECIMALS
											)}
										</span>
									</Tooltip>
								),
								width: 150,
							},
							{
								Header: t('assets.exchanges.table.selling-col'),
								accessor: 'fromAmount',
								Cell: cellProps => (
									<Tooltip
										title={formatCurrency(
											cellProps.row.original.fromAmount,
											LONG_CRYPTO_CURRENCY_DECIMALS
										)}
										placement="top"
									>
										<span>
											{formatCurrency(
												cellProps.row.original.fromAmount,
												SHORT_CRYPTO_CURRENCY_DECIMALS
											)}
										</span>
									</Tooltip>
								),
								width: 150,
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
								width: 150,
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
								width: 150,
								sortable: true,
							},
							{
								Header: t('assets.exchanges.table.status-col'),
								accessor: 'status',
								Cell: () => t('common.tx-status.complete'),
								width: 150,
								sortable: true,
							},
							{
								Header: t('assets.exchanges.table.verify-col'),
								accessor: 'actions',
								Cell: cellProps => (
									<Link
										to={getEtherscanTxLink(networkId, cellProps.row.original.hash)}
										isExternal={true}
									>
										<ButtonPrimary size="xs">{t('common.actions.view')}</ButtonPrimary>
									</Link>
								),
							},
						]}
						data={myTrades}
						isLoading={isLoadingMyTrades && !isLoadedMyTrades}
						noResultsMessage={
							isLoadedMyTrades && myTrades.length === 0 ? (
								<TableNoResults>{t('assets.exchanges.table.no-results')}</TableNoResults>
							) : (
								undefined
							)
						}
					/>
				</StyledCardBody>
			</StyledCard>
		);
	}
);

Exchanges.propTypes = {
	myTrades: PropTypes.array.isRequired,
	isLoadingMyTrades: PropTypes.bool.isRequired,
	isRefreshingMyTrades: PropTypes.bool.isRequired,
	isLoadedMyTrades: PropTypes.bool.isRequired,
	networkId: PropTypes.string.isRequired,
};

const StyledCard = styled(Card)`
	flex-grow: 1;
`;

const StyledCardBody = styled(Card.Body)`
	padding: 0;
	flex-grow: 1;
`;

const mapStateToProps = state => ({
	synthsMap: getAvailableSynthsMap(state),
	networkId: getNetworkId(state),
	myTrades: getMyTrades(state),
	isLoadingMyTrades: getIsLoadingMyTrades(state),
	isRefreshingMyTrades: getIsRefreshingMyTrades(state),
	isLoadedMyTrades: getIsLoadedMyTrades(state),
});

const mapDispatchToProps = {
	fetchMyTradesRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(Exchanges);
