import React, { FC, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { ReactComponent as QuestionMark } from 'assets/images/question-mark.svg';

import Chart from './Chart';
import InfoRow from './InfoRow';

import { getSynthPair, SynthPair } from 'ducks/synths';
import { getIsWalletConnected } from 'ducks/wallet/walletDetails';

import { PERIOD_IN_HOURS, PERIOD_LABELS_MAP, PeriodLabel, PERIOD_LABELS } from 'constants/period';
import { USD_SIGN } from 'constants/currency';

import { Button } from 'components/Button';
import PairListPanel from './PairListPanel';

import { fetchSynthVolumeInUSD, fetchSynthRateUpdates } from 'services/rates/rates';
import Card from 'components/Card';
import Link from 'components/Link';
import { RootState } from 'ducks/types';
import { ChartData } from './types';

type StateProps = {
	synthPair: SynthPair;
	isWalletConnected: boolean;
};

type ChartCardProps = StateProps;

const ChartCard: FC<ChartCardProps> = ({ synthPair }) => {
	const { t } = useTranslation();
	const [chartData, setChartData] = useState<ChartData>({
		rates: [],
		low24H: 0,
		high24H: 0,
		change24H: 0,
	});
	const [showTrades] = useState<boolean>(false);
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
						{base.inverted ? (
							<InverseInfoWrap>
								<InverseInfo>
									{t('common.currency.lower-limit-price', {
										price: `${USD_SIGN}${base.inverted.lowerLimit}`,
									})}
								</InverseInfo>
								<InverseInfo>
									{t('common.currency.entry-limit-price', {
										price: `${USD_SIGN}${base.inverted.entryPoint}`,
									})}
								</InverseInfo>
								<InverseInfo>
									{t('common.currency.upper-limit-price', {
										price: `${USD_SIGN}${base.inverted.upperLimit}`,
									})}
								</InverseInfo>
								<Link isExternal={true} to="https://blog.synthetix.io/inverse-synths-are-back/">
									<QuestionMarkIcon>
										<QuestionMarkStyled />
									</QuestionMarkIcon>
								</Link>
								<VerticalDivider />
							</InverseInfoWrap>
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

const InverseInfoWrap = styled.div`
	display: flex;
	float: left;
	width: 220px;
	justify-content: space-between;
`;

const InverseInfo = styled.div`
	font-size: 10px;
	color: ${(props) => props.theme.colors.fontTertiary};
`;

const QuestionMarkIcon = styled.div`
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 50%;
	width: 12px;
	height: 12px;
	background-color: ${(props) => props.theme.colors.accentL1};
	margin-top: 6px;
	margin-right: 15px;
`;

const QuestionMarkStyled = styled(QuestionMark)`
	height: 8px;
	color: ${({ theme }) => theme.colors.fontTertiary};
`;

const mapStateToProps = (state: RootState): StateProps => ({
	synthPair: getSynthPair(state),
	isWalletConnected: getIsWalletConnected(state),
});

export default connect<StateProps, {}, {}, RootState>(mapStateToProps)(ChartCard);
