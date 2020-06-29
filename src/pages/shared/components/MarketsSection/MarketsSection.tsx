import React, { FC, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useTranslation, Trans } from 'react-i18next';
import styled, { ThemeProvider } from 'styled-components';
import { Z_INDEX, DEFAULT_REQUEST_REFRESH_INTERVAL } from 'constants/ui';
import { media } from 'shared/media';

import {
	getIsLoadedFilteredMarkets,
	fetchMarketsRequest,
	getOrderedMarkets,
	MarketPairs,
} from 'ducks/markets';

import { getMarketsAssetFilter, setMarketsAssetFilter } from 'ducks/ui';

import { lightTheme } from 'styles/theme';

import { getFilteredMarketNames, FIAT_SYNTHS, CurrencyKey } from 'constants/currency';
import { SEARCH_DEBOUNCE_MS } from 'constants/ui';
import { navigateTo, ROUTES } from 'constants/routes';
import useInterval from 'shared/hooks/useInterval';
import useDebouncedMemo from 'shared/hooks/useDebouncedMemo';

import { Button, ButtonFilterWithDropdown } from 'components/Button';
import {
	FlexDivRow,
	AssetSearchInput,
	NoResultsMessage,
	PageContent,
	Strong,
} from 'shared/commonStyles';

import MarketsTable from './MarketsTable';
import MarketsCharts from './MarketsCharts';

import { ASSET_FILTERS } from './constants';
import { RootState } from 'ducks/types';

type StateProps = {
	markets: MarketPairs;
	marketsLoaded: boolean;
	marketsAssetFilter: CurrencyKey;
};

type Props = {
	isOnSplashPage?: boolean;
};

type DispatchProps = {
	fetchMarketsRequest: typeof fetchMarketsRequest;
	setMarketsAssetFilter: typeof setMarketsAssetFilter;
};

type MarketSectionProps = StateProps & DispatchProps & Props;

export const MarketsSection: FC<MarketSectionProps> = ({
	fetchMarketsRequest,
	markets,
	marketsLoaded,
	marketsAssetFilter,
	setMarketsAssetFilter,
	isOnSplashPage,
}) => {
	const marketPairs = getFilteredMarketNames(marketsAssetFilter, 'quote');

	const [assetSearch, setAssetSearch] = useState<string>('');

	const { t } = useTranslation();

	useEffect(() => {
		fetchMarketsRequest({ pairs: marketPairs });
	}, [fetchMarketsRequest, marketPairs]);

	useInterval(() => {
		fetchMarketsRequest({ pairs: marketPairs });
	}, DEFAULT_REQUEST_REFRESH_INTERVAL);

	const filteredMarkets = useDebouncedMemo(
		() =>
			markets.filter(({ baseCurrencyKey }) =>
				baseCurrencyKey.toLowerCase().includes(assetSearch.toLowerCase())
			),
		[markets, assetSearch],
		SEARCH_DEBOUNCE_MS
	);

	return (
		<ThemeProvider theme={lightTheme}>
			<MarketChartsContent>
				<MarketsCharts markets={markets} marketsLoaded={marketsLoaded} />
			</MarketChartsContent>
			<MarketsTableContainer>
				<PageContent>
					<FiltersRow>
						<AssetFilters>
							{ASSET_FILTERS.map(({ asset }) => (
								<FilterButton
									size="md"
									palette="secondary"
									isActive={asset === marketsAssetFilter}
									key={asset}
									onClick={() => setMarketsAssetFilter({ marketsAssetFilter: asset })}
								>
									{asset}
								</FilterButton>
							))}
							<StyledButtonFilterWithDropdown
								quote={marketsAssetFilter}
								onClick={(synth: { name: CurrencyKey }) =>
									setMarketsAssetFilter({ marketsAssetFilter: synth.name })
								}
								synths={FIAT_SYNTHS.map((currency) => ({ name: currency }))}
							>
								{t('common.currency.fiat-synths')}
							</StyledButtonFilterWithDropdown>
						</AssetFilters>
						<AssetSearchInput
							onChange={(e) => setAssetSearch(e.target.value)}
							value={assetSearch}
						/>
					</FiltersRow>
					<MarketsTable
						markets={filteredMarkets}
						marketsLoaded={marketsLoaded}
						noResultsMessage={
							assetSearch && filteredMarkets.length === 0 ? (
								<NoResultsMessage>
									<Trans
										i18nKey="common.search-results.no-results-for-query"
										values={{ searchQuery: assetSearch }}
										components={[<Strong />]}
									/>
								</NoResultsMessage>
							) : undefined
						}
					/>
					<ButtonContainer>
						{isOnSplashPage ? (
							<StyledButton
								palette="primary"
								onClick={() => navigateTo(ROUTES.Markets, false, true)}
							>
								{t('markets.table.actions.see-all-pairs')}
							</StyledButton>
						) : (
							<StyledButton palette="primary" onClick={() => navigateTo(ROUTES.Trade)}>
								{t('markets.table.actions.start-trading-now')}
							</StyledButton>
						)}
					</ButtonContainer>
				</PageContent>
			</MarketsTableContainer>
		</ThemeProvider>
	);
};

const AssetFilters = styled.div`
	display: inline-grid;
	grid-auto-flow: column;
	grid-gap: 8px;
`;

const FilterButton = styled(Button)`
	text-transform: none;
`;

const FiltersRow = styled(FlexDivRow)`
	align-items: center;
	flex-wrap: wrap;
	padding: 32px 0;
	${media.large`
		padding: 32px 24px;
	`}
	margin-top: -20px;
	> * {
		margin-top: 20px;
		${media.small`
		    flex-basis: 100%;
		`}
	}
`;

// TODO: ButtonFilterWithDropdown needs to be refactored to allow for easier customization
const StyledButtonFilterWithDropdown = styled(ButtonFilterWithDropdown)`
	height: 40px;
	padding: 0 15px;
	span {
		font-size: 14px;
	}
`;

const MarketsTableContainer = styled.div`
	background-color: ${(props) => props.theme.colors.white};
	position: relative;
	padding-top: 120px;
	${media.large`
			padding-top: 0;
		`}
	${media.medium`
		padding-top: 0px;
	`}
`;

const MarketChartsContent = styled(PageContent)`
	position: relative;
	z-index: ${Z_INDEX.BASE};
	transform: translateY(50%);
	${media.large`
		transform: none;
		padding: 73px 24px;
	`}
	${media.medium`
		transform: none;
		padding: 40px 24px;
	`}
`;

const ButtonContainer = styled.div`
	padding: 75px 0;
	text-align: center;
`;

const StyledButton = styled(Button)`
	padding: 0 70px;
`;

const mapStateToProps = (state: RootState, ownProps: Props): StateProps => ({
	markets: ownProps.isOnSplashPage
		? getOrderedMarkets(state).slice(0, 10)
		: getOrderedMarkets(state),
	marketsLoaded: getIsLoadedFilteredMarkets(state),
	marketsAssetFilter: getMarketsAssetFilter(state),
});

const mapDispatchToProps: DispatchProps = {
	fetchMarketsRequest,
	setMarketsAssetFilter,
};

export default connect<StateProps, DispatchProps, Props, RootState>(
	mapStateToProps,
	mapDispatchToProps
)(MarketsSection);
