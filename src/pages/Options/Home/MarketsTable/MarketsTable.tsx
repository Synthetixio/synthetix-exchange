import React, { FC, memo } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation, Trans } from 'react-i18next';
import { CellProps, Row } from 'react-table';

import { navigateToOptionsMarket } from 'constants/routes';
import { SYNTHS_MAP, FIAT_CURRENCY_MAP, USD_SIGN } from 'constants/currency';

import { TableOverflowContainer, CurrencyKey } from 'shared/commonStyles';
import { formatShortDate, formatCurrency } from 'utils/formatters';
import { darkTheme } from 'styles/theme';

import Table from 'components/Table';
import { TablePalette } from 'components/Table/Table';
import { CurrencyCol } from 'components/Table/common';

import Currency from 'components/Currency';
import { bodyCSS } from 'components/Typography/General';

import { OptionsMarkets, HistoricalOptionsMarketInfo, Phase } from 'pages/Options/types';
import TimeRemaining from '../components/TimeRemaining';

type MarketsTableProps = {
	optionsMarkets: OptionsMarkets;
	noResultsMessage?: React.ReactNode;
	isLoading?: boolean;
	palette: TablePalette;
};

export const MarketsTable: FC<MarketsTableProps> = memo(
	({ optionsMarkets, noResultsMessage, isLoading, palette }) => {
		const { t } = useTranslation();

		return (
			<TableOverflowContainer>
				<StyledTable
					palette={palette}
					columns={[
						{
							Header: <>{t('options.home.markets-table.asset-col')}</>,
							accessor: 'currencyKey',
							Cell: (
								cellProps: CellProps<
									HistoricalOptionsMarketInfo,
									HistoricalOptionsMarketInfo['currencyKey']
								>
							) => (
								<StyledCurrencyName
									currencyKey={cellProps.cell.value}
									name={cellProps.row.original.asset}
									showIcon={true}
									iconProps={{ type: 'asset', width: '24px', height: '24px' }}
								/>
							),
							width: 150,
							sortable: true,
						},
						{
							Header: (
								<>
									{t('options.home.markets-table.strike-price-col', {
										currencyKey: `${FIAT_CURRENCY_MAP.USD}`,
									})}
								</>
							),
							accessor: 'strikePrice',
							sortType: 'basic',
							Cell: (
								cellProps: CellProps<
									HistoricalOptionsMarketInfo,
									HistoricalOptionsMarketInfo['strikePrice']
								>
							) => <CurrencyCol sign={USD_SIGN} value={cellProps.cell.value} />,
							width: 150,
							sortable: true,
						},
						{
							Header: <>{t('options.home.markets-table.maturity-date-col')}</>,
							accessor: 'maturityDate',
							Cell: (
								cellProps: CellProps<
									HistoricalOptionsMarketInfo,
									HistoricalOptionsMarketInfo['maturityDate']
								>
							) => <span>{formatShortDate(cellProps.cell.value)}</span>,
							width: 150,
							sortable: true,
						},

						{
							Header: <>{t('options.home.markets-table.long-short-col')}</>,
							id: 'long-short',
							Cell: (cellProps: CellProps<HistoricalOptionsMarketInfo>) => {
								const isLabel = palette !== 'light-secondary';

								return (
									<div>
										<Longs isLabel={isLabel}>
											{t('common.val-in-cents', {
												val: formatCurrency(cellProps.row.original.longPrice * 100),
											})}
										</Longs>
										{isLabel ? <span style={{ padding: '0 4px' }} /> : ' / '}
										<Shorts isLabel={isLabel}>
											{t('common.val-in-cents', {
												val: formatCurrency(cellProps.row.original.shortPrice * 100),
											})}
										</Shorts>
									</div>
								);
							},
							width: 150,
						},
						{
							Header: (
								<Trans
									i18nKey="options.home.markets-table.pool-size-col"
									values={{ currencyKey: `${SYNTHS_MAP.sUSD}` }}
									components={[<CurrencyKey />]}
								/>
							),
							accessor: 'poolSize',
							sortType: 'basic',
							Cell: (
								cellProps: CellProps<
									HistoricalOptionsMarketInfo,
									HistoricalOptionsMarketInfo['poolSize']
								>
							) => <CurrencyCol sign={USD_SIGN} value={cellProps.cell.value} />,
							width: 150,
							sortable: true,
						},
						{
							Header: <>{t('options.home.markets-table.phase-col')}</>,
							accessor: 'phase',
							Cell: (
								cellProps: CellProps<
									HistoricalOptionsMarketInfo,
									HistoricalOptionsMarketInfo['phase']
								>
							) => (
								<PhaseDiv phase={cellProps.cell.value} isLabel={palette === 'light-secondary'}>
									{t(`options.phases.${cellProps.cell.value}`)}
								</PhaseDiv>
							),
							width: 150,
						},
						{
							Header: <>{t('options.home.markets-table.time-remaining-col')}</>,
							accessor: 'timeRemaining',
							Cell: (
								cellProps: CellProps<
									HistoricalOptionsMarketInfo,
									HistoricalOptionsMarketInfo['timeRemaining']
								>
							) => (
								<TimeRemaining
									end={cellProps.cell.value}
									palette={palette === 'striped' ? 'high-contrast' : 'light'}
								/>
							),
							width: 150,
						},
					]}
					data={optionsMarkets}
					onTableRowClick={(row: Row<HistoricalOptionsMarketInfo>) => {
						navigateToOptionsMarket(row.original.address);
					}}
					isLoading={isLoading}
					noResultsMessage={noResultsMessage}
				/>
			</TableOverflowContainer>
		);
	}
);

const StyledTable = styled(Table)`
	min-height: 350px;
	.table-row,
	.table-body-row {
		& > :last-child {
			justify-content: flex-end;
		}
	}
`;

const StyledCurrencyName = styled(Currency.Name)`
	${bodyCSS};
`;

const Longs = styled.span<{ isLabel: boolean }>`
	color: ${(props) => (props.isLabel ? props.theme.colors.surfaceL1 : props.theme.colors.green)};
	${(props) =>
		props.isLabel &&
		css`
			background-color: ${(props) => props.theme.colors.green};
			border-radius: 1px;
			padding: 2px 4px;
		`}
`;

const Shorts = styled.span<{ isLabel: boolean }>`
	color: ${(props) => (props.isLabel ? props.theme.colors.surfaceL1 : props.theme.colors.red)};
	${(props) =>
		props.isLabel &&
		css`
			background-color: ${(props) => props.theme.colors.red};
			border-radius: 1px;
			padding: 2px 8px;
		`}
`;

const PhaseDiv = styled.div<{ phase: Phase; isLabel: boolean }>`
  border-radius: 2px;
  padding: 5px 8px;
	text-transform: uppercase;
	
	color: ${darkTheme.colors.accentL1};
	${(props) =>
		props.phase === 'bidding' &&
		css`
			background-color: #fbe6b8;
		`}
	${(props) =>
		props.phase === 'trading' &&
		css`
			background-color: #9fe3d5;
		`}
    ${(props) =>
			props.phase === 'maturity' &&
			css`
				background-color: #c5d5ff;
			`}

	${(props) =>
		!props.isLabel &&
		css`
			color: ${(props) => props.theme.colors.fontPrimary};
			background-color: initial;
		`}
`;

export default MarketsTable;
