import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import Chart from './Chart';
import InfoRow from './InfoRow';

import { getSynthPair, getAvailableSynthsMap } from 'ducks/synths';
import { getRatesExchangeRates } from 'ducks/rates';

import { PERIOD_IN_HOURS } from 'constants/period';

import { ButtonFilter } from 'components/Button';
import PairListPanel from './PairListPanel';

import { fetchSynthVolumeInUSD, fetchSynthRateUpdates } from 'services/rates/rates';
import Card from 'components/Card';

const PERIODS = [
	{ value: PERIOD_IN_HOURS.ONE_HOUR, label: '1H' },
	{ value: PERIOD_IN_HOURS.FOUR_HOURS, label: '4H' },
	{ value: PERIOD_IN_HOURS.ONE_DAY, label: '1D' },
	{ value: PERIOD_IN_HOURS.ONE_WEEK, label: '1W' },
	{ value: PERIOD_IN_HOURS.ONE_MONTH, label: '1M' },
];

const ChartCard = ({ synthPair: { base, quote } }) => {
	const [chartData, setChartData] = useState({
		rates: [],
		low24H: 0,
		high24H: 0,
		change24H: 0,
	});
	const [volume24H, setVolume24H] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [period, setPeriod] = useState({ value: PERIOD_IN_HOURS.ONE_DAY, label: '1D' });

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
			setVolume24H(totalVolume);
		};
		fetchChartData();
		fetchVolumeData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [period, base.name, quote.name]);

	return (
		<Card>
			<Card.Header style={{ paddingLeft: 0 }}>
				<HeaderContainer>
					<PairListPanel />
					<Periods>
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
					</Periods>
				</HeaderContainer>
			</Card.Header>
			<Card.Body>
				<Chart data={chartData} isLoading={isLoading} period={period} />
				<InfoRow data={{ ...chartData, volume24H }} />
			</Card.Body>
		</Card>
	);
};

const HeaderContainer = styled.div`
	width: 100%;
	align-items: center;
	display: flex;
	justify-content: space-between;
`;

const Periods = styled.div`
	display: flex;
	& > * + * {
		margin-left: 8px;
	}
`;

const mapStateToProps = (state) => ({
	synthPair: getSynthPair(state),
	exchangeRates: getRatesExchangeRates(state),
	synthsMap: getAvailableSynthsMap(state),
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ChartCard);
