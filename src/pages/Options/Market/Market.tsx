import React, { FC, useState, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';

import snxJSConnector from 'utils/snxJSConnector';

import { ReactComponent as InfoRoundedIcon } from 'assets/images/info-rounded.svg';

import { OptionsMarketInfo } from 'pages/Options/types';
import { RootState } from 'ducks/types';

import ROUTES from 'constants/routes';

import { USD_SIGN } from 'constants/currency';
import {
	GridDivCenteredCol,
	CenteredPageLayout,
	GridDivRow,
	FlexDivCentered,
	LoaderContainer,
	TextButton,
	VerticalCardSeparator,
} from 'shared/commonStyles';

import {
	formatCurrencyWithSign,
	formatShortDate,
	bigNumberFormatter,
	parseBytes32String,
} from 'utils/formatters';

import { ReactComponent as ArrowBackIcon } from 'assets/images/arrow-back.svg';

import { getPhaseAndEndDate, SIDE, PHASES } from 'pages/Options/constants';
import { getAvailableSynthsMap } from 'ducks/synths';
import { getIsWalletConnected } from 'ducks/wallet/walletDetails';

import Spinner from 'components/Spinner';
import Link from 'components/Link';
import MarketSentiment from '../components/MarketSentiment';
import { captionCSS } from 'components/Typography/General';

import ChartCard from './ChartCard';
import TradeCard from './TradeCard';
import TransactionsCard from './TransactionsCard';

import { useQuery /*queryCache*/ } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { Z_INDEX } from 'constants/ui';

import { MarketProvider } from './contexts/MarketContext';
import MarketInfoModal from './MarketInfoModal';
import { useBOMContractContext } from './contexts/BOMContractContext';

const mapStateToProps = (state: RootState) => ({
	synthsMap: getAvailableSynthsMap(state),
	isWalletConnected: getIsWalletConnected(state),
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type MarketProps = PropsFromRedux & {
	marketAddress: string;
};

const Market: FC<MarketProps> = ({ synthsMap, marketAddress, isWalletConnected }) => {
	const { t } = useTranslation();
	const [marketInfoModalVisible, setMarketInfoModalVisible] = useState<boolean>(false);
	const BOMContract = useBOMContractContext();

	const marketQuery = useQuery<OptionsMarketInfo, any>(
		QUERY_KEYS.BinaryOptions.Market(marketAddress),
		async () => {
			const [marketData, marketParameters, withdrawalsEnabled] = await Promise.all([
				(snxJSConnector as any).binaryOptionsMarketDataContract.getMarketData(marketAddress),
				(snxJSConnector as any).binaryOptionsMarketDataContract.getMarketParameters(marketAddress),
				BOMContract.refundsEnabled(),
			]);

			const { times, oracleDetails, creator, options, fees, creatorLimits } = marketParameters;
			const {
				totalBids,
				totalClaimableSupplies,
				totalSupplies,
				deposits,
				prices,
				oraclePriceAndTimestamp,
				resolution,
			} = marketData;

			const biddingEndDate = Number(times.biddingEnd) * 1000;
			const maturityDate = Number(times.maturity) * 1000;
			const expiryDate = Number(times.expiry) * 1000;

			const { phase, timeRemaining } = getPhaseAndEndDate(biddingEndDate, maturityDate, expiryDate);

			const currencyKey = parseBytes32String(oracleDetails.key);
			console.log(withdrawalsEnabled);
			return {
				isResolved: resolution.resolved,
				address: marketAddress,
				currencyKey,
				priceUpdatedAt: Number(oraclePriceAndTimestamp.updatedAt) * 1000,
				currentPrice: bigNumberFormatter(oraclePriceAndTimestamp.price),
				finalPrice: bigNumberFormatter(oracleDetails.finalPrice),
				asset: synthsMap[currencyKey]?.asset || currencyKey,
				strikePrice: bigNumberFormatter(oracleDetails.strikePrice),
				biddingEndDate,
				maturityDate,
				expiryDate,
				longPrice: bigNumberFormatter(prices.long),
				shortPrice: bigNumberFormatter(prices.short),
				result: SIDE[marketData.result],
				totalBids: {
					long: bigNumberFormatter(totalBids.long),
					short: bigNumberFormatter(totalBids.short),
				},
				totalClaimableSupplies: {
					long: bigNumberFormatter(totalClaimableSupplies.long),
					short: bigNumberFormatter(totalClaimableSupplies.short),
				},
				totalSupplies: {
					long: bigNumberFormatter(totalSupplies.long),
					short: bigNumberFormatter(totalSupplies.short),
				},
				deposits: {
					deposited: bigNumberFormatter(deposits.deposited),
					exercisableDeposits: bigNumberFormatter(deposits.exercisableDeposits),
				},
				phase,
				timeRemaining,
				creator,
				options: {
					long: bigNumberFormatter(options.long),
					short: bigNumberFormatter(options.short),
				},
				fees: {
					creatorFee: bigNumberFormatter(fees.creatorFee),
					poolFee: bigNumberFormatter(fees.poolFee),
					refundFee: bigNumberFormatter(fees.refundFee),
				},
				creatorLimits: {
					capitalRequirement: bigNumberFormatter(creatorLimits.capitalRequirement),
					skewLimit: bigNumberFormatter(creatorLimits.skewLimit),
				},
				BN: {
					totalLongBN: totalBids.long,
					totalShortBN: totalBids.short,
					depositedBN: deposits.deposited,
					feeBN: fees.creatorFee.add(fees.poolFee),
					refundFeeBN: fees.refundFee,
				},
				withdrawalsEnabled,
			} as OptionsMarketInfo;
		}
	);

	const handleViewMarketDetails = useCallback(() => {
		setMarketInfoModalVisible(true);
	}, []);

	const optionsMarket: OptionsMarketInfo | null =
		marketQuery.isSuccess && marketQuery.data ? marketQuery.data : null;

	let marketHeading = optionsMarket
		? `${optionsMarket.asset} > ${formatCurrencyWithSign(
				USD_SIGN,
				optionsMarket.strikePrice
		  )} @ ${formatShortDate(optionsMarket.maturityDate)}`
		: null;

	return optionsMarket ? (
		<MarketProvider optionsMarket={optionsMarket}>
			<StyledCenteredPageLayout>
				<LeftCol>
					<Heading>
						<HeadingItem>
							<AllMarketsLink to={ROUTES.Options.Home}>
								<ArrowBackIcon />
								{t('options.market.heading.all-markets')}
							</AllMarketsLink>
							<VerticalCardSeparator />
							<HeadingTitle>{marketHeading}</HeadingTitle>
						</HeadingItem>
						<HeadingItem>
							<MarketDetailsTextButton onClick={handleViewMarketDetails}>
								{t('options.market.heading.market-details')} <InfoRoundedIcon />
							</MarketDetailsTextButton>
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
					<ChartCard />
					<TransactionsCard />
				</LeftCol>
				<RightCol>
					<Phases>
						{PHASES.map((phase, idx: number) => (
							<PhaseItem key={phase} isActive={phase === optionsMarket!.phase} itemIndex={idx}>
								{t(`options.phases.${phase}`)}
							</PhaseItem>
						))}
					</Phases>
					<TradeCard />
				</RightCol>
			</StyledCenteredPageLayout>
			{marketInfoModalVisible && (
				<MarketInfoModal
					marketHeading={marketHeading}
					optionMarket={optionsMarket}
					onClose={() => setMarketInfoModalVisible(false)}
				/>
			)}
		</MarketProvider>
	) : (
		<LoaderContainer>
			<Spinner size="sm" centered={true} />
		</LoaderContainer>
	);
};

const StyledCenteredPageLayout = styled(CenteredPageLayout)`
	display: grid;
	grid-template-columns: 1fr auto;
`;

const LeftCol = styled(GridDivRow)`
	overflow: hidden;
	grid-gap: 8px;
	align-content: start;
	grid-template-rows: auto auto 1fr;
`;

const Heading = styled(GridDivCenteredCol)`
	grid-gap: 8px;
	grid-template-columns: auto auto 1fr;
`;

const HeadingItem = styled(GridDivCenteredCol)`
	grid-gap: 8px;
	background-color: ${(props) => props.theme.colors.surfaceL3};
	height: 30px;
	padding: 0 12px;
	font-size: 12px;
	text-transform: uppercase;
	font-family: ${(props) => props.theme.fonts.medium};
`;

const StyledHeadingItem = styled(HeadingItem)`
	grid-template-columns: auto 1fr;
`;

const StyledMarketSentiment = styled(MarketSentiment)`
	font-size: 10px;
	text-transform: none;
	.longs,
	.shorts {
		color: ${(props) => props.theme.colors.brand};
	}
	.percent {
		height: 8px;
	}
`;

const headingLinkCSS = css`
	text-transform: uppercase;
	color: ${(props) => props.theme.colors.hyperlink};
`;

const AllMarketsLink = styled(Link)`
	${headingLinkCSS};
	svg {
		width: 10px;
		margin-right: 5px;
		position: relative;
		top: 1px;
	}
`;

const MarketDetailsTextButton = styled(TextButton)`
	${headingLinkCSS};
	font-size: 12px;
	font-family: ${(props) => props.theme.fonts.medium};
	display: flex;
	svg {
		margin-left: 7px;
		position: relative;
		top: -1px;
	}
`;

const HeadingTitle = styled.div`
	color: ${(props) => props.theme.colors.fontPrimary};
`;

const RightCol = styled(GridDivRow)`
	grid-gap: 8px;
	align-content: start;
	width: 414px;
	grid-template-rows: auto 1fr;
`;

const Phases = styled(GridDivCenteredCol)`
	border: 1px solid ${(props) => props.theme.colors.accentL1};
`;

const phaseArrowCSS = css`
	position: absolute;
	top: 0;
	content: '';
	border-top: 15px solid transparent;
	border-bottom: 15px solid transparent;
	z-index: ${Z_INDEX.BASE};
`;

const phaseArrowActiveCSS = css`
	${phaseArrowCSS};
	right: -10px;
	border-left: 10px solid ${(props) => props.theme.colors.accentL1};
`;

const phaseArrowThinBackgroundCSS = css`
	${phaseArrowCSS};
	right: -11px;
	border-left: 10px solid ${(props) => props.theme.colors.accentL1};
`;

const phaseArrowThinCSS = css`
	${phaseArrowCSS};
	right: -10px;
	border-left: 10px solid ${(props) => props.theme.colors.surfaceL3};
	z-index: ${Z_INDEX.BASE + 1};
`;

const PhaseItem = styled(FlexDivCentered)<{ isActive: boolean; itemIndex: number }>`
	position: relative;
	${captionCSS};
	background-color: ${(props) => props.theme.colors.surfaceL3};
	color: ${(props) => props.theme.colors.fontSecondary};
	height: 30px;
	justify-content: center;

	${(props) =>
		props.isActive
			? css`
					background-color: ${(props) => props.theme.colors.accentL1};
					color: ${(props) => props.theme.colors.fontPrimary};
			  `
			: css`
					cursor: not-allowed;
			  `};

	${(props) => {
		if (props.itemIndex === 0) {
			return props.isActive
				? css`
						&::after {
							${phaseArrowActiveCSS};
						}
				  `
				: css`
						&::before {
							${phaseArrowThinBackgroundCSS};
						}
						&::after {
							${phaseArrowThinCSS};
						}
				  `;
		} else if (props.itemIndex === 1) {
			return props.isActive
				? css`
						&::before {
							${phaseArrowCSS};
							left: 0;
							border-left: 10px solid ${(props) => props.theme.colors.surfaceL3};
						}
						&::after {
							${phaseArrowActiveCSS};
						}
				  `
				: css`
						&::before {
							${phaseArrowThinBackgroundCSS};
						}
						&::after {
							${phaseArrowThinCSS};
						}
				  `;
		}
	}}
`;

export default connector(Market);
