import React, { FC, memo } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation, Trans } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import { CellProps, Row } from 'react-table';

import { getAvailableSynthsMap } from 'ducks/synths';
import { navigateToOptionsMarket } from 'constants/routes';
// import { EMPTY_VALUE } from 'constants/placeholder';
import { SYNTHS_MAP, FIAT_CURRENCY_MAP } from 'constants/currency';

import { RootState } from 'ducks/types';

import { TableOverflowContainer, CurrencyKey } from 'shared/commonStyles';

import Table from 'components/Table';
import { CurrencyCol } from 'components/Table/common';

import Currency from 'components/Currency';
import { OptionsMarkets, OptionsMarket, Phase } from 'ducks/options/types';
import { darkTheme } from 'styles/theme';
import TimeRemaining from '../components/TimeRemaining';
import { formatShortDate } from 'utils/formatters';

const mapStateToProps = (state: RootState) => ({
	synthsMap: getAvailableSynthsMap(state),
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type MarketsTableProps = PropsFromRedux & {
	optionsMarkets: OptionsMarkets;
	marketsLoaded?: boolean;
	noResultsMessage?: React.ReactNode;
};

export const MarketsTable: FC<MarketsTableProps> = memo(
	({ optionsMarkets, synthsMap, marketsLoaded, noResultsMessage }) => {
		const { t } = useTranslation();
		const usdSign = synthsMap[SYNTHS_MAP.sUSD]?.sign;

		return (
			<TableOverflowContainer>
				<StyledTable
					palette="light-secondary"
					columns={[
						{
							Header: <>{t('options.home.markets-table.asset-col')}</>,
							accessor: 'currencyKey',
							Cell: (cellProps: CellProps<OptionsMarket, OptionsMarket['currencyKey']>) => (
								<Currency.Name currencyKey={cellProps.cell.value} showIcon={true} />
							),
							width: 150,
							sortable: true,
						},
						{
							Header: (
								<>
									{t('options.home.markets-table.strike-price-col', {
										currencyKeyWithSymbol: `${usdSign}${FIAT_CURRENCY_MAP.USD}`,
									})}
								</>
							),
							accessor: 'strikePrice',
							sortType: 'basic',
							Cell: (cellProps: CellProps<OptionsMarket, OptionsMarket['strikePrice']>) => (
								<CurrencyCol sign={usdSign} value={cellProps.cell.value} />
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
										{t('common.val-in-cents', { val: cellProps.row.original.prices.long })}
									</Longs>
									{' / '}
									<Shorts>
										{t('common.val-in-cents', { val: cellProps.row.original.prices.short })}
									</Shorts>
								</LongShorts>
							),
							width: 150,
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
							Header: (
								<Trans
									i18nKey="options.home.markets-table.pool-size-col"
									values={{ currencyKeyWithSymbol: `${usdSign}${SYNTHS_MAP.sUSD}` }}
									components={[<CurrencyKey />]}
								/>
							),
							accessor: 'poolSize',
							sortType: 'basic',
							Cell: (cellProps: CellProps<OptionsMarket, OptionsMarket['poolSize']>) => (
								<CurrencyCol sign={usdSign} value={cellProps.cell.value} />
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
						},
						{
							Header: <>{t('options.home.markets-table.bidding-ends-col')}</>,
							accessor: 'endOfBidding',
							Cell: (cellProps: CellProps<OptionsMarket, OptionsMarket['endOfBidding']>) => (
								<TimeRemaining end={cellProps.cell.value} />
							),
							width: 150,
						},
					]}
					columnsDeps={[synthsMap]}
					data={optionsMarkets}
					onTableRowClick={(row: Row<OptionsMarket>) => {
						navigateToOptionsMarket(row.original.marketAddress);
					}}
					options={{
						initialState: {
							sortBy:
								marketsLoaded != null && marketsLoaded ? [{ id: 'endOfBidding', desc: true }] : [],
						},
					}}
					noResultsMessage={noResultsMessage}
				/>
			</TableOverflowContainer>
		);
	}
);

const StyledTable = styled(Table)`
	.table-row,
	.table-body-row {
		& > :last-child {
			justify-content: flex-end;
		}
	}
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

export default connector(MarketsTable);
