import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { getAvailableSynths } from '../../ducks';

import Header from '../../components/Header';
import PairList from '../../components/PairList';
import ChartPanel from '../../components/ChartPanel';
import OrderBook from '../../components/OrderBook';
import TradeBox from '../../components/TradeBox';
import WalletBox from '../../components/WalletBox';

const Trade = () => {
	return (
		<MainLayout>
			<Header />
			<TradeLayout>
				<SideContainer>
					<BoxContainer height="100%">
						<PairList />
					</BoxContainer>
				</SideContainer>
				<CentralContainer>
					<BoxContainer margin="0 0 8px 0">
						<ChartPanel />
					</BoxContainer>
					<BoxContainer style={{ flex: 1 }}>
						<OrderBook />
					</BoxContainer>
				</CentralContainer>
				<SideContainer>
					<BoxContainer margin="0 0 8px 0" height="600px">
						<TradeBox />
					</BoxContainer>
					<BoxContainer style={{ flex: 1 }}>
						<WalletBox />
					</BoxContainer>
				</SideContainer>
			</TradeLayout>
		</MainLayout>
	);
};

const mapStateToProps = state => {
	return {
		synths: getAvailableSynths(state),
	};
};

Trade.propTypes = {
	synths: PropTypes.array.isRequired,
};

const MainLayout = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	color: white;
	// height: 100vh;
`;

const TradeLayout = styled.div`
	display: flex;
	width: 100%;
	flex: 1;
`;

const Container = styled.div``;

const SideContainer = styled(Container)`
	width: 25%;
	min-width: 300px;
	max-width: 400px;
	display: flex;
	flex-direction: column;
	flex: 1;
	margin: 8px;
`;
const CentralContainer = styled(Container)`
	flex: 1;
	display: flex;
	flex-direction: column;
	margin: 8px 0;
`;

const BoxContainer = styled(Container)`
	margin: ${props => (props.margin ? props.margin : '0')}
	height: ${props => (props.height ? props.height : 'auto')};
`;

export default connect(mapStateToProps, null)(Trade);
