import React, { memo } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import PropTypes from 'prop-types';
import ChartCard from '../../../../components/ChartCard/ChartCard';

import { lightTheme } from '../../../../styles/theme';

import { navigateToTrade } from '../../../../constants/routes';
import { EMPTY_BALANCE } from '../../../../constants/placeholder';

import { formatCurrencyWithSign } from '../../../../utils/formatters';

const CHART_CARDS = 4;

export const MarketsCharts = memo(({ synthsRates, synthsMap }) => (
	<ThemeProvider theme={lightTheme}>
		<Container>
			{synthsRates
				.slice(0, Math.min(CHART_CARDS, synthsRates.length))
				.map(({ quoteCurrencyKey, pair, baseCurrencyKey, lastPrice, rates24hChange, rates }) => {
					const sign = synthsMap[quoteCurrencyKey] && synthsMap[quoteCurrencyKey].sign;

					return (
						<ChartCard
							key={pair}
							baseCurrencyKey={baseCurrencyKey}
							quoteCurrencyKey={quoteCurrencyKey}
							price={
								lastPrice === EMPTY_BALANCE
									? EMPTY_BALANCE
									: formatCurrencyWithSign(sign, lastPrice)
							}
							change={rates24hChange}
							chartData={rates}
							onClick={() => navigateToTrade(baseCurrencyKey, quoteCurrencyKey)}
						/>
					);
				})}
		</Container>
	</ThemeProvider>
));

const Container = styled.div`
	transform: translateY(-50%);
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr;
	grid-gap: 24px;
	justify-content: center;
	@media (max-width: 1140px) {
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 1fr;
		grid-row-gap: 10px;
	}
	@media (max-width: 580px) {
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
		grid-row-gap: 10px;
	}
`;

MarketsCharts.propTypes = {
	synthsRates: PropTypes.array.isRequired,
	synthsMap: PropTypes.object,
};

export default MarketsCharts;
