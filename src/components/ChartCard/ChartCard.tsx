import React, { useContext, FC, memo } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from 'recharts';

import ChangePercent from '../ChangePercent';

import { FlexDivRow } from 'shared/commonStyles';

import { EMPTY_VALUE } from 'constants/placeholder';
import { RateUpdates } from 'constants/rates';

type ChartCardProps = {
	currencyLabel: React.ReactNode;
	change: number | null;
	chartData: RateUpdates;
	price: number | string | null;
	onClick?: () => void;
	variableGradient?: boolean;
	labelPosition?: 'up' | 'down';
	className?: string;
};

export const ChartCard: FC<ChartCardProps> = memo(
	({
		currencyLabel,
		price,
		change,
		chartData = [],
		onClick,
		className,
		labelPosition = 'up',
		variableGradient = false,
	}) => {
		const { colors } = useContext(ThemeContext);

		let linearGradientId = 'cardChartArea';
		let chartColor = colors.hyperlink;

		if (change != null && variableGradient) {
			if (change >= 0) {
				linearGradientId = 'cardChartAreaGreen';
				chartColor = colors.green;
			} else {
				linearGradientId = 'cardChartAreaRed';
				chartColor = colors.red;
			}
		}

		return (
			<Container onClick={onClick} className={className}>
				<LabelsContainer>
					{labelPosition === 'up' ? (
						<UpperLabels>
							<Currency>{currencyLabel}</Currency>
							<CurrencyPrice>{price == null ? EMPTY_VALUE : price}</CurrencyPrice>
						</UpperLabels>
					) : (
						<div />
					)}
					{change != null && (
						<ChangePercent
							value={change}
							isLabel={true}
							labelSize={labelPosition === 'up' ? 'md' : 'sm'}
						/>
					)}
				</LabelsContainer>
				<ChartData className="chart-data">
					{/* https://github.com/recharts/recharts/issues/1423 */}
					<ResponsiveContainer width="99%" height="100%">
						<AreaChart data={chartData}>
							<defs>
								<linearGradient id={linearGradientId} x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor={chartColor} stopOpacity={0.5} />
									<stop offset="95%" stopColor={chartColor} stopOpacity={0} />
								</linearGradient>
							</defs>
							<XAxis dataKey="timestamp" hide={true} />
							<YAxis type="number" domain={['auto', 'auto']} hide={true} />
							<Area
								dataKey="rate"
								stroke={chartColor}
								fillOpacity={0.5}
								fill={`url(#${linearGradientId})`}
								isAnimationActive={false}
							/>
						</AreaChart>
					</ResponsiveContainer>
				</ChartData>
				{labelPosition === 'down' && (
					<BottomLabels>
						<Currency>{currencyLabel}</Currency>
						<CurrencyPrice>{price == null ? EMPTY_VALUE : price}</CurrencyPrice>
					</BottomLabels>
				)}
			</Container>
		);
	}
);

const Container = styled.div`
	background-color: ${(props) => props.theme.colors.surfaceL1};
	border: 1px solid ${(props) => props.theme.colors.accentL1};
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
	cursor: ${(props) => (props.onClick ? 'pointer' : 'default')};
`;

const LabelsContainer = styled(FlexDivRow)`
	align-items: flex-start;
`;

const UpperLabels = styled.div`
	display: grid;
	grid-auto-flow: row;
	grid-gap: 5px;
`;

const BottomLabels = styled.div`
	display: flex;
	justify-content: space-between;
`;

const Currency = styled.span`
	color: ${(props) => props.theme.colors.fontPrimary};
`;

const CurrencyPrice = styled.span`
	color: ${(props) => props.theme.colors.fontSecondary};
`;

const ChartData = styled.div`
	pointer-events: none;
`;

export default ChartCard;
