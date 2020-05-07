import React, { useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { useMediaQuery } from 'react-responsive';

import { CenteredPageLayout, SectionVerticalSpacer, FlexDiv } from 'src/shared/commonStyles';

import ChartCard from './components/ChartCard';
import CreateOrderCard from './components/CreateOrderCard';
import OrderBookCard from './components/OrderBookCard';
import BlurBackground from './components/BlurBackground';

import { getSynthPair, setSynthPair } from '../../ducks/synths';
import { navigateToTrade } from 'src/constants/routes';

import { mediumMediaQuery } from 'src/shared/media';

import TradeMobile from './TradeMobile';

const Trade = ({ match, setSynthPair, synthPair }) => {
	useEffect(() => {
		const { params } = match;

		if (params && params.baseCurrencyKey && params.quoteCurrencyKey) {
			setSynthPair({
				baseCurrencyKey: params.baseCurrencyKey,
				quoteCurrencyKey: params.quoteCurrencyKey,
			});
		} else {
			navigateToTrade(synthPair.base.name, synthPair.quote.name, true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [match, setSynthPair]);

	const isTabletOrMobile = useMediaQuery({ query: mediumMediaQuery });

	if (isTabletOrMobile) {
		return <TradeMobile />;
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
};

const Container = styled.div`
	height: 100%;
	overflow: hidden;
`;
const RowContainer = styled(FlexDiv)`
	width: 100%;
`;
const TradeContainer = styled.div`
	flex: 1;
	grid-template-rows: auto auto 1fr;
	display: grid;
	width: 100%;
`;
const ChartContainer = styled.div`
	flex: 1;
`;
const CreateOrderContainer = styled.div`
	width: 282px;
	margin-left: 8px;
`;

const mapStateToProps = state => ({
	synthPair: getSynthPair(state),
});

const mapDispatchToProps = {
	setSynthPair,
};

export default connect(mapStateToProps, mapDispatchToProps)(Trade);
