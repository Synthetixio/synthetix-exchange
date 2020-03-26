import React, { memo } from 'react';
import styled, { withTheme } from 'styled-components';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from 'recharts';

import PropTypes from 'prop-types';

import ChangePercent from '../ChangePercent';

import { FlexDivRow } from 'src/shared/commonStyles';
import { formatCurrencyPair } from 'src/utils/formatters';

import { EMPTY_VALUE } from 'src/constants/placeholder';

export const ChartCard = memo(
	({
		baseCurrencyKey,
		quoteCurrencyKey,
		price,
		change,
		chartData = [],
		theme: { colors },
		onClick,
		...rest
	}) => (
		<Container onClick={onClick} {...rest}>
			<LabelsContainer>
				<Labels>
					<Currency>{formatCurrencyPair(baseCurrencyKey, quoteCurrencyKey)}</Currency>
					<CurrencyPrice>{price == null ? EMPTY_VALUE : price}</CurrencyPrice>
				</Labels>
				{change != null && <ChangePercent value={change} isLabel={true} />}
			</LabelsContainer>
			<ChartData>
				{/* https://github.com/recharts/recharts/issues/1423 */}
				<ResponsiveContainer width="99%" height="100%">
					<AreaChart data={chartData}>
						<defs>
							<linearGradient id="chartChartArea" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor={colors.hyperlink} stopOpacity={0.5} />
								<stop offset="95%" stopColor={colors.hyperlink} stopOpacity={0} />
							</linearGradient>
						</defs>
						<XAxis dataKey="timestamp" reversed={true} hide={true} />
						<YAxis type="number" domain={['auto', 'auto']} hide={true} />
						<Area
							dataKey="rate"
							stroke={colors.hyperlink}
							fillOpacity={0.5}
							fill="url(#chartChartArea)"
							isAnimationActive={false}
						/>
					</AreaChart>
				</ResponsiveContainer>
			</ChartData>
		</Container>
	)
);

const Container = styled.div`
	background-color: ${props => props.theme.colors.surfaceL1};
	border: 1px solid ${props => props.theme.colors.accentL1};
	box-shadow: 0px 4px 11px rgba(188, 99, 255, 0.15442);
	border-radius: 2px;
	width: 100%;
	height: 180px;
	padding: 10px;
	box-sizing: border-box;
	display: grid;
	grid-auto-flow: row;
	grid-gap: 10px;
	font-size: 13px;
	cursor: ${props => (props.onClick ? 'pointer' : 'default')};
`;

const LabelsContainer = styled(FlexDivRow)`
	align-items: flex-start;
`;

const Labels = styled.div`
	display: grid;
	grid-auto-flow: row;
	grid-gap: 5px;
`;

const Currency = styled.span`
	color: ${props => props.theme.colors.fontPrimary};
`;

const CurrencyPrice = styled.span`
	color: ${props => props.theme.colors.fontSecondary};
`;

const ChartData = styled.div`
	height: 120px;
	pointer-events: none;
`;

ChartCard.propTypes = {
	baseCurrencyKey: PropTypes.string.isRequired,
	price: PropTypes.string,
	change: PropTypes.number,
	chartData: PropTypes.array,
};

export default withTheme(ChartCard);
