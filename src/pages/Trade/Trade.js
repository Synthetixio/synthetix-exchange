import React from 'react';
import styled from 'styled-components';

import PairList from '../../components/PairList';
import ChartPanel from '../../components/ChartPanel';
import OrderBook from '../../components/OrderBook';
import TradeBox from '../../components/TradeBox';
import WalletBox from '../../components/WalletBox';

import { PageLayout, FlexDivCol } from '../../shared/commonStyles';

const Trade = () => (
	<PageLayout>
		<Container>
			<BoxContainer height="100%">
				<PairList />
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
	margin: ${props => props.margin || '0'};
	height: ${props => props.height || 'auto'};
`;

export default Trade;
