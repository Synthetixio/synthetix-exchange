import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from 'react-responsive';

import { navigateToTrade } from 'src/constants/routes';
import { CARD_HEIGHT } from 'src/constants/ui';

import { getSynthPair } from 'src/ducks/synths';
import {
	getMarketsAssetFilter,
	setMarketsAssetFilter,
	setBlurBackgroundIsVisible,
} from 'src/ducks/ui';
import { getFilteredMarkets, getAllMarkets } from 'src/ducks/markets';
import { getAvailableSynthsMap } from 'src/ducks/synths';

import { ReactComponent as MenuArrowDownIcon } from 'src/assets/images/menu-arrow-down.svg';

import DropdownPanel from 'src/components/DropdownPanel';
import Currency from 'src/components/Currency';
import { SearchInput } from 'src/components/Input';
import Table from 'src/components/Table';
import { TABLE_PALETTE } from 'src/components/Table/constants';
import { CurrencyCol, RightAlignedCell } from 'src/components/Table/common';
import { ButtonFilter } from 'src/components/Button';
import { FlexDiv } from 'src/shared/commonStyles';

import { mediumMediaQuery, media } from 'src/shared/media';

import { SYNTHS_MAP } from 'src/constants/currency';

const DEFAULT_SEARCH = '';
const ASSET_FILTERS = [SYNTHS_MAP.sUSD, SYNTHS_MAP.sBTC, SYNTHS_MAP.sETH];

const PairListPanel = ({
	synthPair: { base, quote },
	marketsByQuote,
	allMarkets,
	synthsMap,
	marketsAssetFilter,
	setMarketsAssetFilter,
	setBlurBackgroundIsVisible,
}) => {
	const { t } = useTranslation();
	const [search, setSearch] = useState(DEFAULT_SEARCH);
	const [pairListDropdownIsOpen, setPairListDropdownIsOpen] = useState(false);
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

	const toggleDropdown = isOpen => {
		if (!isOpen && !pairListDropdownIsOpen) return;
		setPairListDropdownIsOpen(isOpen);
		setBlurBackgroundIsVisible(isOpen);
	};

	useEffect(() => {
		return () => {
			setBlurBackgroundIsVisible(false);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const isTabletOrMobile = useMediaQuery({ query: mediumMediaQuery });

	return (
		<DropdownPanel
			isOpen={pairListDropdownIsOpen}
			handleClose={() => toggleDropdown(false)}
			onHeaderClick={() => toggleDropdown(!pairListDropdownIsOpen)}
			width={isTabletOrMobile ? '100%' : '300px'}
			header={
				<DropdownPanelHeader>
					<Currency.Pair
						baseCurrencyKey={base.name}
						quoteCurrencyKey={quote.name}
						showIcon={true}
					/>
					<MenuArrowDownIcon />
				</DropdownPanelHeader>
			}
			body={
				<PairListContainer>
					<SearchContainer>
						<SearchInput value={search} onChange={e => setSearch(e.target.value)} />
						<ButtonRow>
							{ASSET_FILTERS.map(asset => {
								return (
									<ButtonFilter
										key={`button-filter-${asset}`}
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
							toggleDropdown(false);
						}}
					></StyledTable>
				</PairListContainer>
			}
		></DropdownPanel>
	);
};

const StyledTable = styled(Table)`
	overflow-y: hidden;
	.table-row {
		width: 100%;
		& > :last-child {
			justify-content: flex-end;
		}
	}
	.table-body {
		overflow-y: overlay;
		width: 300px;
		margin-bottom: 80px;
		${media.medium`
			width: 100%;
		`}
		${media.small`
			width: 100%;
		`}
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
		${media.medium`
			height: 40px;
		`}
		${media.small`
			height: 40px;
		`}
	}
`;

const PairListContainer = styled.div`
	height: 100%;
	padding: 12px 0;
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

const DropdownPanelHeader = styled(FlexDiv)`
	width: 100%;
	justify-content: space-between;
	align-items: center;
	height: ${CARD_HEIGHT};
	padding: 0 12px;
	background-color: ${props => props.theme.colors.accentL1};
`;

const mapStateToProps = state => ({
	synthPair: getSynthPair(state),
	marketsByQuote: getFilteredMarkets(state),
	synthsMap: getAvailableSynthsMap(state),
	allMarkets: getAllMarkets(state),
	marketsAssetFilter: getMarketsAssetFilter(state),
});

const mapDispatchToProps = {
	setMarketsAssetFilter,
	setBlurBackgroundIsVisible,
};

export default connect(mapStateToProps, mapDispatchToProps)(PairListPanel);
