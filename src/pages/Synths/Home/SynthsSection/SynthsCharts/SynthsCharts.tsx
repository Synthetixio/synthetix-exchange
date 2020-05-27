import React, { FC, memo } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import get from 'lodash/get';

import { getAvailableSynthsMap, SynthDefinitionWithRates, SynthDefinitionMap } from 'ducks/synths';

import ChartCard from 'components/ChartCard/ChartCard';

import { navigateToSynthOverview } from 'constants/routes';

import { media } from 'shared/media';

import { formatCurrencyWithSign } from 'utils/formatters';

import { shiftUpHoverEffectCSS } from 'shared/commonStyles';
import { SYNTHS_MAP } from 'constants/currency';
import { RootState } from 'ducks/types';
import { HistoricalRatesData } from 'ducks/historicalRates';
import { captionCSS } from 'components/Typography/Caption';

type StateProps = {
	synthsMap: SynthDefinitionMap;
};

type Props = {
	synthsWithRates: SynthDefinitionWithRates[];
	maxTopSynths: number;
};

type SynthsCharts = StateProps & Props;

export const SynthsCharts: FC<SynthsCharts> = memo(
	({ synthsWithRates, synthsMap, maxTopSynths }) => {
		const { t } = useTranslation();

		const charts = synthsWithRates.map(({ name, historicalRates, lastPrice }) => {
			const historicalData: HistoricalRatesData | null = get(historicalRates, 'ONE_DAY.data', null);
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
					onClick={() => navigateToSynthOverview(name)}
					variableGradient={true}
					labelPosition="down"
				/>
			);
		});

		const gainers = charts.slice(0, maxTopSynths);
		const losers = charts.slice(-maxTopSynths);

		return (
			<GridContainer>
				<GridItem>
					<Gainers>{t('synths.home.charts.biggest-gainers-24h')}</Gainers>
					<Charts>{gainers}</Charts>
				</GridItem>
				<GridItem>
					<Losers>{t('synths.home.charts.biggest-losers-24h')}</Losers>
					<Charts>{losers}</Charts>
				</GridItem>
			</GridContainer>
		);
	}
);

const GridContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-gap: 12px;
	justify-content: center;

	${media.large`
		grid-template-columns: 1fr;
		grid-template-rows: 1fr 1fr;
		grid-gap: 30px;
	`}
`;

const GridItem = styled.div`
	display: grid;
	grid-template-rows: auto 1fr;
	grid-gap: 20px;
`;

const ChartLabel = styled.div`
	${captionCSS};
	color: ${({ theme }) => theme.colors.white};
	padding: 5px 10px;
	min-width: 181px;
	box-sizing: border-box;
	border-radius: 1px;
	text-align: center;
	justify-self: flex-start;

	${media.small`
		justify-self: initial;
	`}
`;

const Gainers = styled(ChartLabel)`
	background-color: ${({ theme }) => theme.colors.green};
`;

const Losers = styled(ChartLabel)`
	background-color: ${({ theme }) => theme.colors.red};
	justify-self: flex-end;

	${media.large`
		justify-self: flex-start;
	`}

	${media.medium`
		justify-self: flex-start;
	`}

	${media.small`
		justify-self: initial;
	`}
`;

const Charts = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	grid-gap: 12px;
	justify-content: center;

	${media.small`
		grid-template-columns: 1fr;
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
