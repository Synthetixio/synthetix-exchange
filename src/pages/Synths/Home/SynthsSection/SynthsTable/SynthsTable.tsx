import React, { FC, memo, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { CellProps } from 'react-table';
import get from 'lodash/get';
import Popover from '@material-ui/core/Popover';

import { SynthDefinitionMap, getAvailableSynthsMap, SynthDefinitionWithRates } from 'ducks/synths';

import { RootState } from 'ducks/types';

import { SYNTHS_MAP, CurrencyKey, sUSD_EXCHANGE_RATE } from 'constants/currency';
import { RateUpdates } from 'constants/rates';
import { EMPTY_VALUE } from 'constants/placeholder';
import { PERIOD_IN_HOURS } from 'constants/period';
import { navigateToSynthOverview } from 'constants/routes';

import Table from 'components/Table';
import Currency from 'components/Currency';
import { CurrencyCol } from 'components/Table/common';
import ChangePercent from 'components/ChangePercent';

import TrendLineChart from 'components/TrendLineChart';
import { Button } from 'components/Button';
import BaseTradingPairs from 'components/BaseTradingPairs';

import { TableOverflowContainer } from 'shared/commonStyles';

import { mockRates } from 'pages/Synths/mockData';
import { bodyCSS } from 'components/Typography/General';
import { SnowflakeCircle } from 'components/Icons';
import Margin from 'components/Margin';

type StateProps = {
	synthsMap: SynthDefinitionMap;
};

type Props = {
	synthsWithRates: SynthDefinitionWithRates[];
	noResultsMessage?: React.ReactNode;
};

type SynthsTableProps = StateProps & Props;

export const SynthsTable: FC<SynthsTableProps> = memo(
	({ synthsMap, synthsWithRates, noResultsMessage }) => {
		const { t } = useTranslation();
		const [selectedSynth, setSelectedSynth] = useState<CurrencyKey | null>(null);
		const [tradeButtonAnchorEl, setTradeButtonAnchorEl] = useState<HTMLButtonElement | null>(null);

		const handleTradeButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
			setTradeButtonAnchorEl(event.currentTarget);
		};

		const handleTradePopoverClose = () => {
			setTradeButtonAnchorEl(null);
			setSelectedSynth(null);
		};

		const tradeButtonPopoverOpen = Boolean(tradeButtonAnchorEl);
		const id = tradeButtonPopoverOpen ? 'trade-button-popover' : undefined;

		return (
			<>
				<TableOverflowContainer>
					<StyledTable
						palette="light-secondary"
						columns={[
							{
								Header: <>{t('synths.home.table.synth-col')}</>,
								accessor: 'name',
								Cell: (
									cellProps: CellProps<SynthDefinitionWithRates, SynthDefinitionWithRates['name']>
								) => (
									<>
										{cellProps.row.original.isFrozen ? (
											<Margin right="10px">
												<SnowflakeCircle
													showTooltip={true}
													radius={23}
													innerRadius={16}
													name={cellProps.row.original.name}
												/>
											</Margin>
										) : null}
										<StyledCurrencyName
											currencyKey={cellProps.cell.value}
											currencyDesc={cellProps.row.original.desc}
											showIcon={true}
											iconProps={{ width: '24px', height: '24px' }}
										/>
									</>
								),
								width: 200,
								sortable: true,
							},
							{
								Header: <>{t('synths.home.table.last-price-col')}</>,
								accessor: 'lastPrice',
								sortType: 'basic',
								Cell: (
									cellProps: CellProps<
										SynthDefinitionWithRates,
										SynthDefinitionWithRates['lastPrice']
									>
								) => (
									<CurrencyCol
										sign={synthsMap[SYNTHS_MAP.sUSD]?.sign}
										value={cellProps.cell.value}
									/>
								),
								width: 100,
								sortable: true,
							},
							{
								Header: <>{t('synths.home.table.24h-change-col')}</>,
								sortType: 'basic',
								accessor: (originalRow: any) =>
									get(originalRow.historicalRates, 'ONE_DAY.data.change', null),
								id: '24change-col',
								Cell: (cellProps: CellProps<SynthDefinitionWithRates, number | null>) =>
									cellProps.cell.value == null ? (
										<span>{EMPTY_VALUE}</span>
									) : (
										<ChangePercent isLabel={true} value={cellProps.cell.value} />
									),
								sortable: true,
								width: 100,
							},
							{
								Header: <>{t('synths.home.table.24h-trend-col')}</>,
								id: '24trend-col',
								Cell: (cellProps: CellProps<SynthDefinitionWithRates>) => {
									if (cellProps.row.original.name === SYNTHS_MAP.sUSD) {
										return (
											<TrendLineChart
												change={0}
												chartData={mockRates(PERIOD_IN_HOURS.ONE_DAY, sUSD_EXCHANGE_RATE)}
											/>
										);
									}

									const data: { change: number; rates: RateUpdates } | null = get(
										cellProps.row.original.historicalRates,
										'ONE_DAY.data',
										null
									);

									return data == null ? (
										<span>{EMPTY_VALUE}</span>
									) : (
										<TrendLineChart change={data.change} chartData={data.rates || []} />
									);
								},
								width: 150,
							},
							{
								Header: <>{t('synths.home.table.trade-now-col')}</>,
								id: 'trade-col',
								Cell: (cellProps: CellProps<SynthDefinitionWithRates>) => (
									<Button
										size="sm"
										palette="outline"
										onClick={(e) => {
											e.stopPropagation();
											handleTradeButtonClick(e);
											setSelectedSynth(cellProps.row.original.name);
										}}
									>
										{t('common.actions.trade')}
									</Button>
								),
							},
						]}
						columnsDeps={[synthsMap]}
						data={synthsWithRates}
						noResultsMessage={noResultsMessage}
						onTableRowClick={(row) => navigateToSynthOverview(row.original.name)}
					/>
				</TableOverflowContainer>
				<StyledPopover
					classes={{
						paper: 'paper',
					}}
					id={id}
					open={tradeButtonPopoverOpen}
					anchorEl={tradeButtonAnchorEl}
					onClose={handleTradePopoverClose}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'center',
					}}
					transformOrigin={{
						vertical: 'top',
						horizontal: 'center',
					}}
				>
					<PopoverContent>
						{selectedSynth && <BaseTradingPairs currencyKey={selectedSynth} />}
					</PopoverContent>
				</StyledPopover>
			</>
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

const StyledCurrencyName = styled(Currency.Name)`
	${bodyCSS};
`;

const StyledPopover = styled(Popover)`
	margin-top: 8px;
	.paper {
		box-shadow: 0px 4px 11px rgba(188, 99, 255, 0.15442);
		border: 1px solid #f2f2f6;
	}
`;

const PopoverContent = styled.div`
	display: grid;
	> * {
		padding: 10px 15px;
		&:hover {
			background-color: ${({ theme }) => theme.colors.accentL1};
		}
	}
`;

const mapStateToProps = (state: RootState): StateProps => ({
	synthsMap: getAvailableSynthsMap(state),
});

export default connect<StateProps, {}, {}, RootState>(mapStateToProps)(SynthsTable);
