import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { format, subHours } from 'date-fns';
import styled, { withTheme } from 'styled-components';
import { ResponsiveContainer, AreaChart, XAxis, YAxis, Area } from 'recharts';
import snxData from 'synthetix-data';

import { getSynthPair, getExchangeRates, getSynthsSigns } from '../../ducks';
import { setSynthPair } from '../../ducks/synths';

import { HeadingSmall, DataSmall, DataLarge } from '../Typography';
import { ButtonFilter } from '../Button';
import Spinner from '../Spinner';

import { formatCurrency } from '../../utils/formatters';

import './chart.scss';

const PERIODS = [
	{ value: 168, label: '1W' },
	{ value: 24, label: '1D' },
	{ value: 4, label: '4H' },
	{ value: 1, label: '1H' },
];

const ChartPanel = ({ theme, synthPair: { base, quote }, rates, synthsSigns, setSynthPair }) => {
	const colors = theme.colors;
	const [chartData, setChartData] = useState([]);
	const [volumeData, setVolumeData] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [period, setPeriod] = useState({ value: 24, label: '1D' });
	useEffect(() => {
		const fetchChartData = async () => {
			if (!base) return;
			if (quote !== 'sUSD') {
				setChartData([]);
				return;
			}
			setIsLoading(true);
			const now = new Date().getTime();
			const results = await snxData.rate.updates({
				synth: base,
				maxTimestamp: Math.trunc(now / 1000),
				minTimestamp: Math.trunc(subHours(now, period.value).getTime() / 1000),
				max: 1000,
			});
			setChartData(results);
			setIsLoading(false);
		};
		const fetchVolumeData = async () => {
			const yesterday = Math.trunc(subHours(new Date(), 24).getTime() / 1000);
			const results = await snxData.exchanges.since({ timestampInSecs: yesterday });
			setVolumeData(
				results.reduce((acc, next) => {
					if (next.fromCurrencyKey === quote && next.toCurrencyKey === base) {
						acc += next.fromAmountInUSD;
					}
					return acc;
				}, 0)
			);
		};
		fetchChartData();
		fetchVolumeData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [period, base, quote]);
	return (
		<Container>
			<Header>
				<HeaderBlock>
					<HeadingSmall>{`${base}/${quote}`}</HeadingSmall>
					<ButtonFilter height={'22px'} onClick={() => setSynthPair({ quote: base, base: quote })}>
						<ButtonIcon src={'/images/reverse-arrow.svg'}></ButtonIcon>
					</ButtonFilter>
					<Link style={{ textDecoration: 'none' }} to={'/'}>
						{/* <LinkInner>
							<LinkLabel>Market Info</LinkLabel>
							<LinkIcon src="/images/link-arrow.svg" />
						</LinkInner> */}
					</Link>
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
					{isLoading ? <Spinner size="small" /> : null}
					{!isLoading && chartData.length === 0 ? <DataLarge>Data available soon</DataLarge> : null}
					{!isLoading && chartData && chartData.length > 0 ? (
						<ResponsiveContainer height={250}>
							<AreaChart data={chartData} margin={{ top: 0, right: -10, left: 10, bottom: 0 }}>
								<defs>
									<linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
										<stop offset="5%" stopColor={colors.hyperLink} stopOpacity={0.5} />
										<stop offset="95%" stopColor={colors.hyperLink} stopOpacity={0} />
									</linearGradient>
								</defs>
								<XAxis
									tick={{ fontSize: '9px', fill: colors.fontTertiary }}
									dataKey="timestamp"
									tickFormatter={val =>
										period.value > 24 ? format(val, 'DD MMM') : format(val, 'h:mma')
									}
									reversed={true}
								/>
								<YAxis
									type="number"
									domain={['auto', 'auto']}
									tickFormatter={val => `$${val}`}
									tick={{ fontSize: '9px', fill: colors.fontTertiary }}
									orientation="right"
								/>
								<Area
									dataKey="rate"
									stroke={colors.hyperLink}
									fillOpacity={0.5}
									fill="url(#colorUv)"
								/>
							</AreaChart>
						</ResponsiveContainer>
					) : null}
				</ChartContainer>

				<DataRow>
					<DataBlock>
						<DataBlockLabel>Price</DataBlockLabel>
						<DataBlockValue style={{ fontSize: '16px' }}>
							{synthsSigns[quote]}
							{rates ? formatCurrency(rates[base][quote]) : 0}
						</DataBlockValue>
					</DataBlock>
					<DataBlock>
						<DataBlockLabel>24h change</DataBlockLabel>
						<DataBlockValue style={{ fontSize: '12px' }}>Available soon</DataBlockValue>
					</DataBlock>
					<DataBlock>
						<DataBlockLabel>24h high</DataBlockLabel>
						<DataBlockValue style={{ fontSize: '12px' }}>Available soon</DataBlockValue>
					</DataBlock>
					<DataBlock>
						<DataBlockLabel>24h low</DataBlockLabel>
						<DataBlockValue style={{ fontSize: '12px' }}>Available soon</DataBlockValue>
					</DataBlock>
					<DataBlock>
						<DataBlockLabel>24h volume</DataBlockLabel>
						<DataBlockValue style={{ fontSize: '16px' }}>
							${formatCurrency(volumeData)}
						</DataBlockValue>
					</DataBlock>
				</DataRow>
			</Body>
		</Container>
	);
};

const Container = styled.div`
	width: 100%;

	background-color: ${props => props.theme.colors.surfaceL2};
`;

const Header = styled.div`
	background-color: ${props => props.theme.colors.surfaceL3};
	width: 100%;
	height: 40px;
	display: flex;
	align-items: center;
	padding: 0 18px;
	justify-content: space-between;
`;

const Body = styled.div`
	padding: 18px;
`;

const DataRow = styled.div`
	display: flex;
	& > * {
		margin: 0 12px;
	}
	& > :first-child {
		margin-left: 0;
	}
	& > &:last-child {
		margin-right: 0;
	}
`;
const DataBlock = styled.div`
	flex: 1;
	height: 72px;
	background-color: ${props => props.theme.colors.surfaceL3};
	justify-content: center;
	align-items: flex-start;
	display: flex;
	flex-direction: column;
	padding: 0 22px;
`;

const DataBlockLabel = styled(DataSmall)`
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

// const LinkInner = styled.div`
// 	display: flex;
// 	align-items: center;
// `;

// const LinkLabel = styled(LabelSmall)`
// 	margin-left: 10px;
// 	color: ${props => props.theme.colors.hyperLink};
// 	&:hover {
// 		text-decoration: underline;
// 	}
// `;

// const LinkIcon = styled.img`
// 	width: 8px;
// 	height: 8px;
// 	margin-left: 5px;
// `;

const ButtonIcon = styled.img`
	width: 16px;
	height: 12px;
`;

const ChartContainer = styled.div`
	width: 100%;
	height: 250px;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const mapStateToProps = state => {
	return {
		synthPair: getSynthPair(state),
		rates: getExchangeRates(state),
		synthsSigns: getSynthsSigns(state),
	};
};

const mapDispatchToProps = {
	setSynthPair,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(ChartPanel));
