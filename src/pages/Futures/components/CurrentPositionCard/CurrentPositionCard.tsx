import React, { FC } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import styled from 'styled-components';

import { getSynthPair } from 'ducks/synths';
import { RootState } from 'ducks/types';

import Card from 'components/Card';
import Currency from 'components/Currency';

import { MarketSummary } from 'pages/Futures/types';
import OrderInfoBlock from '../OrderInfoBlock';
import { StyledCardHeader, StyledCardBody } from '../common';

const mapStateToProps = (state: RootState) => ({
	synthPair: getSynthPair(state),
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type CurrentPositionCardProps = PropsFromRedux & {
	futureMarket: MarketSummary | null;
};

const CurrentPositionCard: FC<CurrentPositionCardProps> = ({ synthPair, futureMarket }) => {
	const { base, quote } = synthPair;

	return (
		<StyledCard>
			<StyledCardHeader>current position</StyledCardHeader>
			<StyledCardBody>
				<Currency.Pair
					baseCurrencyKey={base.name}
					quoteCurrencyKey={quote.name}
					showIcon={true}
					iconProps={{
						badge: futureMarket != null ? `${futureMarket.maxLeverage}x` : undefined,
					}}
				/>
				<OrderInfoBlock
					orderData={[
						{ label: 'Position Size', value: '- sUSD' },
						{ label: 'Remaining Margin', value: '- sUSD' },
						{ label: 'Leverage', value: '-' },
					]}
				/>
			</StyledCardBody>
		</StyledCard>
	);
};

const StyledCard = styled(Card)`
	width: 240px;
`;

export default connector(CurrentPositionCard);
