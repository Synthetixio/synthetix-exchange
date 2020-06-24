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
import { CurrencyCol } from 'components/Table/common';

import Currency from 'components/Currency';
import { bodyCSS } from 'components/Typography/General';

import { OptionsMarkets, OptionsMarket, Phase } from 'ducks/options/types';
import TimeRemaining from '../components/TimeRemaining';

type MarketsTableProps = {
	optionsMarkets: OptionsMarkets;
	noResultsMessage?: React.ReactNode;
};

export const MarketsTable: FC<MarketsTableProps> = memo(({ optionsMarkets, noResultsMessage }) => {
	const { t } = useTranslation();

	return (
		<TableOverflowContainer>
			<StyledTable
				palette="light-secondary"
				columns={[
					{
						Header: <>{t('options.home.markets-table.asset-col')}</>,
						accessor: 'currencyKey',
						Cell: (cellProps: CellProps<OptionsMarket, OptionsMarket['currencyKey']>) => (
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
									currencyKeyWithSymbol: `${USD_SIGN}${FIAT_CURRENCY_MAP.USD}`,
								})}
							</>
						),
						accessor: 'strikePrice',
						sortType: 'basic',
						Cell: (cellProps: CellProps<OptionsMarket, OptionsMarket['strikePrice']>) => (
							<CurrencyCol sign={USD_SIGN} value={cellProps.cell.value} />
						),
						width: 150,
						sortable: true,
					},
					{
						Header: <>{t('options.home.markets-table.maturity-date-col')}</>,
						accessor: 'maturityDate',
						Cell: (cellProps: CellProps<OptionsMarket, OptionsMarket['maturityDate']>) => (
							<span>{formatShortDate(cellProps.cell.value)}</span>
						),
						width: 150,
						sortable: true,
					},

					{
						Header: <>{t('options.home.markets-table.long-short-col')}</>,
						id: 'long-short',
						Cell: (cellProps: CellProps<OptionsMarket>) => (
							<LongShorts>
								<Longs>
									{t('common.val-in-cents', {
										val: formatCurrency(cellProps.row.original.longPrice * 100),
									})}
								</Longs>
								{' / '}
								<Shorts>
									{t('common.val-in-cents', {
										val: formatCurrency(cellProps.row.original.shortPrice * 100),
									})}
								</Shorts>
							</LongShorts>
						),
						width: 150,
					},
					{
						Header: (
							<Trans
								i18nKey="options.home.markets-table.pool-size-col"
								values={{ currencyKeyWithSymbol: `${USD_SIGN}${SYNTHS_MAP.sUSD}` }}
								components={[<CurrencyKey />]}
							/>
						),
						accessor: 'poolSize',
						sortType: 'basic',
						Cell: (cellProps: CellProps<OptionsMarket, OptionsMarket['poolSize']>) => (
							<CurrencyCol sign={USD_SIGN} value={cellProps.cell.value} />
						),
						width: 150,
						sortable: true,
					},
					{
						Header: <>{t('options.home.markets-table.phase-col')}</>,
						accessor: 'phase',
						Cell: (cellProps: CellProps<OptionsMarket, OptionsMarket['phase']>) => (
							<PhaseDiv phase={cellProps.cell.value}>
								{t(`options.phases.${cellProps.cell.value}`)}
							</PhaseDiv>
						),
						width: 150,
					},
					{
						Header: <>{t('options.home.markets-table.time-remaining-col')}</>,
						accessor: 'timeRemaining',
						Cell: (cellProps: CellProps<OptionsMarket, OptionsMarket['timeRemaining']>) => (
							<TimeRemaining end={cellProps.cell.value} />
						),
						width: 150,
					},
				]}
				data={optionsMarkets}
				onTableRowClick={(row: Row<OptionsMarket>) => {
					navigateToOptionsMarket(row.original.address);
				}}
				noResultsMessage={noResultsMessage}
			/>
		</TableOverflowContainer>
	);
});

const StyledTable = styled(Table)`
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

const LongShorts = styled.div``;

const Longs = styled.span`
	color: ${(props) => props.theme.colors.green};
`;

const Shorts = styled.span`
	color: ${(props) => props.theme.colors.red};
`;

const PhaseDiv = styled.div<{ phase: Phase }>`
	color: ${darkTheme.colors.accentL1};
  border-radius: 2px;
  padding: 5px 8px;
	text-transform: uppercase;
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
`;

export default MarketsTable;
