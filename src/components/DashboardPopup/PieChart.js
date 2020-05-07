import React from 'react';
import styled from 'styled-components';
import { PieChart, Pie, ResponsiveContainer, Cell } from 'recharts';

import { FlexDivCentered } from 'src/shared/commonStyles';
import { LabelSmall } from 'src/components/Typography';

const COLORS = ['#98F070', '#00E2DF', '#3A68F6', '#A029ED', '#EA5281', '#FFDB59'];

const Chart = ({ data = [] }) => {
	return (
		<ChartContainer>
			<ResponsiveContainer width="100%" height={250}>
				<PieChart height={250}>
					<Pie
						blendStroke={true}
						data={data}
						cx="50%"
						cy="50%"
						outerRadius={100}
						dataKey="total"
						stroke=""
					>
						{data.map((entry, i) => (
							<Cell key={`cell-${entry.name}`} fill={COLORS[i % COLORS.length]}></Cell>
						))}
					</Pie>
				</PieChart>
			</ResponsiveContainer>
			<Legend>
				{data.map((entry, i) => (
					<LegendItem key={`legend-${entry.name}`}>
						<LegendSquare style={{ background: COLORS[i % COLORS.length] }}></LegendSquare>
						<LabelSmall>{entry.name}</LabelSmall>
					</LegendItem>
				))}
			</Legend>
		</ChartContainer>
	);
};

const ChartContainer = styled.div`
	width: 250px;
	height: 250px;
`;

const Legend = styled(FlexDivCentered)`
	justify-content: space-between;
`;

const LegendItem = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
`;

const LegendSquare = styled.div`
	width: 18px;
	height: 18px;
	border-radius: 2px;
	margin-bottom: 12px;
`;

export default Chart;
