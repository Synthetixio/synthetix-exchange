import React, { useContext, FC, memo } from 'react';
import styled, { css, ThemeContext } from 'styled-components';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine, Label } from 'recharts';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

import ChangePercent from '../ChangePercent';
import RechartsResponsiveContainer from '../RechartsResponsiveContainer';

import {
	FlexDivRow,
	GridDivCenteredCol,
	GridDivRow,
	absoluteCenteredCSS,
} from 'shared/commonStyles';

import { EMPTY_VALUE } from 'constants/placeholder';
import { BaseRateUpdates } from 'constants/rates';
import { PERIOD_LABELS, PeriodLabel, PERIOD_IN_HOURS } from 'constants/period';
import { Button } from 'components/Button';
import Spinner from 'components/Spinner';
import { formatCurrencyWithSign } from 'utils/formatters';
import { media } from 'shared/media';
import { AxisDomain } from 'recharts/types/util/types';
import { darkTheme, lightTheme } from 'styles/theme';

type ChartCardProps = {
	currencyLabel: React.ReactNode;
	change: number | null;
	chartData: BaseRateUpdates;
	price: number | string | null;
	onClick?: () => void;
	variableGradient?: boolean;
	labelPosition?: 'up' | 'down';
	className?: string;
	tooltipVisible?: boolean;
	selectedPeriod?: PeriodLabel;
	onPeriodClick?: (period: PeriodLabel) => void;
	showLoader?: boolean;
	synthSign?: string;
	xAxisVisible?: boolean;
	yAxisVisible?: boolean;
	yAxisDomain?: AxisDomain;
	yAxisRefLines?: Array<{
		label: string | number | React.ReactNode;
		value: string | number;
	}>;
	overlayMessage?: React.ReactNode;
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
		tooltipVisible = false,
		onPeriodClick,
		selectedPeriod,
		showLoader = false,
		synthSign,
		xAxisVisible = false,
		yAxisVisible = false,
		yAxisDomain,
		yAxisRefLines,
		overlayMessage,
	}) => {
		const { t } = useTranslation();
		const theme = useContext(ThemeContext);

		let linearGradientId = 'cardChartArea';
		let chartColor = theme.colors.hyperlink;

		if (change != null && variableGradient) {
			if (change >= 0) {
				linearGradientId = 'cardChartAreaGreen';
				chartColor = theme.colors.green;
			} else {
				linearGradientId = 'cardChartAreaRed';
				chartColor = theme.colors.red;
			}
		}

		const fontStyle = {
			fontSize: '12px',
			fill: theme.colors.fontTertiary,
			fontFamily: theme.fonts.regular,
		};

		const fontStyleMedium = {
			...fontStyle,
			fontFamily: theme.fonts.medium,
		};

		const showOverlayMessage = !!overlayMessage;

		const disabledInteraction = showLoader || !tooltipVisible || showOverlayMessage;

		return (
			<Container onClick={onClick} className={className}>
				<LabelsContainer className="labels-container">
					{labelPosition === 'up' ? (
						<UpperLabels>
							<Currency className="currency-key">{currencyLabel}</Currency>
							<CurrencyPrice className="currency-price">
								{price == null ? EMPTY_VALUE : price}
							</CurrencyPrice>
						</UpperLabels>
					) : (
						<div />
					)}
					<PeriodsAndChange>
						{onPeriodClick && selectedPeriod && (
							<Periods>
								{PERIOD_LABELS.map((period) => (
									<Button
										key={period.value}
										palette="secondary"
										size="xs"
										isActive={period.value === selectedPeriod?.value}
										onClick={() => onPeriodClick(period)}
										disabled={disabledInteraction}
									>
										{t(period.i18nLabel)}
									</Button>
								))}
							</Periods>
						)}
						{change != null && (
							<ChangePercent
								value={change}
								isLabel={true}
								labelSize={labelPosition === 'up' ? 'md' : 'sm'}
								className="change-percent"
							/>
						)}
					</PeriodsAndChange>
				</LabelsContainer>
				<ChartData
					className="chart-data"
					disabledInteraction={disabledInteraction}
					semiTransparent={showLoader || showOverlayMessage}
				>
					<RechartsResponsiveContainer width="100%" height="100%">
						<AreaChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
							<defs>
								<linearGradient id={linearGradientId} x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor={chartColor} stopOpacity={0.5} />
									<stop offset="95%" stopColor={chartColor} stopOpacity={0} />
								</linearGradient>
							</defs>
							<XAxis
								dataKey="timestamp"
								allowDataOverflow={true}
								tick={fontStyleMedium}
								axisLine={false}
								tickLine={false}
								hide={!xAxisVisible}
								tickFormatter={(val) => {
									const periodOverOneDay =
										selectedPeriod != null && selectedPeriod.value > PERIOD_IN_HOURS.ONE_DAY;

									return format(val, periodOverOneDay ? 'DD MMM' : 'h:mma');
								}}
							/>
							<YAxis
								type="number"
								allowDataOverflow={true}
								domain={yAxisDomain ? yAxisDomain : ['auto', 'auto']}
								tick={fontStyleMedium}
								orientation="right"
								axisLine={false}
								tickLine={false}
								hide={!yAxisVisible}
								tickFormatter={(val) => formatCurrencyWithSign(synthSign, val)}
							/>
							<Area
								dataKey="rate"
								stroke={chartColor}
								fillOpacity={0.5}
								fill={`url(#${linearGradientId})`}
								isAnimationActive={false}
							/>
							{yAxisRefLines &&
								yAxisRefLines.map((refLine) => (
									<ReferenceLine
										key={refLine.value}
										y={refLine.value}
										stroke={
											theme.name === 'light'
												? darkTheme.colors.fontSecondary
												: lightTheme.colors.fontSecondary
										}
										strokeDasharray="5 2"
									>
										<Label position="insideBottomRight">{refLine.label}</Label>
									</ReferenceLine>
								))}
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
								formatter={(val: string | number) => formatCurrencyWithSign(synthSign, val)}
								labelFormatter={(label) => format(label, 'Do MMM YY | HH:mm')}
							/>
						</AreaChart>
					</RechartsResponsiveContainer>
				</ChartData>
				{showOverlayMessage ? (
					<OverlayMessage>{overlayMessage}</OverlayMessage>
				) : showLoader ? (
					<Spinner size="sm" centered={true} />
				) : undefined}
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

const OverlayMessage = styled.div`
	${absoluteCenteredCSS};
	color: ${(props) => props.theme.colors.fontPrimary};
	font-size: 20px;
`;

const Container = styled.div`
	position: relative;
	background-color: ${(props) => props.theme.colors.surfaceL3};
	border: 1px solid ${(props) => props.theme.colors.accentL1};
	box-shadow: 0px 4px 11px rgba(188, 99, 255, 0.15442);
	border-radius: 2px;
	width: 100%;
	height: 180px;
	padding: 10px;
	box-sizing: border-box;
	display: grid;
	grid-template-rows: auto 1fr;
	grid-gap: 10px;
	font-size: 13px;
	cursor: ${(props) => (props.onClick ? 'pointer' : 'default')};
`;

const LabelsContainer = styled(FlexDivRow)`
	align-items: flex-start;
`;

const UpperLabels = styled(GridDivRow)`
	grid-gap: 5px;
`;

const PeriodsAndChange = styled(GridDivCenteredCol)`
	grid-gap: 16px;
`;

const Periods = styled(GridDivCenteredCol)`
	grid-gap: 8px;
	${media.small`
		display: none;
	`}
`;

const BottomLabels = styled.div`
	display: flex;
	justify-content: space-between;
`;

const Currency = styled.span`
	color: ${(props) => props.theme.colors.fontSecondary};
`;

const CurrencyPrice = styled.span`
	color: ${(props) => props.theme.colors.fontPrimary};
`;

const ChartData = styled.div<{ disabledInteraction: boolean; semiTransparent: boolean }>`
	${(props) =>
		props.disabledInteraction &&
		css`
			pointer-events: none;
		`};

	${(props) =>
		props.semiTransparent &&
		css`
			opacity: 0.5;
			filter: blur(3px);
		`}
`;

export default ChartCard;
