import React, { FC } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import styled from 'styled-components';

import { getSynthPair } from 'ducks/synths';
import { RootState } from 'ducks/types';

import Card from 'components/Card';
import Currency from 'components/Currency';

import { MarketDetails, PositionDetails } from 'pages/Futures/types';
import OrderInfoBlock from '../OrderInfoBlock';
import { StyledCardHeader, StyledCardBody } from '../common';
import { formatCurrency } from 'utils/formatters';
import { SYNTHS_MAP } from 'constants/currency';
import { FlexDivRowCentered } from 'shared/commonStyles';
import { Side } from 'pages/Options/types';

const mapStateToProps = (state: RootState) => ({
	synthPair: getSynthPair(state),
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
}) => {
	const { base, quote } = synthPair;

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
					{positionDetails != null && positionDetails.hasPosition ? (
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
								positionDetails != null && positionDetails.hasPosition
									? `${formatCurrency(positionDetails.position.size)} ${base.name}`
									: `- ${base.name}`,
						},
						{
							label: 'Remaining Margin',
							value:
								positionDetails != null && positionDetails.hasPosition
									? `${formatCurrency(positionDetails.position.size)} ${SYNTHS_MAP.sUSD}`
									: `- ${SYNTHS_MAP.sUSD}`,
						},
						{
							label: 'Leverage',
							value:
								positionDetails != null && positionDetails.hasPosition
									? formatCurrency(positionDetails.position.size)
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
	padding: 4px 5px;
	height: 20px;
	font-family: ${(props) => props.theme.fonts.medium};
	background-color: ${(props) =>
		props.side === 'long' ? props.theme.colors.green : props.theme.colors.red};
`;

export default connector(CurrentPositionCard);
