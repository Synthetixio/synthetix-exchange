import React, { FC, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { ReactComponent as QuestionMark } from 'assets/images/question-mark.svg';

import Chart from './Chart';
import InfoRow from './InfoRow';

import { getSynthPair, SynthPair } from 'ducks/synths';
import { getIsWalletConnected } from 'ducks/wallet/walletDetails';

import { PERIOD_LABELS_MAP, PeriodLabel, PERIOD_LABELS } from 'constants/period';
import { USD_SIGN } from 'constants/currency';

import { Button } from 'components/Button';
import PairListPanel from './PairListPanel';

import { fetchSynthRateUpdates } from 'services/rates/rates';
import Card from 'components/Card';
import Link from 'components/Link';
import { RootState } from 'ducks/types';

import { MarketDetails, MarketSummaryMap } from 'pages/Futures/types';
import OpenInterest from './OpenInterest';
import { useQuery } from 'react-query';
import { DEFAULT_REQUEST_REFRESH_INTERVAL } from 'constants/ui';

type StateProps = {
	synthPair: SynthPair;
	isWalletConnected: boolean;
};

type ChartCardProps = StateProps;

const ChartCard: FC<
	ChartCardProps & {
		futureMarkets: MarketSummaryMap | null;
		futureMarketDetails: MarketDetails | null;
	}
> = ({ synthPair, futureMarkets, futureMarketDetails }) => {
	const { t } = useTranslation();
	const [showTrades] = useState<boolean>(false);
	const [selectedPeriod, setSelectedPeriod] = useState<PeriodLabel>(PERIOD_LABELS_MAP.ONE_DAY);
	const { base, quote } = synthPair;

	const ratesQuery = useQuery(
		['historicalTrades', base.name, quote.name, selectedPeriod.value],
		async () => {
			const rates = await fetchSynthRateUpdates(base.name, quote.name, selectedPeriod.value);
			return rates;
		},
		{
			refetchInterval: DEFAULT_REQUEST_REFRESH_INTERVAL,
		}
	);

	return (
		<Card>
			<StyledCardHeader>
				<HeaderContainer>
					<PairListPanel futureMarkets={futureMarkets} />
					<Periods>
						{futureMarketDetails != null && (
							<OpenInterest
								long={futureMarketDetails.marketSizeDetails.sides.long}
								short={futureMarketDetails.marketSizeDetails.sides.short}
							/>
						)}
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
					data={{ rates: ratesQuery.data?.rates ?? [] }}
					showTrades={showTrades}
					isLoading={ratesQuery.isLoading}
					period={selectedPeriod}
					synthPair={synthPair}
				/>
				<InfoRow synthPair={synthPair} />
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
