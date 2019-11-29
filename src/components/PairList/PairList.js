import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { SearchInput } from '../Input';

import { getAvailableSynths, getExchangeRates } from '../../ducks';

import { DataMedium, DataSmall } from '../Typography';
import { ButtonFilter, ButtonFilterWithDropdown } from '../Button';

const FILTERS = ['sUSD', 'sETH', 'sBTC', 'sFIAT', 'Other'];

const useFilterSynths = (synths, search, quote) => {
	const [list, setList] = useState(synths);
	useEffect(() => {
		if (!synths || synths.lenght === 0) return;
		const filteredList = synths.filter(synth => {
			return synth.name.toLowerCase().includes(search.toLowerCase()) && synth.name !== quote;
		});
		setList(filteredList);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [synths, search, quote]);

	return list;
};

const PairList = ({ synths, rates }) => {
	const [quote, setQuote] = useState('sUSD');
	const [search, setSearch] = useState('');
	const synthList = useFilterSynths(synths, search, quote);
	return (
		<Container>
			<ContainerHeader>
				<SearchInput onChange={e => setSearch(e.target.value)} />
				<ButtonRow>
					{FILTERS.map(filter => {
						return ['sFIAT', 'Other'].includes(filter) ? (
							<ButtonFilterWithDropdown
								quote={quote}
								onClick={synth => setQuote(synth.name)}
								synths={
									filter === 'sFIAT'
										? synths.filter(synth => synth.category === 'forex')
										: synths.filter(synth => synth.category !== 'forex')
								}
							>
								{filter}
							</ButtonFilterWithDropdown>
						) : (
							<ButtonFilter active={filter === quote} onClick={() => setQuote(filter)}>
								{filter}
							</ButtonFilter>
						);
					})}
				</ButtonRow>
				<ListHeader>
					<ListHeaderElement>
						<ButtonSort>
							<ListHeaderLabel>Pair</ListHeaderLabel>
							<SortIcon src="/images/sort-arrows.svg" />
						</ButtonSort>
					</ListHeaderElement>
					<ListHeaderElement>
						<ButtonSort>
							<ListHeaderLabel>Price</ListHeaderLabel>
							<SortIcon src="/images/sort-arrows.svg" />
						</ButtonSort>
					</ListHeaderElement>
					<ListHeaderElement>
						<ButtonSort>
							<ListHeaderLabel>Change</ListHeaderLabel>
							<SortIcon src="/images/sort-arrows.svg" />
						</ButtonSort>
					</ListHeaderElement>
				</ListHeader>
			</ContainerHeader>

			<List>
				{synthList.map((synth, i) => {
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
								<DataChange color={i % 2 === 0 ? 'green' : 'red'}>+2.5%</DataChange>
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
	& > * {
		margin: 0 5px;
		flex: 1;
		&:first-child {
			margin-left: 0;
		}
		&:last-child {
			margin-right: 0;
		}
	}
`;

const List = styled.ul`
	margin: 0 10px;
	padding: 0;
`;

const Pair = styled.li`
	background: ${props => props.theme.colors.surfaceL3};
	cursor: pointer;
	margin-top: 6px;
	height: 42px;
	display: flex;
	align-items: center;
	padding: 0 12px;
	border-radius: 1px;
	justify-content: space-between;
	transition: transform 0.2s ease-out;
	&:hover {
		background-color: ${props => props.theme.colors.accentDark};
		transform: scale(1.02);
	}
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

const ListHeaderLabel = styled(DataSmall)`
	font-family: 'apercu-medium';
	color: ${props => props.theme.colors.fontTertiary};
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
	cursor: pointer;
	background: transparent;
`;

const SortIcon = styled.img`
	width: 6.5px;
	height: 8px;
	margin-left: 5px;
`;

const DataChange = styled(DataMedium)`
	color: ${props => (props.color === 'red' ? props.theme.colors.red : props.theme.colors.green)};
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
