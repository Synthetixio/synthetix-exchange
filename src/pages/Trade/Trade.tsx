import React, { memo, FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import { CenteredPageLayout, SectionVerticalSpacer, FlexDiv } from 'shared/commonStyles';

import { RootState } from 'ducks/types';

import { CurrencyKey, getMarketPairByMC } from 'constants/currency';
import { navigateToTrade } from 'constants/routes';
import { CREATE_ORDER_CARD_WIDTH } from 'constants/ui';

import Spinner from 'components/Spinner';

import ChartCard from './components/ChartCard';
import CreateOrderCard from './components/CreateOrderCard';
import OrderBookCard from './components/OrderBookCard';
import BlurBackground from './components/BlurBackground';

import { getSynthPair, setSynthPair, getAvailableSynthsMap } from 'ducks/synths';

const mapStateToProps = (state: RootState) => ({
	synthPair: getSynthPair(state),
	synthsMap: getAvailableSynthsMap(state),
});

const mapDispatchToProps = {
	setSynthPair,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type TradeProps = PropsFromRedux &
	RouteComponentProps<{
		baseCurrencyKey: CurrencyKey;
		quoteCurrencyKey: CurrencyKey;
	}>;

const Trade: FC<TradeProps> = memo(({ match, setSynthPair, synthPair, synthsMap }) => {
	const [isReady, setIsReady] = useState<boolean>(false);

	useEffect(() => {
		const { params } = match;

		if (
			params &&
			params.baseCurrencyKey &&
			params.quoteCurrencyKey &&
			synthsMap[params.baseCurrencyKey] &&
			synthsMap[params.quoteCurrencyKey]
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
			navigateToTrade(synthPair.base.name, synthPair.quote.name, true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [match, setSynthPair]);

	if (!isReady) {
		return <Spinner size="sm" centered={true} />;
	}

	return (
		<Container>
			<BlurBackground />
			<CenteredPageLayout>
				<TradeContainer>
					<RowContainer>
						<ChartContainer>
							<ChartCard />
						</ChartContainer>
						<CreateOrderContainer>
							<CreateOrderCard />
						</CreateOrderContainer>
					</RowContainer>
					<SectionVerticalSpacer />
					<OrderBookCard />
				</TradeContainer>
			</CenteredPageLayout>
		</Container>
	);
});

const Container = styled.div`
	height: 100%;
	overflow: hidden;
`;
const RowContainer = styled(FlexDiv)`
	width: 100%;
`;
const TradeContainer = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	width: 100%;
`;
const ChartContainer = styled.div`
	flex: 1;
`;
const CreateOrderContainer = styled.div`
	width: ${CREATE_ORDER_CARD_WIDTH};
	margin-left: 8px;
`;

export default connector(Trade);
