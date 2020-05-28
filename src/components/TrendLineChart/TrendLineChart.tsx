import React, { FC, memo, useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { LineChart, Line, XAxis, YAxis } from 'recharts';

import { BaseRateUpdates } from 'constants/rates';
import RechartsResponsiveContainer from 'components/RechartsResponsiveContainer';

type TrendLineChartProps = {
	change: number;
	chartData: BaseRateUpdates;
	onClick?: () => void;
	className?: string;
};

export const TrendLineChart: FC<TrendLineChartProps> = memo(
	({ change, chartData = [], onClick, className }) => {
		const { colors } = useContext(ThemeContext);

		return (
			<Container onClick={onClick} className={className}>
				<RechartsResponsiveContainer width="100%" height="100%">
					<LineChart data={chartData}>
						<XAxis dataKey="timestamp" hide={true} />
						<YAxis type="number" domain={['auto', 'auto']} hide={true} />
						<Line
							dataKey="rate"
							stroke={change >= 0 ? colors.green : colors.red}
							dot={false}
							strokeWidth={1.5}
							activeDot={false}
							isAnimationActive={false}
						/>
					</LineChart>
				</RechartsResponsiveContainer>
			</Container>
		);
	}
);

const Container = styled.div`
	width: 100%;
	height: 100%;
`;

export default TrendLineChart;
