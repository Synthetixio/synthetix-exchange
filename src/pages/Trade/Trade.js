import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { getAvailableSynths } from '../../ducks';

import PairList from '../../components/PairList';
import ChartPanel from '../../components/ChartPanel';
import OrderBook from '../../components/OrderBook';
import TradeBox from '../../components/TradeBox';
import WalletBox from '../../components/WalletBox';

const Trade = () => {
	return (
		<MainContainer>
			<SideContainer>
				<BoxContainer height="100%">
					<PairList />
				</BoxContainer>
			</SideContainer>
			<CentralContainer>
				<BoxContainer margin="0 0 5px 0" height="700px">
					<ChartPanel />
				</BoxContainer>
				<BoxContainer style={{ flex: 1 }}>
					<OrderBook />
				</BoxContainer>
			</CentralContainer>
			<SideContainer>
				<BoxContainer margin="0 0 5px 0" height="600px">
					<TradeBox />
				</BoxContainer>
				<BoxContainer style={{ flex: 1 }}>
					<WalletBox />
				</BoxContainer>
			</SideContainer>
		</MainContainer>
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

const MainContainer = styled.div`
	background-color: black;
	display: flex;
	width: 100%;
	color: white;
	height: 100vh;
`;

const SideContainer = styled.div`
	width: 25%;
	min-width: 300px;
	max-width: 400px;
	display: flex;
	flex-direction: column;
	flex: 1;
	margin: 5px;
`;
const CentralContainer = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	margin: 5px 0;
`;
const BoxContainer = styled.div`
	background: grey;
	margin: ${props => (props.margin ? props.margin : '0')}
	height: ${props => (props.height ? props.height : 'auto')};
`;

export default connect(mapStateToProps, null)(Trade);
