import React, { FC, memo } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { CellProps } from 'react-table';
import get from 'lodash/get';

import { SynthDefinitionMap, getAvailableSynthsMap, SynthDefinitionWithRates } from 'ducks/synths';

import { RootState } from 'ducks/types';

import { SYNTHS_MAP } from 'constants/currency';
import { RateUpdates } from 'constants/rates';
import { navigateToTrade } from 'constants/routes';
import { EMPTY_VALUE } from 'constants/placeholder';

import Table from 'components/Table';
import { TABLE_PALETTE } from 'components/Table/constants';
import Currency from 'components/Currency';
import { NullableCell, CurrencyCol } from 'components/Table/common';
import ChangePercent from 'components/ChangePercent';

import TrendLineChart from 'components/TrendLineChart';
import { Button } from 'components/Button';
import { TableOverflowContainer } from 'shared/commonStyles';

type StateProps = {
	synthsMap: SynthDefinitionMap;
};

type Props = {
	synthsWithRates: SynthDefinitionWithRates[];
};

type SynthsTableProps = StateProps & Props;

export const SynthsTable: FC<SynthsTableProps> = memo(({ synthsMap, synthsWithRates }) => {
	const { t } = useTranslation();

	return (
		<TableOverflowContainer>
			<StyledTable<any>
				palette={TABLE_PALETTE.LIGHT}
				columns={[
					{
						Header: t('synths.table.token-col'),
						accessor: 'name',
						Cell: (cellProps: CellProps<SynthDefinitionWithRates>) => (
							<Currency.Name
								// @ts-ignore
								currencyKey={cellProps.cell.value}
								currencyDesc={cellProps.row.original.desc}
								showIcon={true}
							/>
						),
						width: 200,
						sortable: true,
					},
					{
						Header: t('synths.table.last-price-col'),
						accessor: 'lastPrice',
						Cell: (cellProps: CellProps<SynthDefinitionWithRates>) => (
							<CurrencyCol
								currencyKey={SYNTHS_MAP.sUSD}
								synthsMap={synthsMap}
								cellProps={cellProps}
							/>
						),
						width: 100,
						sortable: true,
					},
					{
						Header: t('synths.table.24h-change-col'),
						accessor: (d: SynthDefinitionWithRates) =>
							get(d.historicalRates, 'ONE_DAY.data.change', null),
						Cell: (cellProps: CellProps<SynthDefinitionWithRates>) => (
							<NullableCell cellProps={cellProps}>
								<ChangePercent isLabel={true} value={cellProps.cell.value} />
							</NullableCell>
						),
						width: 100,
					},
					{
						Header: t('synths.table.24h-trend-col'),
						id: 'seven-day-trend',
						Cell: (cellProps: CellProps<SynthDefinitionWithRates>) => {
							const data = get(cellProps.row.original.historicalRates, 'ONE_DAY.data', null);
							if (!data || data.rates.length === 0) {
								return <span>{EMPTY_VALUE}</span>;
							}
							return (
								<TrendLineChart
									change={data.change as number}
									chartData={data.rates as RateUpdates}
								/>
							);
						},
						width: 150,
					},
					{
						Header: t('synths.table.trade-now-col'),
						id: 'trade-col',
						Cell: (cellProps: CellProps<SynthDefinitionWithRates>) => (
							<Button
								size="sm"
								palette="outline"
								onClick={() => navigateToTrade(cellProps.row.original.name, SYNTHS_MAP.sUSD)}
							>
								{t('common.actions.trade')}
							</Button>
						),
					},
				]}
				columnsDeps={[synthsMap]}
				data={synthsWithRates}
			/>
		</TableOverflowContainer>
	);
});

const StyledTable = styled(Table)`
	.table-row {
		& > :last-child {
			justify-content: flex-end;
		}
	}

	.table-body-row {
		& > :last-child {
			justify-content: flex-end;
		}
		&:hover {
			box-shadow: none;
		}
	}
`;

const mapStateToProps = (state: RootState): StateProps => ({
	synthsMap: getAvailableSynthsMap(state),
});

export default connect<StateProps, {}, {}, RootState>(mapStateToProps)(SynthsTable);
