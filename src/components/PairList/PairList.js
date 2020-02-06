import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { SearchInput } from '../Input';

import {
	getAvailableSynths,
	getExchangeRates,
	getSynthsSigns,
	getSynthPair,
	getSynthSearch,
} from '../../ducks';
import { formatCurrency } from '../../utils/formatters';
import { pairWeight } from '../../utils/synthOrdering';

import { DataMedium, DataSmall } from '../Typography';
import { ButtonFilter, ButtonFilterWithDropdown } from '../Button';

import { setSynthPair } from '../../ducks/synths';
import { setSynthSearch } from '../../ducks/ui';

const FILTERS = ['sUSD', 'sBTC', 'sETH', 'sFIAT', 'Other'];

const PairList = ({ synths, rates, setSynthPair, synthsSigns, setSynthSearch, search }) => {
	const [quote, setQuote] = useState({ name: 'sUSD', category: 'forex' });
	// const [sort, setSort] = useState({});
	const [synthList, setSynthList] = useState([]);
	const [filteredSynths, setFilteredSynths] = useState([]);

	useEffect(() => {
		if (!synths || synths.length === 0) return;
		let listToCompare = synths;
		let list = [];
		synths.forEach(a => {
			listToCompare.forEach(b => {
				if (a.name !== b.name) {
					if (pairWeight(b) > pairWeight(a)) {
						list.push({
							base: b,
							quote: a,
							rate: rates ? rates[b.name][a.name] : 0,
						});
					} else if (pairWeight(b) === pairWeight(a)) {
						list = list.concat([
							{
								base: a,
								quote: b,
								rate: rates ? rates[a.name][b.name] : 0,
							},
							{ base: b, quote: a, rate: rates ? rates[b.name][a.name] : 0 },
						]);
					} else {
						list.push({
							base: a,
							quote: b,
							rate: rates ? rates[a.name][b.name] : 0,
						});
					}
				}
			});
			listToCompare = listToCompare.filter(s => s.name !== a.name);
		});
		setSynthList(list);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [synths.length, rates]);

	useEffect(() => {
		setSynthSearch('');
		setFilteredSynths(synthList.filter(synth => synth.quote.name === quote.name));
	}, [quote.name]);

	useEffect(() => {
		let list = [];
		if (!search) {
			list = synthList.filter(synth => synth.quote.name === quote.name);
		} else {
			list = synthList
				.filter(synth => {
					return (
						synth.base.name.toLowerCase().includes(search.toLowerCase()) ||
						synth.quote.name.toLowerCase().includes(search.toLowerCase()) ||
						synth.base.desc.toLowerCase().includes(search.toLowerCase()) ||
						synth.quote.desc.toLowerCase().includes(search.toLowerCase())
					);
				})
				// we want to put sBASE/sUSD at the top when a search occurs
				.sort(a => (a.quote.name === 'sUSD' && !a.base.inverted ? -1 : 0));
		}
		setFilteredSynths(list);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [synthList, search]);

	return (
		<Container>
			<ContainerHeader>
				<SearchInput value={search} onChange={e => setSynthSearch(e.target.value)} />
				<ButtonRow>
					{FILTERS.map((filter, i) => {
						return ['sFIAT', 'Other'].includes(filter) ? (
							<ButtonFilterWithDropdown
								key={i}
								quote={quote}
								onClick={synth => setQuote(synth)}
								synths={
									filter === 'sFIAT'
										? synths.filter(synth => synth.category === 'forex')
										: synths.filter(synth => synth.category !== 'forex')
								}
							>
								{filter}
							</ButtonFilterWithDropdown>
						) : (
							<ButtonFilter
								key={i}
								active={filter === quote.name}
								onClick={() => setQuote(synths.find(synth => synth.name === filter))}
							>
								{filter}
							</ButtonFilter>
						);
					})}
				</ButtonRow>
				<ListHeader>
					{[
						{ label: 'Pair', value: 'name' },
						{ label: 'Price', value: 'rate' },
					].map((column, i) => {
						return (
							<ListHeaderElement key={i}>
								<ButtonSort
								// onClick={() =>
								// 	setSort(() => {
								// 		if (sort && sort.column === column.value) {
								// 			return { ...sort, isAscending: !sort.isAscending };
								// 		} else return { column: column.value, isAscending: true };
								// 	})
								// }
								>
									<ListHeaderLabel>{column.label}</ListHeaderLabel>
									{/* <SortIcon src="/images/sort-arrows.svg" /> */}
								</ButtonSort>
							</ListHeaderElement>
						);
					})}
				</ListHeader>
			</ContainerHeader>
			<List>
				{filteredSynths.map((pair, i) => {
					return (
						<Pair
							isDisabled={!rates}
							key={i}
							onClick={() => setSynthPair({ base: pair.base, quote: pair.quote })}
						>
							<PairElement>
								<SynthIcon src={`/images/synths/${pair.base.name}.svg`} />
								<DataMedium>{`${pair.base.name} / ${pair.quote.name}`}</DataMedium>
							</PairElement>
							<PairElement>
								<DataMedium>
									{synthsSigns[quote.name]}
									{formatCurrency(pair.rate, 6)}
								</DataMedium>
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
	display: flex;
	flex-direction: column;
	height: 100%;
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
	margin: 0 0 0 10px;
	padding: 0;
	overflow-y: auto;
	overflow-x: hidden;
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
	opacity: ${props => (props.isDisabled ? 0.5 : 1)};
	pointer-events: ${props => (props.isDisabled ? 'none' : 'auto')};
`;

const PairElement = styled.div`
	white-space: nowrap;
	flex: 1;
	justify-content: flex-end;
	display: flex;
	align-items: center;
	&:first-child {
		justify-content: flex-start;
	}
`;

const SynthIcon = styled.img`
	width: 22px;
	height: 22px;
	margin-right: 6px;
`;

const ListHeader = styled.div`
	display: flex;
	justify-content: space-between;
	padding: 0 12px;
`;

const ListHeaderLabel = styled(DataSmall)`
	font-family: 'apercu-medium', sans-serif;
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

// const SortIcon = styled.img`
// 	width: 6.5px;
// 	height: 8px;
// 	margin-left: 5px;
// `;

const mapStateToProps = state => {
	return {
		synths: getAvailableSynths(state),
		rates: getExchangeRates(state),
		synthsSigns: getSynthsSigns(state),
		synthPair: getSynthPair(state),
		search: getSynthSearch(state),
	};
};

const mapDispatchToProps = {
	setSynthPair,
	setSynthSearch,
};

export default connect(mapStateToProps, mapDispatchToProps)(PairList);
