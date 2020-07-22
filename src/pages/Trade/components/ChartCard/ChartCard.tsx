import React, { FC, useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled, { ThemeContext } from 'styled-components';
import { useTranslation } from 'react-i18next';

import Chart from './Chart';
import InfoRow from './InfoRow';

import { getSynthPair, SynthPair } from 'ducks/synths';
import { getIsWalletConnected } from 'ducks/wallet/walletDetails';

import { PERIOD_IN_HOURS, PERIOD_LABELS_MAP, PeriodLabel, PERIOD_LABELS } from 'constants/period';

import { Button } from 'components/Button';
import PairListPanel from './PairListPanel';

import { fetchSynthVolumeInUSD, fetchSynthRateUpdates } from 'services/rates/rates';
import Card from 'components/Card';
import { RootState } from 'ducks/types';
import { ChartData } from './types';

type StateProps = {
	synthPair: SynthPair;
	isWalletConnected: boolean;
};

type ChartCardProps = StateProps;

const ChartCard: FC<ChartCardProps> = ({ synthPair, isWalletConnected }) => {
	const { t } = useTranslation();
	const [chartData, setChartData] = useState<ChartData>({
		rates: [],
		low24H: 0,
		high24H: 0,
		change24H: 0,
	});
	const { colors } = useContext(ThemeContext);
	const [showTrades, setShowTrades] = useState<boolean>(false);
	const [volume24H, setVolume24H] = useState<number>(0);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [selectedPeriod, setSelectedPeriod] = useState<PeriodLabel>(PERIOD_LABELS_MAP.ONE_DAY);
	const { base, quote } = synthPair;

	// TODO: refactor this
	useEffect(() => {
		const fetchChartData = async () => {
			setIsLoading(true);
			let rates = [];
			const rates24HData = await fetchSynthRateUpdates(
				base.name,
				quote.name,
				PERIOD_IN_HOURS.ONE_DAY
			);
			if (rates24HData) {
				rates = rates24HData.rates;

				// ONE_DAY period is fetched for the 24h data, so no need to refetch it.
				if (selectedPeriod.period !== 'ONE_DAY') {
					const ratesData = await fetchSynthRateUpdates(
						base.name,
						quote.name,
						selectedPeriod.value
					);
					if (ratesData) {
						rates = ratesData.rates;
					}
				}

				setChartData({
					rates,
					low24H: rates24HData.low,
					high24H: rates24HData.high,
					change24H: rates24HData.change,
				});
			}
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
	}, [selectedPeriod, base.name, quote.name]);

	return (
		<Card>
			<StyledCardHeader>
				<HeaderContainer>
					<PairListPanel />
					<Periods>
						{isWalletConnected ? (
							<>
								<YourTradesButton
									palette="secondary"
									size="xs"
									isActive={showTrades}
									onClick={() => setShowTrades(!showTrades)}
								>
									<YourTradesWrapper>
										<svg width="4" height="10" viewBox="0 0 4 10" fill="none">
											<rect width="4" height="10" rx="1" fill={colors.fontTertiary} />
										</svg>
										{t(t('trade.chart-card.info-boxes.your-trades'))}
									</YourTradesWrapper>
								</YourTradesButton>
								<VerticalDivider />{' '}
							</>
						) : null}
						{PERIOD_LABELS.map((period) => (
							<Button
								key={period.value}
								palette="secondary"
								size="xs"
								isActive={period.value === selectedPeriod.value}
								onClick={() => setSelectedPeriod(period)}
							>
								{t(period.i18nLabel)}
							</Button>
						))}
					</Periods>
				</HeaderContainer>
			</StyledCardHeader>
			<Card.Body>
				<Chart
					data={chartData}
					showTrades={showTrades}
					isLoading={isLoading}
					period={selectedPeriod}
					synthPair={synthPair}
				/>
				<InfoRow data={chartData} volume24H={volume24H} synthPair={synthPair} />
			</Card.Body>
		</Card>
	);
};

const StyledCardHeader = styled(Card.Header)`
	padding-left: 0;
`;

const HeaderContainer = styled.div`
	width: 100%;
	align-items: center;
	display: flex;
	justify-content: space-between;
`;

const Periods = styled.div`
	display: grid;
	grid-auto-flow: column;
	grid-gap: 8px;
`;

const VerticalDivider = styled.div`
	border-left: 1px solid ${(props) => props.theme.colors.accentL2};
	width: 1px;
	margin: auto 10px;
	height: 20px;
`;

const YourTradesWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-around;
`;

const YourTradesButton = styled(Button)`
	width: 115px;
`;

const mapStateToProps = (state: RootState): StateProps => ({
	synthPair: getSynthPair(state),
	isWalletConnected: getIsWalletConnected(state),
});

export default connect<StateProps, {}, {}, RootState>(mapStateToProps)(ChartCard);
