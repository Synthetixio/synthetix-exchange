import React, { FC } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import styled from 'styled-components';
import { useQuery } from 'react-query';

import { formatBytes32String, getAddress } from 'ethers/utils';

import { getSynthPair } from 'ducks/synths';
import { RootState } from 'ducks/types';

import Card from 'components/Card';
import Currency from 'components/Currency';

import { MarketDetails, Order, PositionDetails } from 'pages/Futures/types';
import OrderInfoBlock from '../OrderInfoBlock';
import { StyledCardHeader, StyledCardBody } from '../common';
import { formatCurrency } from 'utils/formatters';
import { SYNTHS_MAP } from 'constants/currency';
import { FlexDivRowCentered } from 'shared/commonStyles';
import { Side } from 'pages/Options/types';

import snxData from 'synthetix-data';
import QUERY_KEYS from 'constants/queryKeys';
import { getCurrentWalletAddress } from 'ducks/wallet/walletDetails';

const mapStateToProps = (state: RootState) => ({
	synthPair: getSynthPair(state),
	currentWalletAddress: getCurrentWalletAddress(state),
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type CurrentPositionCardProps = PropsFromRedux & {
	positionDetails: PositionDetails | null;
	futureMarketDetails: MarketDetails | null;
};

const CurrentPositionCard: FC<CurrentPositionCardProps> = ({
	synthPair,
	positionDetails,
	futureMarketDetails,
	currentWalletAddress,
}) => {
	const { base, quote } = synthPair;

	const orderQuery = useQuery<Order<number> | null, any>(
		QUERY_KEYS.Futures.Order(futureMarketDetails?.market ?? '', currentWalletAddress ?? ''),
		async () => {
			const orders = (await snxData.futures.orders({
				account: getAddress(currentWalletAddress!),
				currency: formatBytes32String(futureMarketDetails!.baseAsset),
			})) as Order<number>[];

			if (orders.length) {
				const order = orders[orders.length - 1];
				return {
					account: order.account,
					currency: order.currency,
					fee: order.fee,
					leverage: order.leverage,
					margin: order.margin,
					market: order.market,
					roundId: order.fee,
					status: order.status,
					timestamp: order.fee,
				};
			}
			return null;
		},
		{
			enabled: !!(futureMarketDetails?.market && currentWalletAddress != null),
		}
	);

	const order = orderQuery.isSuccess ? orderQuery.data : null;

	return (
		<StyledCard>
			<StyledCardHeader>current position</StyledCardHeader>
			<StyledCardBody>
				<FlexDivRowCentered>
					<Currency.Pair
						baseCurrencyKey={base.name}
						quoteCurrencyKey={quote.name}
						showIcon={true}
						iconProps={{
							badge:
								futureMarketDetails != null
									? `${futureMarketDetails.limits.maxLeverage}x`
									: undefined,
						}}
					/>
					{positionDetails != null && positionDetails.hasConfirmedOrder ? (
						positionDetails.isLong ? (
							<PositionSide side="long">long</PositionSide>
						) : (
							<PositionSide side="short">short</PositionSide>
						)
					) : null}
				</FlexDivRowCentered>
				<OrderInfoBlock
					orderData={[
						{
							label: 'Position Size',
							value:
								positionDetails != null && positionDetails.hasConfirmedOrder
									? `${formatCurrency(positionDetails.position.size)} ${base.name}`
									: `- ${base.name}`,
						},
						{
							label: 'Remaining Margin',
							value:
								positionDetails != null && positionDetails.hasConfirmedOrder
									? `${formatCurrency(positionDetails.remainingMargin)} ${SYNTHS_MAP.sUSD}`
									: `- ${SYNTHS_MAP.sUSD}`,
						},
						{
							label: 'Leverage',
							value:
								positionDetails != null && positionDetails.hasConfirmedOrder && order != null
									? formatCurrency(order.leverage, 2)
									: '-',
						},
					]}
				/>
			</StyledCardBody>
		</StyledCard>
	);
};

const StyledCard = styled(Card)`
	width: 240px;
`;

const PositionSide = styled.div<{ side: Side }>`
	text-transform: uppercase;
	font-size: 12px;
	color: ${(props) => props.theme.colors.white};
	border-radius: 1000px;
	text-align: center;
	padding: 4px 10px;
	height: 20px;
	font-family: ${(props) => props.theme.fonts.medium};
	background-color: ${(props) =>
		props.side === 'long' ? props.theme.colors.green : props.theme.colors.red};
`;

export default connector(CurrentPositionCard);
