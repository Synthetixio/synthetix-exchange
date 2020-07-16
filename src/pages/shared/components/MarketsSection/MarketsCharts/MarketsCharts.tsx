import React, { FC } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { getAvailableSynthsMap, SynthDefinitionMap } from 'ducks/synths';

import ChartCard from 'components/ChartCard/ChartCard';

import { navigateToTrade } from 'constants/routes';

import { media } from 'shared/media';

import { formatCurrencyPair, formatCurrencyWithSign } from 'utils/formatters';

import { shiftUpHoverEffectCSS } from 'shared/commonStyles';
import { RootState } from 'ducks/types';
import { MarketPairs } from 'ducks/markets';

const CHART_CARDS = 4;

type StateProps = {
	synthsMap: SynthDefinitionMap;
};

type Props = {
	marketsLoaded: boolean;
	markets: MarketPairs;
};

type MarketsChartsProps = StateProps & Props;

export const MarketsCharts: FC<MarketsChartsProps> = ({ markets, synthsMap, marketsLoaded }) => (
	<Container>
		{markets
			.slice(0, Math.min(CHART_CARDS, markets.length))
			.map(({ quoteCurrencyKey, pair, baseCurrencyKey, lastPrice, rates24hChange, rates }) => {
				const sign = synthsMap[quoteCurrencyKey] && synthsMap[quoteCurrencyKey].sign;

				return (
					<StyledChartCard
						key={pair}
						currencyLabel={formatCurrencyPair(baseCurrencyKey, quoteCurrencyKey)}
						price={lastPrice != null ? formatCurrencyWithSign(sign, lastPrice) : null}
						change={rates24hChange}
						chartData={marketsLoaded ? rates : []}
						onClick={() => navigateToTrade(baseCurrencyKey, quoteCurrencyKey)}
					/>
				);
			})}
	</Container>
);

const Container = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr;
	grid-gap: 24px;
	justify-content: center;

	${media.large`
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 1fr;
		grid-gap: 30px;
	`}
	${media.small`
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
		grid-gap: 30px;
	`}
`;

const StyledChartCard = styled(ChartCard)`
	background-color: ${(props) => props.theme.colors.white};
	${shiftUpHoverEffectCSS};
`;

const mapStateToProps = (state: RootState): StateProps => ({
	synthsMap: getAvailableSynthsMap(state),
});

export default connect<StateProps, {}, Props, RootState>(mapStateToProps)(MarketsCharts);
