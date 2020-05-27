import React, { memo, FC, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';

import {
	SynthDefinition,
	getSynthsWithRatesMap,
	SynthDefinitionWithRatesMap,
	getAvailableSynthsMap,
	SynthDefinitionMap,
} from 'ducks/synths';
import { RootState } from 'ducks/types';
import { fetchHistoricalRatesRequest, HistoricalRatesData } from 'ducks/historicalRates';
import ChartCard from 'components/ChartCard';
import styled from 'styled-components';
import useInterval from 'shared/hooks/useInterval';
import { PeriodLabel, PERIOD_LABELS_MAP } from 'constants/period';
import Currency from 'components/Currency';
import { formatCurrencyWithSign } from 'utils/formatters';
import { SYNTHS_MAP } from 'constants/currency';
import { RateUpdates } from 'constants/rates';
import { darkTheme } from 'styles/theme';
import { media } from 'shared/media';
import { DEFAULT_REQUEST_REFRESH_INTERVAL } from 'constants/ui';

type StateProps = {
	synthsMap: SynthDefinitionMap;
	synthsWithRatesMap: SynthDefinitionWithRatesMap;
};

type DispatchProps = {
	fetchHistoricalRatesRequest: typeof fetchHistoricalRatesRequest;
};

type Props = {
	synth: SynthDefinition;
};

type SynthChartProps = StateProps & DispatchProps & Props;

export const SynthChart: FC<SynthChartProps> = memo(
	({ synth, fetchHistoricalRatesRequest, synthsWithRatesMap, synthsMap }) => {
		const [selectedPeriod, setSelectedPeriod] = useState<PeriodLabel>(PERIOD_LABELS_MAP.ONE_DAY);
		const [historicalRateUpdates, setHistoricalRatesUpdates] = useState<RateUpdates>([]);
		const [historicalRateChange, setHistoricalRatesChange] = useState<number | null>(null);
		const [loading, setLoading] = useState<boolean>(true);

		useEffect(() => {
			fetchHistoricalRatesRequest({ synths: [synth], periods: [selectedPeriod.period] });
		}, [fetchHistoricalRatesRequest, synth, selectedPeriod.period]);

		useInterval(() => {
			fetchHistoricalRatesRequest({ synths: [synth], periods: [selectedPeriod.period] });
		}, DEFAULT_REQUEST_REFRESH_INTERVAL);

		useEffect(() => {
			const historicalRates: HistoricalRatesData | null = get(
				synthsWithRatesMap,
				[synth.name, 'historicalRates', selectedPeriod.period, 'data'],
				null
			);

			if (historicalRates != null) {
				setLoading(false);
				setHistoricalRatesUpdates(historicalRates?.rates || []);
				setHistoricalRatesChange(historicalRates?.change || null);
			} else {
				setLoading(true);
			}
		}, [synthsWithRatesMap, selectedPeriod.period, synth.name]);

		const lastPrice = get(synthsWithRatesMap, [synth.name, 'lastPrice'], null);
		const synthSign = synthsMap[SYNTHS_MAP.sUSD].sign;

		return (
			<StyledChartCard
				tooltipVisible={true}
				currencyLabel={<Currency.Name currencyKey={synth.name} showIcon={true} />}
				price={lastPrice != null ? formatCurrencyWithSign(synthSign, lastPrice) : null}
				change={historicalRateChange}
				chartData={historicalRateUpdates}
				variableGradient={false}
				selectedPeriod={selectedPeriod}
				onPeriodClick={setSelectedPeriod}
				showLoader={loading}
				synthSign={synthSign}
				xAxisVisible={true}
			/>
		);
	}
);

const StyledChartCard = styled(ChartCard)`
	height: 450px;
	${media.large`
		border-radius: 0;
		height: 340px;
	`}
	.currency-key {
		font-size: 20px;
	}

	.currency-price {
		font-size: 24px;
	}
	.change-percent {
		min-width: 60px;
		text-align: center;
	}
	.recharts-default-tooltip {
		background: ${darkTheme.colors.surfaceL1} !important;
	}
	.recharts-tooltip-label,
	.recharts-tooltip-item {
		color: ${darkTheme.colors.white} !important;
	}
`;

const mapStateToProps = (state: RootState): StateProps => ({
	synthsMap: getAvailableSynthsMap(state),
	synthsWithRatesMap: getSynthsWithRatesMap(state),
});

const mapDispatchToProps: DispatchProps = {
	fetchHistoricalRatesRequest,
};

export default connect<StateProps, DispatchProps, Props, RootState>(
	mapStateToProps,
	mapDispatchToProps
)(SynthChart);
