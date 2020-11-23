import React, { memo, FC } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { CellProps, Row } from 'react-table';

import { MarketPairs, MarketPair } from 'ducks/markets';
import { getAvailableSynthsMap } from 'ducks/synths';
import { RootState } from 'ducks/types';

import Currency from 'components/Currency';
import Table from 'components/Table';
import { CurrencyCol, RightAlignedCell } from 'components/Table/common';
import { SynthDefinitionMap } from 'ducks/synths';

import { SnowflakeCircle } from 'components/Icons';
import Margin from 'components/Margin';
import { MarketSummaryMap } from 'pages/Futures/types';

type StateProps = {
	synthsMap: SynthDefinitionMap;
};

type Props = {
	markets: MarketPairs;
	onTableRowClick: (row: Row<MarketPair>) => void;
	futureMarkets: MarketSummaryMap | null;
};

type MarketsTableProps = StateProps & Props;

const MarketsTable: FC<MarketsTableProps> = memo(
	({ synthsMap, markets, onTableRowClick, futureMarkets }) => {
		const { t } = useTranslation();

		return (
			<StyledTable
				palette="primary"
				columnsDeps={[synthsMap]}
				columns={[
					{
						Header: <>{t('markets.table.pair-col')}</>,
						accessor: 'pair',
						width: 150,
						Cell: (cellProps: CellProps<MarketPair>) => (
							<>
								<Currency.Pair
									baseCurrencyKey={cellProps.row.original.baseCurrencyKey}
									quoteCurrencyKey={cellProps.row.original.quoteCurrencyKey}
									showIcon={true}
									maxLeverage={
										futureMarkets != null
											? futureMarkets[cellProps.row.original.baseCurrencyKey].maxLeverage
											: undefined
									}
								/>
								{synthsMap[cellProps.row.original.baseCurrencyKey]?.isFrozen ? (
									<Margin left="10px">
										<SnowflakeCircle
											radius={16}
											innerRadius={10}
											currencyKey={cellProps.row.original.baseCurrencyKey}
										/>
									</Margin>
								) : null}
							</>
						),
						sortable: true,
					},
					{
						Header: <>{t('markets.table.last-price-col')}</>,
						accessor: 'lastPrice',
						sortType: 'basic',
						width: 100,
						Cell: (cellProps: CellProps<MarketPair, MarketPair['lastPrice']>) => (
							<RightAlignedCell>
								<CurrencyCol
									sign={synthsMap[cellProps.row.original.quoteCurrencyKey]?.sign}
									value={cellProps.cell.value}
								/>
							</RightAlignedCell>
						),
						sortable: true,
					},
				]}
				data={markets}
				onTableRowClick={onTableRowClick}
				noResultsMessage={
					markets.length === 0 ? (
						<NoResults>{t('trade.chart-card.pair-list.table.no-results')}</NoResults>
					) : undefined
				}
			/>
		);
	}
);

const NoResults = styled.div`
	padding: 18px;
	text-align: center;
	color: ${(props) => props.theme.colors.fontPrimary};
	text-transform: none;
`;

const StyledTable = styled(Table)`
	.table-row {
		width: 100%;
		& > :last-child {
			justify-content: flex-end;
		}
	}
	.table-body {
		width: 300px;
		margin-bottom: 80px;
	}
	.table-body-row {
		margin: 0 6px 8px 6px;
		& > :first-child {
			padding-left: 12px;
		}
		& > :last-child {
			padding-right: 16px;
		}
	}
	.table-body-cell {
		height: 32px;
	}
`;

const mapStateToProps = (state: RootState): StateProps => ({
	synthsMap: getAvailableSynthsMap(state),
});

export default connect<StateProps, {}, Props, RootState>(mapStateToProps)(MarketsTable);
