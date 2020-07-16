import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';

import { USD_SIGN } from 'constants/currency';

import Table from 'components/Table';
import Currency from 'components/Currency';
import Card from 'components/Card';
import Link from 'components/Link';
import { HeadingSmall } from 'components/Typography';
import { ButtonPrimary } from 'components/Button';
import Spinner from 'components/Spinner';

import { getEtherscanTxLink } from 'utils/explorers';
import {
	LONG_CRYPTO_CURRENCY_DECIMALS,
	SHORT_CRYPTO_CURRENCY_DECIMALS,
	formatTxTimestamp,
	formatCurrency,
	formatCurrencyWithSign,
	formatCurrencyWithKey,
} from 'utils/formatters';

import { TableNoResults } from 'shared/commonStyles';

import { getNetworkId } from 'ducks/wallet/walletDetails';
import {
	fetchMyTradesRequest,
	getMyTrades,
	getIsLoadingMyTrades,
	getIsRefreshingMyTrades,
	getIsLoadedMyTrades,
} from 'ducks/trades/myTrades';

export const Exchanges = ({
	myTrades,
	isLoadingMyTrades,
	isLoadedMyTrades,
	isRefreshingMyTrades,
	networkId,
	fetchMyTradesRequest,
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
					palette="striped"
					columns={[
						{
							Header: <>{t('assets.exchanges.table.date-time-col')}</>,
							accessor: 'timestamp',
							Cell: (cellProps) => formatTxTimestamp(cellProps.cell.value),
							width: 150,
							sortable: true,
						},
						{
							Header: <>{t('assets.exchanges.table.pair-col')}</>,
							id: 'trade-pair',
							Cell: (cellProps) => {
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
							Header: <>{t('assets.exchanges.table.buying-col')}</>,
							accessor: 'toAmount',
							sortType: 'basic',
							Cell: (cellProps) => (
								<Tooltip
									title={formatCurrency(
										cellProps.row.original.toAmount,
										LONG_CRYPTO_CURRENCY_DECIMALS
									)}
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
							width: 150,
						},
						{
							Header: <>{t('assets.exchanges.table.selling-col')}</>,
							accessor: 'fromAmount',
							sortType: 'basic',
							Cell: (cellProps) => (
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
							width: 150,
						},
						{
							Header: <>{t('assets.exchanges.table.price-col')}</>,
							accessor: 'price',
							sortType: 'basic',
							Cell: (cellProps) => (
								<span>{formatCurrencyWithSign(USD_SIGN, cellProps.cell.value)}</span>
							),
							width: 150,
						},
						{
							Header: <>{t('assets.exchanges.table.total-col')}</>,
							accessor: 'amount',
							sortType: 'basic',
							Cell: (cellProps) => (
								<span>{formatCurrencyWithSign(USD_SIGN, cellProps.cell.value)}</span>
							),
							width: 150,
							sortable: true,
						},
						{
							Header: <>{t('assets.exchanges.table.status-col')}</>,
							accessor: 'status',
							Cell: () => t('common.tx-status.complete'),
							width: 150,
							sortable: true,
						},
						{
							Header: <>{t('assets.exchanges.table.verify-col')}</>,
							accessor: 'actions',
							Cell: (cellProps) => (
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
						) : undefined
					}
				/>
			</StyledCardBody>
		</StyledCard>
	);
};

Exchanges.propTypes = {
	myTrades: PropTypes.array.isRequired,
	isLoadingMyTrades: PropTypes.bool.isRequired,
	isRefreshingMyTrades: PropTypes.bool.isRequired,
	isLoadedMyTrades: PropTypes.bool.isRequired,
	networkId: PropTypes.number.isRequired,
};

const StyledCard = styled(Card)`
	flex-grow: 1;
`;

const StyledCardBody = styled(Card.Body)`
	padding: 0;
	flex-grow: 1;
`;

const mapStateToProps = (state) => ({
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
