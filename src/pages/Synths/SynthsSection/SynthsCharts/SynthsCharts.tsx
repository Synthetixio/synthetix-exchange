import React, { FC, memo } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import get from 'lodash/get';

import { getAvailableSynthsMap, SynthDefinitionWithRates, SynthDefinitionMap } from 'ducks/synths';

import ChartCard from 'components/ChartCard/ChartCard';

import { navigateToTrade } from 'constants/routes';

import { media } from 'shared/media';

import { formatCurrencyWithSign } from 'utils/formatters';

import { shiftUpHoverEffectCSS } from 'shared/commonStyles';
import { SYNTHS_MAP } from 'constants/currency';
import { RootState } from 'ducks/types';
import { HistoricalRatesData } from 'ducks/historicalRates';

type StateProps = {
	synthsMap: SynthDefinitionMap;
};

type Props = {
	synthsWithRates: SynthDefinitionWithRates[];
};

type SynthsCharts = StateProps & Props;

export const SynthsCharts: FC<SynthsCharts> = memo(({ synthsWithRates, synthsMap }) => (
	<Container>
		{[...synthsWithRates.slice(0, 3), ...synthsWithRates.slice(-3)].map(
			({ name, historicalRates, lastPrice }) => {
				const historicalData: HistoricalRatesData | null = get(
					historicalRates,
					'ONE_DAY.data',
					null
				);
				const chartData = historicalData != null ? historicalData.rates : null;
				const change = historicalData != null ? historicalData.change : null;

				return (
					<StyledChartCard
						key={name}
						currencyLabel={name}
						price={
							lastPrice != null
								? formatCurrencyWithSign(synthsMap[SYNTHS_MAP.sUSD].sign, lastPrice)
								: null
						}
						change={change}
						chartData={chartData || []}
						onClick={() => navigateToTrade(name, SYNTHS_MAP.sUSD)}
						variableGradient={true}
						labelPosition="down"
					/>
				);
			}
		)}
	</Container>
));

const Container = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
	grid-gap: 24px;
	justify-content: center;

	${media.large`
		grid-template-columns: 1fr 1fr 1fr;
		grid-template-rows: 1fr 1fr 1fr;
		grid-gap: 30px;
	`}
	${media.small`
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
		grid-gap: 30px;
	`}
`;

const StyledChartCard = styled(ChartCard)`
	height: 130px;
	background-color: ${(props) => props.theme.colors.white};
	${shiftUpHoverEffectCSS};
	.chart-data {
		height: 50px;
	}
`;

const mapStateToProps = (state: RootState): StateProps => ({
	synthsMap: getAvailableSynthsMap(state),
});

export default connect<StateProps, {}, {}, RootState>(mapStateToProps)(SynthsCharts);
