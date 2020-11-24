import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import { CenteredPageLayout, SectionVerticalSpacer, FlexDiv } from 'shared/commonStyles';

import { RootState } from 'ducks/types';

import { CurrencyKey, getMarketPairByMC } from 'constants/currency';
import { navigateToFutures } from 'constants/routes';

import Spinner from 'components/Spinner';

import ChartCard from '../Trade/components/ChartCard';
import OrderCard from './components/OrderCard';

import { getSynthPair, setSynthPair, getAvailableSynthsMap } from 'ducks/synths';
import { useQuery } from 'react-query';
import snxJSConnector from 'utils/snxJSConnector';
import { getIsWalletConnected } from 'ducks/wallet/walletDetails';
import { BigNumberish } from 'ethers/utils';
import { bigNumberFormatter, parseBytes32String } from 'utils/formatters';

import { MarketSummaryMap, MarketSummary, MarketDetails } from './types';
import QUERY_KEYS from 'constants/queryKeys';
import CurrentPositionCard from './components/CurrentPositionCard';

const mapStateToProps = (state: RootState) => ({
	synthPair: getSynthPair(state),
	synthsMap: getAvailableSynthsMap(state),
	isWalletConnected: getIsWalletConnected(state),
});

const mapDispatchToProps = {
	setSynthPair,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type FuturesProps = PropsFromRedux &
	RouteComponentProps<{
		baseCurrencyKey: CurrencyKey;
		quoteCurrencyKey: CurrencyKey;
	}>;

const Futures: FC<FuturesProps> = ({
	match,
	setSynthPair,
	synthPair,
	synthsMap,
	isWalletConnected,
}) => {
	const [isReady, setIsReady] = useState<boolean>(false);

	const allMarketSummariesQuery = useQuery<MarketSummaryMap, any>(
		QUERY_KEYS.Futures.AllMarketSummaries,
		async () => {
			const allMarkets = (await (snxJSConnector as any).snxJS.FuturesMarketData.allMarketSummaries()) as MarketSummary<
				BigNumberish
			>[];

			const marketsMap = allMarkets.reduce(
				(
					acc,
					{
						asset,
						market,
						currentFundingRate,
						exchangeFee,
						marketDebt,
						marketSize,
						marketSkew,
						maxLeverage,
						price,
					}
				) => {
					const _asset = parseBytes32String(asset);

					acc[_asset] = {
						asset: _asset,
						market,
						currentFundingRate: bigNumberFormatter(currentFundingRate),
						exchangeFee: bigNumberFormatter(exchangeFee),
						marketDebt: bigNumberFormatter(marketDebt),
						marketSize: bigNumberFormatter(marketSize),
						marketSkew: bigNumberFormatter(marketSkew),
						maxLeverage: bigNumberFormatter(maxLeverage),
						price: bigNumberFormatter(price),
					};
					return acc;
				},
				{} as MarketSummaryMap
			);

			return marketsMap;
		},
		{
			// TODO: remove this when contracts are on TestNet/MainNet
			enabled: isWalletConnected,
		}
	);

	const futureMarkets = allMarketSummariesQuery.isSuccess ? allMarketSummariesQuery.data : null;
	const futureMarket = futureMarkets != null ? futureMarkets[synthPair.base.name] : null;
	const futureMarketAddress = futureMarkets != null ? futureMarket?.market : null;

	const marketDetailsQuery = useQuery<MarketDetails, any>(
		QUERY_KEYS.Futures.MarketDetails(futureMarketAddress ?? ''),
		async () => {
			const marketDetails = (await (snxJSConnector as any).snxJS.FuturesMarketData.marketDetails(
				futureMarketAddress
			)) as MarketDetails<BigNumberish>;

			const {
				baseAsset,
				exchangeFee,
				fundingParameters,
				marketSizeDetails,
				limits,
				market,
				priceDetails,
			} = marketDetails;

			return {
				baseAsset: parseBytes32String(baseAsset),
				exchangeFee: bigNumberFormatter(exchangeFee),
				fundingParameters: {
					maxFundingRate: bigNumberFormatter(fundingParameters.maxFundingRate),
					maxFundingRateSkew: bigNumberFormatter(fundingParameters.maxFundingRateSkew),
					maxFundingRateDelta: bigNumberFormatter(fundingParameters.maxFundingRateDelta),
				},
				marketSizeDetails: {
					entryMarginSumMinusNotionalSkew: bigNumberFormatter(
						marketSizeDetails.entryMarginSumMinusNotionalSkew
					),
					marketDebt: bigNumberFormatter(marketSizeDetails.marketDebt),
					marketSize: bigNumberFormatter(marketSizeDetails.marketSize),
					marketSkew: bigNumberFormatter(marketSizeDetails.marketSkew),
					pendingOrderValue: bigNumberFormatter(marketSizeDetails.pendingOrderValue),
					proportionalSkew: bigNumberFormatter(marketSizeDetails.proportionalSkew),
					sides: {
						long: bigNumberFormatter(marketSizeDetails.sides.long),
						short: bigNumberFormatter(marketSizeDetails.sides.short),
					},
				},
				limits: {
					maxLeverage: bigNumberFormatter(limits.maxLeverage),
					maxMarketDebt: bigNumberFormatter(limits.maxMarketDebt),
					minInitialMargin: bigNumberFormatter(limits.minInitialMargin),
				},
				market,
				priceDetails: {
					price: bigNumberFormatter(priceDetails.price),
					currentRoundId: bigNumberFormatter(priceDetails.currentRoundId),
					isInvalid: priceDetails.isInvalid,
				},
			};
		},
		{
			enabled: futureMarketAddress != null,
		}
	);

	const futureMarketDetails = marketDetailsQuery.isSuccess ? marketDetailsQuery.data : null;

	useEffect(() => {
		const { params } = match;
		if (
			params &&
			params.baseCurrencyKey &&
			params.quoteCurrencyKey &&
			synthsMap[params.baseCurrencyKey] &&
			synthsMap[params.quoteCurrencyKey] &&
			futureMarkets != null &&
			futureMarkets[params.baseCurrencyKey]
		) {
			const { base, quote, reversed } = getMarketPairByMC(
				params.baseCurrencyKey,
				params.quoteCurrencyKey
			);

			setSynthPair({
				baseCurrencyKey: base,
				quoteCurrencyKey: quote,
				isPairReversed: reversed,
			});

			setIsReady(true);
		} else {
			navigateToFutures(synthPair.base.name, synthPair.quote.name, true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [match, setSynthPair, futureMarkets]);

	if (!isReady) {
		return <Spinner size="sm" centered={true} />;
	}

	return (
		<Container>
			<CenteredPageLayout>
				<FuturesContainer>
					<RowContainer>
						<ChartContainer>
							<ChartCard futureMarkets={futureMarkets} />
						</ChartContainer>
					</RowContainer>
					<SectionVerticalSpacer />
					<RowContainer>
						<CurrentPositionCard futureMarket={futureMarket} />
						<OrderCard futureMarket={futureMarket} />
					</RowContainer>
				</FuturesContainer>
			</CenteredPageLayout>
		</Container>
	);
};

const Container = styled.div`
	height: 100%;
	overflow: hidden;
`;
const RowContainer = styled(FlexDiv)`
	width: 100%;
`;
const FuturesContainer = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	width: 100%;
`;
const ChartContainer = styled.div`
	width: 100%;
`;

export default connector(Futures);
