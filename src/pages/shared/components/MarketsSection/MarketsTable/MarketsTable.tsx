import React, { FC, memo } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { CellProps, Row } from 'react-table';

import { getAvailableSynthsMap, SynthDefinitionMap } from 'ducks/synths';
import { navigateToTrade } from 'constants/routes';
import { EMPTY_VALUE } from 'constants/placeholder';
import { SYNTHS_MAP } from 'constants/currency';

import { MarketPair, MarketPairs } from 'ducks/markets';
import { RootState } from 'ducks/types';

import { TableOverflowContainer } from 'shared/commonStyles';

import ChangePercent from 'components/ChangePercent';
import Table from 'components/Table';
import { CurrencyCol } from 'components/Table/common';
import Currency from 'components/Currency';
import { bodyCSS } from 'components/Typography/General';
import { SnowflakeCircle } from 'components/Icons';
import Margin from 'components/Margin';

type StateProps = {
	synthsMap: SynthDefinitionMap;
};

type Props = {
	markets: MarketPairs;
	marketsLoaded?: boolean;
	noResultsMessage?: React.ReactNode;
};

type MarketsTableProps = StateProps & Props;

export const MarketsTable: FC<MarketsTableProps> = memo(
	({ markets, synthsMap, marketsLoaded, noResultsMessage }) => {
		const { t } = useTranslation();

		return (
			<TableOverflowContainer>
				<StyledTable
					palette="light-secondary"
					columns={[
						{
							Header: <>{t('markets.table.pair-col')}</>,
							accessor: 'pair',
							Cell: (cellProps: CellProps<MarketPair>) => (
								<>
									{synthsMap[cellProps.row.original.baseCurrencyKey]?.isFrozen ? (
										<Margin right="10px">
											<SnowflakeCircle
												showTooltip={true}
												radius={23}
												innerRadius={16}
												name={cellProps.row.original.baseCurrencyKey}
											/>
										</Margin>
									) : null}
									<StyledCurrencyPair
										baseCurrencyKey={cellProps.row.original.baseCurrencyKey}
										quoteCurrencyKey={cellProps.row.original.quoteCurrencyKey}
										showIcon={true}
										iconProps={{ width: '24px', height: '24px' }}
									/>
								</>
							),
							width: 150,
							sortable: true,
						},
						{
							Header: <>{t('markets.table.last-price-col')}</>,
							accessor: 'lastPrice',
							sortType: 'basic',
							Cell: (cellProps: CellProps<MarketPair>) => (
								<CurrencyCol
									sign={synthsMap[cellProps.row.original.quoteCurrencyKey]?.sign}
									value={cellProps.cell.value}
								/>
							),
							width: 150,
							sortable: true,
						},
						{
							Header: <>{t('markets.table.24h-change-col')}</>,
							accessor: 'rates24hChange',
							sortType: 'basic',
							Cell: (cellProps: CellProps<MarketPair, MarketPair['rates24hChange']>) =>
								cellProps.cell.value == null ? (
									<span>{EMPTY_VALUE}</span>
								) : (
									<ChangePercent isLabel={true} value={cellProps.cell.value} />
								),
							width: 150,
							sortable: true,
						},
						{
							Header: <>{t('markets.table.24h-low-col')}</>,
							accessor: 'rates24hLow',
							sortType: 'basic',
							Cell: (cellProps: CellProps<MarketPair, MarketPair['rates24hLow']>) => (
								<CurrencyCol
									sign={synthsMap[cellProps.row.original.quoteCurrencyKey]?.sign}
									value={cellProps.cell.value}
								/>
							),
							width: 150,
							sortable: true,
						},
						{
							Header: <>{t('markets.table.24h-high-col')}</>,
							accessor: 'rates24hHigh',
							sortType: 'basic',
							Cell: (cellProps: CellProps<MarketPair, MarketPair['rates24hHigh']>) => (
								<CurrencyCol
									sign={synthsMap[cellProps.row.original.quoteCurrencyKey]?.sign}
									value={cellProps.cell.value}
								/>
							),
							width: 150,
							sortable: true,
						},
						{
							Header: <>{t('markets.table.24h-volume-col')}</>,
							accessor: 'rates24hVol',
							sortType: 'basic',
							Cell: (cellProps: CellProps<MarketPair, MarketPair['rates24hVol']>) => (
								<CurrencyCol sign={synthsMap[SYNTHS_MAP.sUSD]?.sign} value={cellProps.cell.value} />
							),
							width: 150,
							sortable: true,
						},
					]}
					columnsDeps={[synthsMap]}
					data={markets}
					onTableRowClick={(row: Row<MarketPair>) =>
						navigateToTrade(row.original.baseCurrencyKey, row.original.quoteCurrencyKey)
					}
					options={{
						initialState: {
							sortBy:
								marketsLoaded != null && marketsLoaded ? [{ id: 'rates24hVol', desc: true }] : [],
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

const StyledCurrencyPair = styled(Currency.Pair)`
	${bodyCSS};
`;

const mapStateToProps = (state: RootState): StateProps => ({
	synthsMap: getAvailableSynthsMap(state),
});

export default connect<StateProps, {}, Props, RootState>(mapStateToProps)(MarketsTable);
