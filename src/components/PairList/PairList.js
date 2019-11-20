import React, { useState } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import SearchInput from '../SearchInput';

import { getAvailableSynths, getExchangeRates } from '../../ducks';

import { DataMedium, DataSmall } from '../Typography';

const FILTERS = ['sUSD', 'sETH', 'sBTC', 'sFIAT', 'Synths'];

const PairList = ({ synths, rates }) => {
	const [quote, setQuote] = useState('sUSD');
	return (
		<Container>
			<ContainerHeader>
				<SearchInput />
				<ButtonRow>
					{FILTERS.map(filter => (
						<ButtonFilter onClick={() => setQuote(filter)}>{filter}</ButtonFilter>
					))}
				</ButtonRow>
				<ListHeader>
					<ListHeaderElement>
						<DataSmall>Pair</DataSmall>
						<ButtonSort>
							<SortIcon src="/images/sort-arrows.svg" />
						</ButtonSort>
					</ListHeaderElement>
					<ListHeaderElement>
						<DataSmall>Price</DataSmall>
						<ButtonSort>
							<SortIcon src="/images/sort-arrows.svg" />
						</ButtonSort>
					</ListHeaderElement>
					<ListHeaderElement>
						<DataSmall>Change</DataSmall>
						<ButtonSort>
							<SortIcon src="/images/sort-arrows.svg" />
						</ButtonSort>
					</ListHeaderElement>
				</ListHeader>
			</ContainerHeader>

			<List>
				{synths
					.filter(synth => synth.name !== quote)
					.map(synth => {
						const rate = rates ? rates[synth.name][quote] : 0;
						return (
							<Pair>
								<PairElement>
									<DataMedium>{`${synth.name} / ${quote}`}</DataMedium>
								</PairElement>
								<PairElement>
									<DataMedium>{rate}</DataMedium>
								</PairElement>
								<PairElement>
									<DataMedium>+2.5%</DataMedium>
								</PairElement>
							</Pair>
						);
					})}
			</List>
		</Container>
	);
};

const Container = styled.div`
	background-color: ${props => props.theme.colors.surfaceL2};
`;
const ContainerHeader = styled.div`
	padding: 12px;
	background-color: ${props => props.theme.colors.surfaceL3};
`;
const ButtonRow = styled.div`
	width: 100%;
	display: flex;
	margin: 10px 0;
`;
const ButtonFilter = styled.button`
	border-radius: 1px;
	height: 24px;
	flex: 1;
	padding: 0 6px;
	background-color: ${props => props.theme.colors.accentLight};
	border: none;
	margin: 0 5px;
	&:first-child {
		margin-left: 0;
	}
	&:last-child {
		margin-right: 0;
	}
`;

const List = styled.ul`
	margin: 0 10px;
	padding: 0;
`;
const Pair = styled.li`
	background: ${props => props.theme.colors.surfaceL3};
	margin-top: 6px;
	height: 42px;
	display: flex;
	align-items: center;
	padding: 0 12px;
	border-radius: 1px;
	justify-content: space-between;
`;

const PairElement = styled.div`
	flex: 1;
	text-align: right;
	&:first-child {
		text-align: left;
	}
`;

const ListHeader = styled.div`
	display: flex;
	justify-content: space-between;
	padding: 0 12px;
`;
const ListHeaderElement = styled.div`
	flex: 1;
	text-align: right;
	&:first-child {
		text-align: left;
	}
`;

const ButtonSort = styled.button`
	border: none;
	padding: 0;
	margin-left: 5px;
	cursor: pointer;
`;

const SortIcon = styled.img`
	width: 6.5px;
	height: 8px;
`;

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
