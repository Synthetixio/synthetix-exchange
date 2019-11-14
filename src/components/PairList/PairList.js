import React, { useState } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAvailableSynths, getExchangeRates } from '../../ducks';

const FILTERS = ['sUSD', 'sETH', 'sBTC', 'sFIAT', 'Synths'];

const PairList = ({ synths, rates }) => {
	const [quote, setQuote] = useState('sUSD');
	return (
		<Container>
			<input type="text" />
			<ButtonRow>
				{FILTERS.map(filter => (
					<ButtonFilter onClick={() => setQuote(filter)}>{filter}</ButtonFilter>
				))}
			</ButtonRow>
			<Table>
				<Thead>
					<Tr>
						<Th>Pair</Th>
						<Th>Price</Th>
						<Th>Change</Th>
					</Tr>
				</Thead>
				<Tbody>
					{synths
						.filter(synth => synth.name !== quote)
						.map(synth => {
							const rate = rates ? rates[synth.name][quote] : 0;
							return (
								<Tr>
									<Td>{`${synth.name} / ${quote}`}</Td>
									<Td>{rate}</Td>
									<Td>+2.34%</Td>
								</Tr>
							);
						})}
				</Tbody>
			</Table>
		</Container>
	);
};

const Container = styled.div``;
const ButtonRow = styled.div``;
const ButtonFilter = styled.button``;

const Table = styled.table``;
const Thead = styled.thead``;
const Tbody = styled.tbody``;
const Tr = styled.tr``;
const Th = styled.th``;
const Td = styled.td``;

const mapStateToProps = state => {
	return {
		synths: getAvailableSynths(state),
		rates: getExchangeRates(state),
	};
};

PairList.propTypes = {
	synths: PropTypes.array.isRequired,
	rates: PropTypes.array.isRequired,
};

export default connect(mapStateToProps, null)(PairList);
