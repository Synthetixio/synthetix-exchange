import React, { memo, FC, useContext, useState } from 'react';
import styled, { css, ThemeContext } from 'styled-components';
import { ComposedChart, Area, XAxis, YAxis, Tooltip, ReferenceLine, Label, Line } from 'recharts';
import { useTranslation } from 'react-i18next';
import format from 'date-fns/format';
import isNumber from 'lodash/isNumber';
import get from 'lodash/get';
import { useQuery } from 'react-query';

import { FIAT_CURRENCY_MAP, USD_SIGN } from 'constants/currency';
import { BaseRateUpdates } from 'constants/rates';

import { formatCurrencyWithSign, formatCurrency } from 'utils/formatters';
import { GridDivCenteredCol, Dot } from 'shared/commonStyles';

import Card from 'components/Card';
import { PeriodLabel, PERIOD_LABELS_MAP, PERIOD_LABELS, PERIOD_IN_HOURS } from 'constants/period';
import { Button } from 'components/Button';
import Currency from 'components/Currency';
import RechartsResponsiveContainer from 'components/RechartsResponsiveContainer';
import Spinner from 'components/Spinner';

import QUERY_KEYS from 'constants/queryKeys';

import { useMarketContext } from '../contexts/MarketContext';
import { fetchSynthRateUpdate } from 'services/rates/rates';

const Market: FC = memo(() => {
	const [selectedPeriod, setSelectedPeriod] = useState<PeriodLabel>(PERIOD_LABELS_MAP.FOUR_HOURS);
	const [longOverlayVisible, setLongOverlayVisible] = useState<boolean>(true);
	const [shortOverlayVisible, setShortOverlayVisible] = useState<boolean>(true);

	const theme = useContext(ThemeContext);
	const optionsMarket = useMarketContext();

	const historicalRatesQuery = useQuery(
		QUERY_KEYS.Synths.HistoricalRates(optionsMarket.currencyKey, selectedPeriod.period),
		() => fetchSynthRateUpdate(currencyKey, selectedPeriod.value)
	);

	const chartData: BaseRateUpdates = get(historicalRatesQuery, 'data.rates', []);
	const isLoading = historicalRatesQuery.isLoading;

	const { currencyKey } = optionsMarket;

	const { t } = useTranslation();

	const linearGradientId = 'optionsMarketChartArea';
	let chartColor = theme.colors.hyperlink;

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
		<Card>
			<CardHeader>
				<div>
					<Currency.Pair baseCurrencyKey={currencyKey} quoteCurrencyKey={FIAT_CURRENCY_MAP.USD} />
				</div>
				<ActionsContainer>
					<Overlays>
						<OverlayButton
							isActive={longOverlayVisible}
							onClick={() => setLongOverlayVisible(!longOverlayVisible)}
						>
							<LongDot /> {t('options.common.long')}
						</OverlayButton>
						<OverlayButton
							isActive={shortOverlayVisible}
							onClick={() => setShortOverlayVisible(!shortOverlayVisible)}
						>
							<ShortDot /> {t('options.common.short')}
						</OverlayButton>
					</Overlays>
					<VerticalSeparator />
					<Periods>
						{PERIOD_LABELS.map((period) => (
							<StyledButton
								key={period.value}
								isActive={period.value === selectedPeriod.value}
								onClick={() => setSelectedPeriod(period)}
							>
								{t(period.i18nLabel)}
							</StyledButton>
						))}
					</Periods>
				</ActionsContainer>
			</CardHeader>
			<Card.Body>
				<ChartContainer semiTransparent={isLoading}>
					<RechartsResponsiveContainer width="100%" height="100%">
						<ComposedChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
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
								domain={['auto', (d: number) => Math.max(d, optionsMarket.strikePrice * 1.1)]}
								// domain={['auto', 'auto']}
								tick={fontStyleMedium}
								orientation="right"
								axisLine={false}
								tickLine={false}
								yAxisId="rate"
								tickFormatter={(val) => formatCurrencyWithSign(USD_SIGN, val)}
							/>
							<YAxis
								type="number"
								allowDataOverflow={true}
								domain={[0, 1]}
								tick={fontStyleMedium}
								orientation="left"
								axisLine={false}
								tickLine={false}
								tickFormatter={(val) => t('common.val-in-cents', { val })}
								yAxisId="price"
							/>
							<Area
								yAxisId="rate"
								dataKey="rate"
								stroke={chartColor}
								fillOpacity={0.5}
								fill={`url(#${linearGradientId})`}
								isAnimationActive={false}
							/>
							{longOverlayVisible && (
								<Line
									yAxisId="price"
									dataKey="long"
									stroke={theme.colors.green}
									isAnimationActive={false}
									dot={false}
									activeDot={false}
								/>
							)}
							{shortOverlayVisible && (
								<Line
									yAxisId="price"
									dataKey="short"
									stroke={theme.colors.red}
									isAnimationActive={false}
									dot={false}
									activeDot={false}
								/>
							)}
							<ReferenceLine
								yAxisId="price"
								y={optionsMarket.longPrice}
								stroke={theme.colors.green}
								strokeDasharray="5 2"
							>
								<Label position="insideBottomLeft" className="ref-line-label ref-line-label-long">
									{t('common.val-in-cents', {
										val: formatCurrency(optionsMarket.longPrice * 100),
									})}
								</Label>
							</ReferenceLine>
							<ReferenceLine
								yAxisId="price"
								y={optionsMarket.shortPrice}
								stroke={theme.colors.red}
								strokeDasharray="5 2"
							>
								<Label position="insideBottomLeft" className="ref-line-label ref-line-label-short">
									{t('common.val-in-cents', {
										val: formatCurrency(optionsMarket.shortPrice * 100),
									})}
								</Label>
							</ReferenceLine>
							<ReferenceLine
								yAxisId="rate"
								y={optionsMarket.strikePrice}
								stroke={theme.colors.fontSecondary}
								strokeDasharray="5 2"
							>
								<Label
									position="insideBottomRight"
									className="ref-line-label ref-line-label-strike-price"
								>
									{optionsMarket.strikePrice}
								</Label>
							</ReferenceLine>
							{/* <ReferenceLine
									yAxisId="rate"
									x={optionsMarket.biddingEndDate}
									stroke={theme.colors.red}
									strokeDasharray="5 2"
								>
									<Label position="insideBottomLeft">{optionsMarket.biddingEndDate}</Label>
								</ReferenceLine>
								<ReferenceLine
									yAxisId="rate"
									x={optionsMarket.maturityDate}
									stroke={theme.colors.red}
									strokeDasharray="5 2"
								>
									<Label position="insideBottomLeft">{optionsMarket.maturityDate}</Label>
								</ReferenceLine> */}
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
						</ComposedChart>
					</RechartsResponsiveContainer>
				</ChartContainer>
				{isLoading && <Spinner size="sm" centered={true} />}
			</Card.Body>
		</Card>
	);
});

const CardHeader = styled(Card.Header)`
	padding: 0 12px;
	justify-content: space-between;
	> * + * {
		margin-left: 0;
	}
`;

const ChartContainer = styled.div<{ semiTransparent: boolean }>`
	height: 300px;
	position: relative;
	${(props) =>
		props.semiTransparent &&
		css`
			opacity: 0.5;
			filter: blur(3px);
		`}

	.ref-line-label {
		font-size: 10px;
		font-family: ${(props) => props.theme.fonts.regular};
		text-transform: uppercase;
	}
	.ref-line-label-long {
		fill: ${(props) => props.theme.colors.green};
	}
	.ref-line-label-short {
		fill: ${(props) => props.theme.colors.red};
	}
	.ref-line-label-strike-price {
		fill: ${(props) => props.theme.colors.fontSecondary};
	}
`;

const ActionsContainer = styled(GridDivCenteredCol)`
	grid-gap: 16px;
`;

const Periods = styled(GridDivCenteredCol)`
	grid-gap: 8px;
`;

const Overlays = styled(GridDivCenteredCol)`
	grid-gap: 8px;
`;

const VerticalSeparator = styled.div`
	height: 24px;
	background-color: ${(props) => props.theme.colors.accentL2};
	width: 1px;
`;

const StyledDot = styled(Dot)`
	width: 8px;
	height: 8px;
	margin-right: 4px;
`;

const ShortDot = styled(StyledDot)`
	background-color: ${(props) => props.theme.colors.red};
`;
const LongDot = styled(StyledDot)`
	background-color: ${(props) => props.theme.colors.green};
`;

const StyledButton = styled(Button).attrs({
	size: 'xs',
	palette: 'secondary',
})``;

const OverlayButton = styled(StyledButton)`
	text-transform: uppercase;
	display: flex;
	align-items: center;
`;

export default Market;
