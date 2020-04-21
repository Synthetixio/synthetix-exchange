import React, { FC, memo, useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis } from 'recharts';

import { RateUpdates } from 'constants/rates';

type TrendLineChartProps = {
	change: number;
	chartData: RateUpdates;
	onClick?: () => void;
	className?: string;
};

export const TrendLineChart: FC<TrendLineChartProps> = memo(
	({ change, chartData = [], onClick, className }) => {
		const { colors } = useContext(ThemeContext);

		return (
			<Container onClick={onClick} className={className}>
				{/* https://github.com/recharts/recharts/issues/1423 */}
				<ResponsiveContainer width="99%" height="100%">
					<LineChart data={chartData}>
						<XAxis dataKey="timestamp" reversed={true} hide={true} />
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
				</ResponsiveContainer>
			</Container>
		);
	}
);

const Container = styled.div`
	width: 100%;
	height: 100%;
`;

export default TrendLineChart;
