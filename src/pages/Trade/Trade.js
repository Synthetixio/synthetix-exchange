import React, { useEffect } from 'react';
import queryString from 'query-string';
import styled from 'styled-components';
import { connect } from 'react-redux';

import PairList from '../../components/PairList';
import ChartPanel from '../../components/ChartPanel';
import OrderBook from '../../components/OrderBook';
import TradeBox from '../../components/TradeBox';
import WalletBox from '../../components/WalletBox';

import { PageLayout, FlexDivCol } from '../../shared/commonStyles';

import EtherPromoCard from './components/EtherPromoCard';
import { getSynthPair, setSynthPair } from '../../ducks/synths';
import { navigateToTrade } from '../../constants/routes';

const Trade = ({ history, setSynthPair, synthPair }) => {
	useEffect(() => {
		const qs = queryString.parse(location.search);
		if (qs != null && qs.base != null && qs.quote != null) {
			const { base, quote } = qs;
			setSynthPair({ baseCurrencyKey: base, quoteCurrencyKey: quote });
		} else {
			navigateToTrade(synthPair.base.name, synthPair.quote.name, true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [history.location, setSynthPair]);

	return (
		<PageLayout>
			<Container>
				<BoxContainer height="100%">
					<PairList />
					<EtherPromoCard />
				</BoxContainer>
			</Container>
			<CentralContainer>
				<BoxContainer margin="0 0 8px 0">
					<ChartPanel />
				</BoxContainer>
				<BoxContainer style={{ minHeight: 0 }} height="100%">
					<OrderBook />
				</BoxContainer>
			</CentralContainer>
			<SmallContainer>
				<BoxContainer margin="0 0 8px 0">
					<TradeBox />
				</BoxContainer>
				<BoxContainer style={{ minHeight: 0 }} height="100%">
					<WalletBox />
				</BoxContainer>
			</SmallContainer>
		</PageLayout>
	);
};

const Container = styled(FlexDivCol)`
	width: 25%;
	min-width: 300px;
	max-width: 400px;
	margin: 8px;
	height: calc(100% - 16px);
`;

const SmallContainer = styled(Container)`
	width: 15%;
	min-width: 300px;
`;

const CentralContainer = styled(FlexDivCol)`
	flex: 1;
	margin: 8px 0;
	min-width: 0;
`;

const BoxContainer = styled.div`
	position: relative;
	margin: ${props => props.margin || '0'};
	height: ${props => props.height || 'auto'};
`;

const mapStateToProps = state => ({
	synthPair: getSynthPair(state),
});

const mapDispatchToProps = {
	setSynthPair,
};

export default connect(mapStateToProps, mapDispatchToProps)(Trade);
