import React, { useMemo, FC, useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { LineChart, XAxis, YAxis, Line, Tooltip } from 'recharts';
import format from 'date-fns/format';
import isNumber from 'lodash/isNumber';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import snxData from 'synthetix-data';

import { USD_SIGN } from 'constants/currency';

import { formatCurrencyWithSign } from 'utils/formatters';

import { PeriodLabel, PERIOD_IN_HOURS } from 'constants/period';
import RechartsResponsiveContainer from 'components/RechartsResponsiveContainer';
import Spinner from 'components/Spinner';

import QUERY_KEYS from 'constants/queryKeys';

import { ChartContainer } from '../common';
import { OptionsMarketInfo, OptionsTransactions } from 'ducks/options/types';
import { GridDivCenteredRow, absoluteCenteredCSS } from 'shared/commonStyles';
import { subtitleSmallCSS } from 'components/Typography/General';

type OptionsChartProps = {
	selectedPeriod: PeriodLabel;
	optionsMarket: OptionsMarketInfo;
};

const OptionsChart: FC<OptionsChartProps> = ({ selectedPeriod, optionsMarket }) => {
	const { t } = useTranslation();

	const theme = useContext(ThemeContext);

	const historicalOptionPriceQuery = useQuery(
		QUERY_KEYS.BinaryOptions.OptionPrices(optionsMarket.address, selectedPeriod.period),
		() => snxData.binaryOptions.historicalOptionPrice({ market: optionsMarket.address })
	);

	const chartData: OptionsTransactions = useMemo(() => {
		const data = historicalOptionPriceQuery.data || [];
		if (data.length) {
			return [...data].reverse();
		}
		return [];
	}, [historicalOptionPriceQuery.data]);

	const isLoading = historicalOptionPriceQuery.isLoading;
	const noResults = historicalOptionPriceQuery.isSuccess && chartData.length < 2;

	const fontStyle = {
		fontSize: '10px',
		fill: theme.colors.fontTertiary,
		fontFamily: theme.fonts.regular,
	};

	const fontStyleMedium = {
		...fontStyle,
		fontFamily: theme.fonts.medium,
	};

	return (
		<>
			<ChartContainer semiTransparent={isLoading}>
				<RechartsResponsiveContainer width="100%" height="100%">
					<LineChart
						data={noResults ? [] : chartData}
						margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
					>
						<XAxis
							dataKey="timestamp"
							tick={fontStyleMedium}
							axisLine={false}
							tickLine={false}
							tickFormatter={(val) => {
								if (!isNumber(val)) {
									return '';
								}
								const periodOverOneDay =
									selectedPeriod != null && selectedPeriod.value > PERIOD_IN_HOURS.ONE_DAY;

								return format(val, periodOverOneDay ? 'dd MMM' : 'h:mma');
							}}
						/>
						<YAxis
							type="number"
							domain={[0, 1]}
							orientation="right"
							tick={fontStyleMedium}
							axisLine={false}
							tickLine={false}
							tickFormatter={(val) => t('common.val-in-cents', { val })}
						/>
						<Line
							type="monotone"
							dataKey="longPrice"
							stroke={theme.colors.green}
							isAnimationActive={false}
						/>
						<Line
							type="monotone"
							dataKey="shortPrice"
							stroke={theme.colors.red}
							isAnimationActive={false}
						/>
						{!noResults && (
							<Tooltip
								className="tooltip"
								// @ts-ignore
								cursor={{ strokeWidth: 1, stroke: theme.colors.fontTertiary }}
								contentStyle={{
									border: 'none',
									borderRadius: '3px',
									backgroundColor: theme.colors.surfaceL1,
								}}
								itemStyle={{
									...fontStyle,
									textTransform: 'capitalize',
								}}
								labelStyle={fontStyle}
								formatter={(val: string | number) => formatCurrencyWithSign(USD_SIGN, val)}
								labelFormatter={(label) => {
									if (!isNumber(label)) {
										return '';
									}
									return format(label, 'do MMM yy | HH:mm');
								}}
							/>
						)}
					</LineChart>
				</RechartsResponsiveContainer>
			</ChartContainer>
			{isLoading && <Spinner size="sm" centered={true} />}
			{noResults && <NoResults>{t('options.market.chart-card.no-results')}</NoResults>}
		</>
	);
};

const NoResults = styled(GridDivCenteredRow)`
	${absoluteCenteredCSS};
	${subtitleSmallCSS};
	color: ${(props) => props.theme.colors.fontPrimary};
`;

export default OptionsChart;
