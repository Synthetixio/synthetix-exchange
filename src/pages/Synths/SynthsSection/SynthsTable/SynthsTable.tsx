import React, { FC, memo, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { CellProps } from 'react-table';
import get from 'lodash/get';
import Popover from '@material-ui/core/Popover';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import { SynthDefinitionMap, getAvailableSynthsMap, SynthDefinitionWithRates } from 'ducks/synths';

import { RootState } from 'ducks/types';

import { SYNTHS_MAP, CurrencyKey, BASE_TRADING_PAIRS, getMarketPairByMC } from 'constants/currency';
import { RateUpdates } from 'constants/rates';
import { buildTradeLink } from 'constants/routes';
import { EMPTY_VALUE } from 'constants/placeholder';

import Table from 'components/Table';
import { TABLE_PALETTE } from 'components/Table/constants';
import Currency from 'components/Currency';
import { NullableCell, CurrencyCol } from 'components/Table/common';
import ChangePercent from 'components/ChangePercent';
import Link from 'components/Link';

import TrendLineChart from 'components/TrendLineChart';
import { Button } from 'components/Button';
import { TableOverflowContainer } from 'shared/commonStyles';

const useStyles = makeStyles(() =>
	createStyles({
		popover: {
			marginTop: '8px',
		},
		paper: {
			boxShadow: '0px 4px 11px rgba(188,99,255,0.15442)',
			border: '1px solid #F2F2F6',
		},
	})
);

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
		const classes = useStyles();
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
					<StyledTable<any>
						palette={TABLE_PALETTE.LIGHT}
						columns={[
							{
								Header: t('synths.table.synth-col'),
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
								sortType: 'basic',
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
								sortType: 'basic',
								accessor: (d: SynthDefinitionWithRates) =>
									get(d.historicalRates, 'ONE_DAY.data.change', null),
								Cell: (cellProps: CellProps<SynthDefinitionWithRates>) => (
									<NullableCell cellProps={cellProps}>
										<ChangePercent isLabel={true} value={cellProps.cell.value} />
									</NullableCell>
								),
								sortable: true,
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
										onClick={(e) => {
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
					/>
				</TableOverflowContainer>
				<Popover
					className={classes.popover}
					classes={{
						paper: classes.paper,
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
						{selectedSynth &&
							BASE_TRADING_PAIRS.filter((quote) => quote !== selectedSynth).map((quote) => {
								const { base: baseCurrencyKey, quote: quoteCurrencyKey } = getMarketPairByMC(
									selectedSynth,
									quote
								);

								return (
									<Link
										to={buildTradeLink(baseCurrencyKey, quoteCurrencyKey)}
										key={`${selectedSynth}-${quote}`}
									>
										<Currency.Pair
											key={quote}
											baseCurrencyKey={baseCurrencyKey}
											quoteCurrencyKey={quoteCurrencyKey}
										/>
									</Link>
								);
							})}
					</PopoverContent>
				</Popover>
			</>
		);
	}
);

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
