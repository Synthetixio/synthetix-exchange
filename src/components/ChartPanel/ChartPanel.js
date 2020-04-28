import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import styled, { withTheme } from 'styled-components';
import { ResponsiveContainer, AreaChart, XAxis, YAxis, Area, Tooltip } from 'recharts';

import { getSynthPair, getAvailableSynthsMap } from '../../ducks/synths';
import { getRatesExchangeRates } from '../../ducks/rates';

import { HeadingSmall, DataSmall, DataLarge } from '../Typography';
import { ButtonFilter } from '../Button';
import Spinner from '../Spinner';

import ChangePercent from '../../components/ChangePercent';

import {
	formatCurrency,
	formatCurrencyWithPrecision,
	formatCurrencyPair,
} from '../../utils/formatters';
import { getExchangeRatesForCurrencies } from '../../utils/rates';

import {
	fetchSynthVolumeInUSD,
	PERIOD_IN_HOURS,
	fetchSynthRateUpdates,
} from '../../services/rates/rates';

const PERIODS = [
	{ value: PERIOD_IN_HOURS.ONE_WEEK, label: '1W' },
	{ value: PERIOD_IN_HOURS.ONE_DAY, label: '1D' },
	{ value: PERIOD_IN_HOURS.FOUR_HOURS, label: '4H' },
	{ value: PERIOD_IN_HOURS.ONE_HOUR, label: '1H' },
];

const ChartPanel = ({ theme, synthPair: { base, quote }, exchangeRates, synthsMap }) => {
	const colors = theme.colors;
	const [chartData, setChartData] = useState({
		rates: [],
		low24H: 0,
		high24H: 0,
		change24H: 0,
	});
	const [volume24HData, set24HVolumeData] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [period, setPeriod] = useState({ value: PERIOD_IN_HOURS.ONE_DAY, label: '1D' });

	const synthSign = synthsMap[quote.name] && synthsMap[quote.name].sign;

	useEffect(() => {
		const fetchChartData = async () => {
			setIsLoading(true);

			let rates = [];

			const rates24HData = await fetchSynthRateUpdates(
				base.name,
				quote.name,
				PERIOD_IN_HOURS.ONE_DAY
			);
			rates = rates24HData.rates;

			// ONE_DAY period is fetched for the 24h data, so no need to refetch it.
			if (period.value !== PERIOD_IN_HOURS.ONE_DAY) {
				const ratesData = await fetchSynthRateUpdates(base.name, quote.name, period.value);
				rates = ratesData.rates;
			}

			setChartData({
				rates,
				low24H: rates24HData.low,
				high24H: rates24HData.high,
				change24H: rates24HData.change,
			});
			setIsLoading(false);
		};
		const fetchVolumeData = async () => {
			const totalVolume = await fetchSynthVolumeInUSD(
				base.name,
				quote.name,
				PERIOD_IN_HOURS.ONE_DAY
			);

			set24HVolumeData(totalVolume);
		};
		fetchChartData();
		fetchVolumeData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [period, base.name, quote.name]);

	const { low24H, high24H, change24H } = chartData;

	const rate = getExchangeRatesForCurrencies(exchangeRates, base.name, quote.name) || 0;
	return (
		<Container>
			<Header>
				<HeaderBlock>
					<HeadingSmall>{formatCurrencyPair(base.name, quote.name)}</HeadingSmall>
					<Link style={{ textDecoration: 'none' }} to={'/'}></Link>
				</HeaderBlock>
				<HeaderBlock>
					{PERIODS.map((time, i) => {
						return (
							<ButtonFilter
								active={time.value === period.value}
								onClick={() => setPeriod(time)}
								key={i}
								height={'22px'}
							>
								{time.label}
							</ButtonFilter>
						);
					})}
				</HeaderBlock>
			</Header>
			<Body>
				<ChartContainer>
					{isLoading ? <Spinner size="sm" /> : null}
					{!isLoading && chartData.rates.length === 0 ? (
						<DataLarge>No data available</DataLarge>
					) : null}
					{!isLoading && chartData.rates && chartData.rates.length > 0 ? (
						<ResponsiveContainer width="100%" height={250}>
							<AreaChart data={chartData.rates} margin={{ top: 0, right: -6, left: 10, bottom: 0 }}>
								<defs>
									<linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
										<stop offset="5%" stopColor={colors.hyperlink} stopOpacity={0.5} />
										<stop offset="95%" stopColor={colors.hyperlink} stopOpacity={0} />
									</linearGradient>
								</defs>
								<XAxis
									tick={{ fontSize: '9px', fill: colors.fontTertiary }}
									dataKey="timestamp"
									tickFormatter={val =>
										period.value > 24 ? format(val, 'DD MMM') : format(val, 'h:mma')
									}
								/>
								<YAxis
									type="number"
									domain={['auto', 'auto']}
									tickFormatter={val => `${synthSign}${formatCurrencyWithPrecision(val)}`}
									tick={{ fontSize: '9px', fill: colors.fontTertiary }}
									orientation="right"
								/>
								<Area
									dataKey="rate"
									stroke={colors.hyperlink}
									fillOpacity={0.5}
									fill="url(#colorUv)"
								/>
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
									formatter={value => `${synthSign}${formatCurrencyWithPrecision(value)}`}
									labelFormatter={label => format(label, 'Do MMM YY | HH:mm')}
								/>
							</AreaChart>
						</ResponsiveContainer>
					) : null}
				</ChartContainer>

				<DataRow>
					<DataBlock>
						<DataBlockLabel>Price</DataBlockLabel>
						<DataBlockValue style={{ fontSize: '14px' }}>
							{synthSign}
							{formatCurrencyWithPrecision(rate)}
						</DataBlockValue>
					</DataBlock>
					<DataBlock>
						<DataBlockLabel>24h change</DataBlockLabel>
						<DataBlockValue
							style={{
								fontSize: '14px',
							}}
						>
							<ChangePercent value={change24H} />
						</DataBlockValue>
					</DataBlock>
					<DataBlock>
						<DataBlockLabel>24h high</DataBlockLabel>
						<DataBlockValue style={{ fontSize: '14px' }}>
							{synthSign}
							{formatCurrencyWithPrecision(high24H)}
						</DataBlockValue>
					</DataBlock>
					<DataBlock>
						<DataBlockLabel>24h low</DataBlockLabel>
						<DataBlockValue style={{ fontSize: '14px' }} style={{ fontSize: '14px' }}>
							{synthSign}
							{formatCurrencyWithPrecision(low24H)}
						</DataBlockValue>
					</DataBlock>
					<DataBlock>
						<DataBlockLabel>24h volume</DataBlockLabel>
						<DataBlockValue style={{ fontSize: '14px' }}>
							${formatCurrency(volume24HData)}
						</DataBlockValue>
					</DataBlock>
				</DataRow>
			</Body>
		</Container>
	);
};

const Container = styled.div`
	width: 100%;

	background: ${props => props.theme.colors.surfaceL2};
`;

const Header = styled.div`
	background: ${props => props.theme.colors.surfaceL3};
	width: 100%;
	height: 40px;
	display: flex;
	align-items: center;
	padding: 0 18px;
	justify-content: space-between;
`;

const Body = styled.div`
	padding: 18px;

	.recharts-yAxis .yAxis,
	.recharts-xAxis .xAxis {
		display: none;
	}
`;

const DataRow = styled.div`
	display: flex;
	flex-wrap: wrap;
`;
const DataBlock = styled.div`
	flex: 1;
	height: 72px;
	max-width: 20%;
	min-width: 115px;
	margin-top: 6px;
	background: ${props => props.theme.colors.surfaceL3};
	justify-content: center;
	align-items: flex-start;
	display: flex;
	flex-direction: column;
	padding: 0 22px;
	margin-right: 6px;
	&:last-child {
		margin-right: 0;
	}
`;

const DataBlockLabel = styled(DataSmall)`
	white-space: nowrap;
	color: ${props => props.theme.colors.fontTertiary};
`;

const DataBlockValue = styled(DataLarge)`
	color: ${props => (props.color ? props.color : props.theme.colors.fontPrimary)};
`;

const HeaderBlock = styled.div`
	display: flex;
	align-items: baseline;
	& > * {
		margin: 0 6px;
	}
	& > :first-child {
		margin-left: 0;
	}
	& > &:last-child {
		margin-right: 0;
	}
`;

const ChartContainer = styled.div`
	width: 100%;
	height: 250px;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const mapStateToProps = state => ({
	synthPair: getSynthPair(state),
	exchangeRates: getRatesExchangeRates(state),
	synthsMap: getAvailableSynthsMap(state),
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(ChartPanel));
