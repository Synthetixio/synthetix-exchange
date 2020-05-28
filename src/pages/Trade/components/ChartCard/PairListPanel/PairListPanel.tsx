import React, { memo, FC, useState, useEffect } from 'react';

import styled from 'styled-components';
import { connect } from 'react-redux';

import { CARD_HEIGHT, SEARCH_DEBOUNCE_MS } from 'constants/ui';
import { navigateToTrade } from 'constants/routes';

import { getSynthPair, SynthPair } from 'ducks/synths';
import { getMarketsAssetFilter, setMarketsAssetFilter, setBlurBackgroundIsVisible } from 'ducks/ui';
import { getFilteredMarkets, getAllMarkets, MarketPairs, MarketPair } from 'ducks/markets';

import { ReactComponent as MenuArrowDownIcon } from 'assets/images/menu-arrow-down.svg';

import useDebouncedMemo from 'shared/hooks/useDebouncedMemo';

import DropdownPanel from 'components/DropdownPanel';
import Currency from 'components/Currency';

import { FlexDiv } from 'shared/commonStyles';
import { RootState } from 'ducks/types';

import MarketsTable from './MarketsTable';
import SimpleSearch from './SimpleSearch';
import AdvancedSearch from './AdvancedSearch';

const DEFAULT_SEARCH = '';

type StateProps = {
	synthPair: SynthPair;
	marketsByQuote: MarketPairs;
	allMarkets: MarketPairs;
	marketsAssetFilter: string;
};

type DispatchProps = {
	setMarketsAssetFilter: typeof setMarketsAssetFilter;
	setBlurBackgroundIsVisible: typeof setBlurBackgroundIsVisible;
};

type PairListPanelProps = StateProps & DispatchProps;

const PairListPanel: FC<PairListPanelProps> = memo(
	({
		synthPair: { base, quote },
		marketsByQuote,
		allMarkets,
		marketsAssetFilter,
		setMarketsAssetFilter,
		setBlurBackgroundIsVisible,
	}) => {
		const [search, setSearch] = useState<string>(DEFAULT_SEARCH);
		const [pairListDropdownIsOpen, setPairListDropdownIsOpen] = useState<boolean>(false);
		const [advancedSearchIsOpen, setAdvancedIsSearchOpen] = useState<boolean>(false);
		const [baseCurrencySearch, setBaseCurrencySearch] = useState<string>(DEFAULT_SEARCH);
		const [quoteCurrencySearch, setQuoteCurrencySearch] = useState<string>(DEFAULT_SEARCH);

		const filteredMarkets = useDebouncedMemo(
			() => {
				if (!search && !baseCurrencySearch && !quoteCurrencySearch) {
					return marketsByQuote;
				} else {
					if (advancedSearchIsOpen) {
						const baseCurrencySearchLowered = baseCurrencySearch.toLowerCase();
						const quoteCurrencySearchLowered = quoteCurrencySearch.toLowerCase();

						return allMarkets.filter(({ baseCurrencyKey, quoteCurrencyKey }) => {
							const matches = [];

							if (baseCurrencySearch) {
								matches.push(baseCurrencyKey.toLowerCase().includes(baseCurrencySearchLowered));
							}
							if (quoteCurrencySearch) {
								matches.push(quoteCurrencyKey.toLowerCase().includes(quoteCurrencySearchLowered));
							}

							return matches.every((match) => match);
						});
					} else {
						const searchLowered = search.toLowerCase();
						return allMarkets.filter(
							({ baseCurrencyKey, quoteCurrencyKey }) =>
								baseCurrencyKey.toLowerCase().includes(searchLowered) ||
								quoteCurrencyKey.toLowerCase().includes(searchLowered)
						);
					}
				}
			},
			[
				marketsByQuote,
				allMarkets,
				search,
				advancedSearchIsOpen,
				baseCurrencySearch,
				quoteCurrencySearch,
			],
			SEARCH_DEBOUNCE_MS
		);

		const resetSearch = () => {
			setSearch(DEFAULT_SEARCH);
			setBaseCurrencySearch(DEFAULT_SEARCH);
			setQuoteCurrencySearch(DEFAULT_SEARCH);
		};

		const toggleDropdown = (isOpen: boolean) => {
			if (!isOpen && !pairListDropdownIsOpen) return;

			resetSearch();
			setAdvancedIsSearchOpen(false);
			setPairListDropdownIsOpen(isOpen);
			setBlurBackgroundIsVisible(isOpen);
		};

		useEffect(() => {
			return () => {
				setBlurBackgroundIsVisible(false);
			};
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);

		return (
			<DropdownPanel
				isOpen={pairListDropdownIsOpen}
				handleClose={() => toggleDropdown(false)}
				onHeaderClick={() => toggleDropdown(!pairListDropdownIsOpen)}
				width="300px"
				header={
					<DropdownPanelHeader>
						<Currency.Pair
							baseCurrencyKey={base.name}
							quoteCurrencyKey={quote.name}
							showIcon={true}
						/>
						<MenuArrowDownIcon className="arrow" />
					</DropdownPanelHeader>
				}
				body={
					<PairListContainer>
						<SearchContainer>
							{advancedSearchIsOpen ? (
								<AdvancedSearch
									baseCurrencySearch={baseCurrencySearch}
									onBaseCurrencyChange={(e) => setBaseCurrencySearch(e.target.value)}
									quoteCurrencySearch={quoteCurrencySearch}
									onQuoteCurrencyChange={(e) => setQuoteCurrencySearch(e.target.value)}
									onSwapCurrencies={() => {
										const baseSearch = baseCurrencySearch;
										const quoteSearch = quoteCurrencySearch;

										setBaseCurrencySearch(quoteSearch);
										setQuoteCurrencySearch(baseSearch);
									}}
									onClose={() => {
										resetSearch();
										setAdvancedIsSearchOpen(false);
									}}
								/>
							) : (
								<SimpleSearch
									search={search}
									marketsAssetFilter={marketsAssetFilter}
									onSearchChange={(e) => setSearch(e.target.value)}
									onAssetFilterClick={(_, asset) => {
										resetSearch();
										setMarketsAssetFilter({ marketsAssetFilter: asset });
									}}
									onAdvancedSearchClick={() => {
										resetSearch();
										setAdvancedIsSearchOpen(true);
									}}
								/>
							)}
						</SearchContainer>
						<MarketsTable
							markets={filteredMarkets}
							onTableRowClick={(row: { original: MarketPair }) => {
								navigateToTrade(row.original.baseCurrencyKey, row.original.quoteCurrencyKey);
								toggleDropdown(false);
							}}
						/>
					</PairListContainer>
				}
			/>
		);
	}
);

const PairListContainer = styled.div`
	height: 100%;
	padding-bottom: 12px;
`;

const SearchContainer = styled.div`
	padding: 12px;
	display: grid;
	grid-gap: 12px;
`;

const DropdownPanelHeader = styled(FlexDiv)`
	width: 100%;
	justify-content: space-between;
	align-items: center;
	height: ${CARD_HEIGHT};
	padding: 0 12px;
	background-color: ${(props) => props.theme.colors.accentL1};
`;

const mapStateToProps = (state: RootState): StateProps => ({
	synthPair: getSynthPair(state),
	marketsByQuote: getFilteredMarkets(state),
	allMarkets: getAllMarkets(state),
	marketsAssetFilter: getMarketsAssetFilter(state),
});

const mapDispatchToProps: DispatchProps = {
	setMarketsAssetFilter,
	setBlurBackgroundIsVisible,
};

export default connect<StateProps, DispatchProps, {}, RootState>(
	mapStateToProps,
	mapDispatchToProps
)(PairListPanel);
