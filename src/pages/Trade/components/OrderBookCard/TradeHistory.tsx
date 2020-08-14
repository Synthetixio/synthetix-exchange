import React, { memo, FC } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import styled from 'styled-components';
import { useTranslation, Trans } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import { CellProps } from 'react-table';
import { withStyles } from '@material-ui/core';

import { getNetworkId } from 'ducks/wallet/walletDetails';

import { ReactComponent as QuestionMark } from 'assets/images/question-mark.svg';

import Table from 'components/Table';
import Currency from 'components/Currency';
import Link from 'components/Link';

import { USD_SIGN } from 'constants/currency';

import { RootState } from 'ducks/types';
import { HistoricalTrade, HistoricalTrades } from 'ducks/trades/types';

import { TableNoResults, QuestionMarkIcon, FlexDivCentered } from 'shared/commonStyles';
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
import { EMPTY_VALUE } from 'constants/placeholder';
import { LINKS } from 'constants/links';

const mapStateToProps = (state: RootState) => ({
	networkId: getNetworkId(state),
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type TradeHistoryProps = PropsFromRedux & {
	trades: HistoricalTrades;
	isLoading: boolean;
	isLoaded: boolean;
	showSettled?: boolean;
};

const TradeHistory: FC<TradeHistoryProps> = memo(
	({ trades, isLoading, isLoaded, networkId, showSettled }) => {
		const { t } = useTranslation();

		const settledColumns = showSettled
			? [
					{
						Header: (
							<FlexDivCentered>
								{t('assets.exchanges.table.fee-reclaim-col')}
								<StyledTooltip
									title={
										<>
											<Trans
												i18nKey="assets.exchanges.table.fee-reclaim-tooltip"
												components={[<Reclaim />, <Rebate />]}
											/>{' '}
											<StyledLink isExternal={true} to={LINKS.Blog.HowBinaryOptionsWork}>
												{t('common.more-info')}
												<ArrowIcon />
											</StyledLink>
										</>
									}
									interactive={true}
									placement="top"
									arrow={true}
								>
									<QuestionMarkIcon>
										<QuestionMark />
									</QuestionMarkIcon>
								</StyledTooltip>
							</FlexDivCentered>
						),
						accessor: 'isSettled',
						sortType: 'basic',
						Cell: (cellProps: CellProps<HistoricalTrade, HistoricalTrade['isSettled']>) => {
							const { toCurrencyKey, amount } = cellProps.row.original;

							return cellProps.cell.value ? (
								amount === 0 ? (
									<span>{t('common.not-available')}</span>
								) : (
									<FeeReclaim isRebate={amount > 0}>
										<Tooltip
											title={formatCurrency(amount, LONG_CRYPTO_CURRENCY_DECIMALS)}
											placement="top"
										>
											<span>
												{amount >= 0 ? '+' : ''}
												{formatCurrencyWithKey(
													toCurrencyKey,
													amount,
													SHORT_CRYPTO_CURRENCY_DECIMALS
												)}
											</span>
										</Tooltip>
									</FeeReclaim>
								)
							) : (
								<span>{EMPTY_VALUE}</span>
							);
						},
						sortable: true,
					},
					{
						Header: <>{t('assets.exchanges.table.settled-price-col')}</>,
						accessor: 'settledPrice',
						sortType: 'basic',
						Cell: (cellProps: CellProps<HistoricalTrade, HistoricalTrade['settledPrice']>) => (
							<span>
								{cellProps.row.original.isSettled
									? formatCurrencyWithSign(USD_SIGN, cellProps.cell.value)
									: EMPTY_VALUE}
							</span>
						),
						sortable: true,
					},
			  ]
			: [];

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
					...settledColumns,
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
	}
);

const StyledTable = styled(Table)`
	position: initial;

	.table-body-cell {
		height: 38px;
	}
`;

const Reclaim = styled.span`
	color: ${(props) => props.theme.colors.red};
`;

const Rebate = styled.span`
	color: ${(props) => props.theme.colors.green};
`;

const StyledLink = styled(Link)`
	color: ${(props) => props.theme.colors.hyperlink};
`;

const FeeReclaim = styled.span<{ isRebate: boolean }>`
	color: ${(props) => (props.isRebate ? props.theme.colors.green : props.theme.colors.red)};
`;

const StyledTooltip = withStyles({
	tooltip: {
		width: '335px',
		textAlign: 'center',
	},
})(Tooltip);

export default connector(TradeHistory);
