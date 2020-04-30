import React, { useContext } from 'react';
import { connect } from 'react-redux';
import styled, { ThemeContext } from 'styled-components';
import { ResponsiveContainer, AreaChart, XAxis, YAxis, Area, Tooltip } from 'recharts';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { getSynthPair, getAvailableSynthsMap } from 'ducks/synths';

import { DataLarge } from 'components/Typography';
import Spinner from 'components/Spinner';
import { formatCurrencyWithPrecision } from 'utils/formatters';

const Chart = ({ synthPair: { quote }, data, isLoading, period, synthsMap }) => {
	const { colors } = useContext(ThemeContext);
	const { t } = useTranslation();
	const synthSign = synthsMap[quote.name] && synthsMap[quote.name].sign;

	return (
		<ChartContainer>
			{isLoading ? <Spinner size="sm" /> : null}
			{!isLoading && data.rates.length === 0 ? (
				<DataLarge>{t('common.chart.no-data-available')}</DataLarge>
			) : null}
			{!isLoading && data.rates && data.rates.length > 0 ? (
				<ResponsiveContainer width="99.9%" height={250}>
					<AreaChart data={data.rates} margin={{ top: 0, right: -6, left: 10, bottom: 0 }}>
						<defs>
							<linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor={colors.hyperlink} stopOpacity={0.5} />
								<stop offset="95%" stopColor={colors.hyperlink} stopOpacity={0} />
							</linearGradient>
						</defs>
						<XAxis
							tick={{ fontSize: '9px', fill: colors.fontTertiary }}
							dataKey="timestamp"
							tickFormatter={(val) =>
								period.value > 24 ? format(val, 'DD MMM') : format(val, 'h:mma')
							}
							axisLine={false}
							tickLine={false}
						/>
						<YAxis
							type="number"
							domain={['auto', 'auto']}
							tickFormatter={(val) => `${synthSign}${formatCurrencyWithPrecision(val)}`}
							tick={{ fontSize: '9px', fill: colors.fontTertiary }}
							orientation="right"
							axisLine={false}
							tickLine={false}
						/>
						<Area dataKey="rate" stroke={colors.hyperlink} fillOpacity={0.5} fill="url(#colorUv)" />
						<Tooltip
							cursor={{ strokeWidth: 1, stroke: colors.fontTertiary }}
							contentStyle={{
								border: `none`,
								borderRadius: '3px',
								backgroundColor: colors.surfaceL1,
							}}
							itemStyle={{
								color: colors.fontTertiary,
								fontSize: '12px',
								textTransform: 'capitalize',
							}}
							labelStyle={{
								color: colors.fontTertiary,
								fontSize: '12px',
							}}
							formatter={(value) => `${synthSign}${formatCurrencyWithPrecision(value)}`}
							labelFormatter={(label) => format(label, 'Do MMM YY | HH:mm')}
						/>
					</AreaChart>
				</ResponsiveContainer>
			) : null}
		</ChartContainer>
	);
};

const ChartContainer = styled.div`
	width: 100%;
	height: 250px;
	display: flex;
	justify-content: center;
	align-items: center;
	.recharts-yAxis .yAxis,
	.recharts-xAxis .xAxis {
		display: none;
	}
`;

const mapStateToProps = (state) => ({
	synthPair: getSynthPair(state),
	synthsMap: getAvailableSynthsMap(state),
});

export default connect(mapStateToProps, null)(Chart);
