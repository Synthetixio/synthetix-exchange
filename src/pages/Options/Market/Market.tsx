import React, { memo, FC, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { RouteComponentProps } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import snxJSConnector from 'utils/snxJSConnector';
import { ethers } from 'ethers';

import { binaryOptionMarket } from 'utils/contracts';

import { OptionsMarketInfo, Phase } from 'ducks/options/types';
import { RootState } from 'ducks/types';
import { getOptionsMarketsMap } from 'ducks/options/optionsMarkets';

import ROUTES, { navigateTo } from 'constants/routes';

import { USD_SIGN } from 'constants/currency';
import {
	GridDivCenteredCol,
	CenteredPageLayout,
	GridDivRow,
	FlexDivCentered,
} from 'shared/commonStyles';

import {
	formatCurrencyWithSign,
	formatShortDate,
	bigNumberFormatter,
	parseBytes32String,
} from 'utils/formatters';

import { getPhaseAndEndDate } from 'ducks/options/constants';
import { getAvailableSynthsMap } from 'ducks/synths';

import Spinner from 'components/Spinner';
import Link from 'components/Link';
import MarketSentiment from '../components/MarketSentiment';
import { captionCSS } from 'components/Typography/General';

import ChartCard from './ChartCard';
import TradeCard from './TradeCard';
import TransactionsCard from './TransactionsCard';

const mapStateToProps = (state: RootState) => ({
	optionsMarketsMap: getOptionsMarketsMap(state),
	synthsMap: getAvailableSynthsMap(state),
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type MarketProps = PropsFromRedux &
	RouteComponentProps<{
		marketAddress: string;
	}>;

const Market: FC<MarketProps> = memo(({ match, optionsMarketsMap, synthsMap }) => {
	const [optionsMarket, setOptionsMarket] = useState<OptionsMarketInfo | null>(null);
	const [BOMContract, setBOMContract] = useState<ethers.Contract>();

	const { t } = useTranslation();

	useEffect(() => {
		const { params } = match;

		if (params && params.marketAddress) {
			setBOMContract(
				new ethers.Contract(
					params.marketAddress,
					binaryOptionMarket.abi,
					// @ts-ignore
					snxJSConnector.provider
				)
			);
		} else {
			navigateTo(ROUTES.Options.Home);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [match]);

	useEffect(() => {
		if (BOMContract) {
			// TODO: move this to redux

			const getMarketInfo = async () => {
				const [oracleDetails, times, prices, totalBids, totalSupplies] = await Promise.all([
					BOMContract.oracleDetails(),
					BOMContract.times(),
					BOMContract.prices(),
					BOMContract.totalBids(),
					BOMContract.totalSupplies(),
				]);

				const [biddingEnd, maturity, expiry] = times;
				const [oracleKey, strikePrice] = oracleDetails;
				const [longPrice, shortPrice] = prices;

				const biddingEndDate = Number(biddingEnd) * 1000;
				const maturityDate = Number(maturity) * 1000;
				const expiryDate = Number(expiry) * 1000;

				const { phase, timeRemaining } = getPhaseAndEndDate(
					biddingEndDate,
					maturityDate,
					expiryDate
				);

				const currencyKey = parseBytes32String(oracleKey);

				const market: OptionsMarketInfo = {
					address: match.params.marketAddress,
					biddingEndDate,
					maturityDate,
					expiryDate,
					currencyKey: parseBytes32String(oracleKey),
					asset: synthsMap[currencyKey]?.asset || currencyKey,
					strikePrice: bigNumberFormatter(strikePrice),
					longPrice: bigNumberFormatter(longPrice),
					shortPrice: bigNumberFormatter(shortPrice),
					phase,
					timeRemaining,
				};

				setOptionsMarket(market);
			};
			getMarketInfo();
		}
	}, [BOMContract, synthsMap, match]);

	return optionsMarket ? (
		<StyledCenteredPageLayout>
			<LeftCol>
				<Heading>
					<HeadingItem>
						<AllMarketsLink to={ROUTES.Options.Home}>
							{t('options.market.heading.all-markets')}
						</AllMarketsLink>
						{' | '}
						<HeadingTitle>
							{optionsMarket.asset} &gt;{' '}
							{formatCurrencyWithSign(USD_SIGN, optionsMarket.strikePrice)} @{' '}
							{formatShortDate(optionsMarket.maturityDate)}
						</HeadingTitle>
					</HeadingItem>
					<StyledHeadingItem>
						<HeadingTitle>{t('options.market.heading.market-sentiment')}</HeadingTitle>
						<StyledMarketSentiment
							short={optionsMarket.shortPrice}
							long={optionsMarket.longPrice}
							display="col"
						/>
					</StyledHeadingItem>
				</Heading>
				<ChartCard optionsMarket={optionsMarket} />
				<TransactionsCard optionsMarket={optionsMarket} />
			</LeftCol>
			<RightCol>
				<GridDivCenteredCol>
					{(['bidding', 'trading', 'maturity'] as Phase[]).map((phase) => (
						<PhaseItem key={phase} isActive={phase === optionsMarket.phase}>
							{t(`options.phases.${phase}`)}
						</PhaseItem>
					))}
				</GridDivCenteredCol>
				<TradeCard optionsMarket={optionsMarket} />
			</RightCol>
		</StyledCenteredPageLayout>
	) : (
		<LoaderContainer>
			<Spinner size="sm" centered={true} />
		</LoaderContainer>
	);
});

const StyledCenteredPageLayout = styled(CenteredPageLayout)`
	display: grid;
	grid-template-columns: 1fr auto;
`;

const LeftCol = styled(GridDivRow)`
	grid-gap: 8px;
	align-content: start;
	grid-template-rows: auto auto 1fr;
`;

const Heading = styled(GridDivCenteredCol)`
	grid-gap: 8px;
	font-size: 12px;
	grid-template-columns: auto 1fr;
`;

const HeadingItem = styled(GridDivCenteredCol)`
	grid-gap: 8px;
	background-color: ${(props) => props.theme.colors.surfaceL3};
	height: 30px;
	padding: 0 12px;
`;

const StyledHeadingItem = styled(HeadingItem)`
	grid-template-columns: auto 1fr;
`;

const StyledMarketSentiment = styled(MarketSentiment)`
	font-size: 10px;
	font-family: ${(props) => props.theme.fonts.regular};
	.longs,
	.shorts {
		color: ${(props) => props.theme.colors.brand};
	}
	.percent {
		height: 8px;
	}
`;

const AllMarketsLink = styled(Link)`
	text-transform: uppercase;
	color: ${(props) => props.theme.colors.fontSecondary};
`;

const HeadingTitle = styled.div`
	text-transform: uppercase;
	color: ${(props) => props.theme.colors.fontPrimary};
`;

const RightCol = styled(GridDivRow)`
	grid-gap: 8px;
	align-content: start;
	width: 414px;
	grid-template-rows: auto 1fr;
`;

const PhaseItem = styled(FlexDivCentered)<{ isActive: boolean }>`
	${captionCSS};
	background-color: ${(props) => props.theme.colors.surfaceL3};
	color: ${(props) => props.theme.colors.fontSecondary};
	height: 30px;
	justify-content: center;
	${(props) =>
		props.isActive &&
		css`
			background-color: ${(props) => props.theme.colors.accentL2};
			color: ${(props) => props.theme.colors.fontPrimary};
		`}
`;

const LoaderContainer = styled.div`
	position: relative;
	height: 400px;
`;

export default connector(Market);
