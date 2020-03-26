import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { navigateToTrade } from 'src/constants/routes';

import { getSynthPair } from 'src/ducks/synths';
import {
	setPairListDropdownIsOpen,
	getPairListDropdownIsOpen,
	getMarketsAssetFilter,
	setMarketsAssetFilter,
} from 'src/ducks/ui';
import { getFilteredMarkets, getAllMarkets } from 'src/ducks/markets';
import { getAvailableSynthsMap } from 'src/ducks/synths';

import DropdownPanel from 'src/components/DropdownPanel';
import Currency from 'src/components/Currency';
import { SearchInput } from 'src/components/Input';
import Table from 'src/components/Table';
import { TABLE_PALETTE } from 'src/components/Table/constants';
import { CurrencyCol, RightAlignedCell } from 'src/components/Table/utils';
import { ButtonFilter } from 'src/components/Button';

import { SYNTHS_MAP } from 'src/constants/currency';

const DEFAULT_SEARCH = '';
const ASSET_FILTERS = [SYNTHS_MAP.sUSD, SYNTHS_MAP.sBTC, SYNTHS_MAP.sETH];

const PairListPanel = ({
	synthPair: { base, quote },
	pairListDropdownIsOpen,
	setPairListDropdownIsOpen,
	marketsByQuote,
	allMarkets,
	synthsMap,
	marketsAssetFilter,
	setMarketsAssetFilter,
}) => {
	const { t } = useTranslation();
	const [search, setSearch] = useState(DEFAULT_SEARCH);

	const filteredMarkets = useMemo(() => {
		if (!search) {
			return marketsByQuote;
		} else {
			return allMarkets.filter(
				({ baseCurrencyKey, quoteCurrencyKey }) =>
					baseCurrencyKey.toLowerCase().includes(search.toLowerCase()) ||
					quoteCurrencyKey.toLowerCase().includes(search.toLowerCase())
			);
		}
	}, [marketsByQuote, allMarkets, search]);

	return (
		<DropdownPanel
			isOpen={pairListDropdownIsOpen}
			handleClose={() => setPairListDropdownIsOpen(false)}
			onHeaderClick={() => setPairListDropdownIsOpen(!pairListDropdownIsOpen)}
			header={
				<Currency.Pair baseCurrencyKey={base.name} quoteCurrencyKey={quote.name} showIcon={true} />
			}
			body={
				<PairListContainer>
					<SearchContainer>
						<SearchInput value={search} onChange={e => setSearch(e.target.value)} />
						<ButtonRow>
							{ASSET_FILTERS.map((asset, i) => {
								return (
									<ButtonFilter
										key={`button-filter-${i}`}
										fullRow="true"
										active={asset === marketsAssetFilter}
										onClick={() => {
											setSearch(DEFAULT_SEARCH);
											setMarketsAssetFilter({ marketsAssetFilter: asset });
										}}
									>
										{asset}
									</ButtonFilter>
								);
							})}
						</ButtonRow>
					</SearchContainer>
					<StyledTable
						palette={TABLE_PALETTE.PRIMARY}
						columns={[
							{
								Header: t('markets.table.pair-col'),
								accessor: 'pair',
								width: 150,
								Cell: cellProps => (
									<Currency.Pair
										baseCurrencyKey={cellProps.row.original.baseCurrencyKey}
										quoteCurrencyKey={cellProps.row.original.quoteCurrencyKey}
										showIcon={true}
									/>
								),
								sortable: true,
							},
							{
								Header: t('markets.table.last-price-col'),
								accessor: 'lastPrice',
								width: 100,
								Cell: cellProps => (
									<RightAlignedCell>
										<CurrencyCol synthsMap={synthsMap} cellProps={cellProps} />{' '}
									</RightAlignedCell>
								),
								sortable: true,
							},
						]}
						data={filteredMarkets}
						onTableRowClick={row => {
							navigateToTrade(row.original.baseCurrencyKey, row.original.quoteCurrencyKey);
							setPairListDropdownIsOpen(false);
						}}
					></StyledTable>
				</PairListContainer>
			}
		></DropdownPanel>
	);
};

const StyledTable = styled(Table)`
	.table-row {
		width: 100%;
		& > :last-child {
			justify-content: flex-end;
		}
	}
	.table-body {
		width: 300px;
		margin-bottom: 80px;
	}
	.table-body-row {
		margin: 0 6px 8px 6px;
		& > :first-child {
			padding-left: 12px;
		}
		& > :last-child {
			padding-right: 16px;
		}
	}
	.table-body-cell {
		height: 32px;
	}
`;

const PairListContainer = styled.div`
	height: 100%;
`;

const SearchContainer = styled.div`
	padding: 0 12px;
`;

const ButtonRow = styled.div`
	margin: 14px 0;
	display: flex;
	width: 100%;
	justify-content: space-between;
`;

const mapStateToProps = state => ({
	synthPair: getSynthPair(state),
	pairListDropdownIsOpen: getPairListDropdownIsOpen(state),
	marketsByQuote: getFilteredMarkets(state),
	synthsMap: getAvailableSynthsMap(state),
	allMarkets: getAllMarkets(state),
	marketsAssetFilter: getMarketsAssetFilter(state),
});

const mapDispatchToProps = {
	setPairListDropdownIsOpen,
	setMarketsAssetFilter,
};

export default connect(mapStateToProps, mapDispatchToProps)(PairListPanel);