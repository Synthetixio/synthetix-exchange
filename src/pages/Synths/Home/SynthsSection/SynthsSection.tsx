import React, { useState, FC, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components';
import { useTranslation, Trans } from 'react-i18next';

import { media } from 'shared/media';
import { lightTheme } from 'styles/theme';
import useInterval from 'shared/hooks/useInterval';
import useDebouncedMemo from 'shared/hooks/useDebouncedMemo';

import { RootState } from 'ducks/types';
import {
	getAvailableSynths,
	getOrderedSynthsWithRates,
	SynthDefinition,
	SynthDefinitionWithRates,
	getFilteredSynthsWithRates,
} from 'ducks/synths';
import { getSynthsCategoryFilter, setSynthsCategoryFilter } from 'ducks/ui';

import { fetchHistoricalRatesRequest } from 'ducks/historicalRates';

import { Z_INDEX, SEARCH_DEBOUNCE_MS } from 'constants/ui';
import {
	FlexDivRow,
	AssetSearchInput,
	NoResultsMessage,
	PageContent,
	Strong,
} from 'shared/commonStyles';

import { Button } from 'components/Button';

import SynthsTable from './SynthsTable';
import SynthsCharts from './SynthsCharts';

import { SYNTHS_REFRESH_INTERVAL_MS, CATEGORY_FILTERS } from './constants';

type StateProps = {
	synths: SynthDefinition[];
	synthsWithRates: SynthDefinitionWithRates[];
	filteredSynthsWithRates: SynthDefinitionWithRates[];
	synthsCategoryFilter: string | null;
};

type DispatchProps = {
	fetchHistoricalRatesRequest: typeof fetchHistoricalRatesRequest;
	setSynthsCategoryFilter: typeof setSynthsCategoryFilter;
};

type SynthsSectionProps = StateProps & DispatchProps;

const MAX_TOP_SYNTHS = 3;

export const SynthsSection: FC<SynthsSectionProps> = ({
	synths,
	synthsWithRates,
	filteredSynthsWithRates,
	fetchHistoricalRatesRequest,
	synthsCategoryFilter,
	setSynthsCategoryFilter,
}) => {
	const [assetSearch, setAssetSearch] = useState('');

	const { t } = useTranslation();

	const currencyKeys = useMemo(() => synths.map((synth) => synth.name), [synths]);

	useEffect(() => {
		fetchHistoricalRatesRequest({
			currencyKeys,
			periods: ['ONE_DAY'],
		});
	}, [fetchHistoricalRatesRequest, currencyKeys]);

	useInterval(() => {
		fetchHistoricalRatesRequest({
			currencyKeys,
			periods: ['ONE_DAY'],
		});
	}, SYNTHS_REFRESH_INTERVAL_MS);

	const filteredSynths = useDebouncedMemo(
		() =>
			assetSearch
				? filteredSynthsWithRates.filter(({ name, description }) => {
						const assetSearchL = assetSearch.toLowerCase();

						return (
							name.toLowerCase().includes(assetSearchL) ||
							description.toLowerCase().includes(assetSearchL)
						);
				  })
				: filteredSynthsWithRates,
		[filteredSynthsWithRates, assetSearch],
		SEARCH_DEBOUNCE_MS
	);

	const topGainersLosersSynths = useMemo(
		() => [...synthsWithRates.slice(0, MAX_TOP_SYNTHS), ...synthsWithRates.slice(-MAX_TOP_SYNTHS)],
		[synthsWithRates]
	);

	return (
		<ThemeProvider theme={lightTheme}>
			<SynthsChartsContent>
				<SynthsCharts synthsWithRates={topGainersLosersSynths} maxTopSynths={MAX_TOP_SYNTHS} />
			</SynthsChartsContent>
			<SynthsTableContainer>
				<PageContent>
					<FiltersRow>
						<CategoryFilters>
							<Button
								size="md"
								palette="toggle"
								isActive={synthsCategoryFilter == null}
								onClick={() => setSynthsCategoryFilter({ category: null })}
							>
								{t('common.filters.all')}
							</Button>
							{CATEGORY_FILTERS.map((category) => (
								<Button
									size="md"
									palette="toggle"
									isActive={synthsCategoryFilter === category}
									onClick={() => setSynthsCategoryFilter({ category })}
									key={category}
								>
									{t(`common.currency-category.${category}`)}
								</Button>
							))}
						</CategoryFilters>
						<AssetSearchInput
							onChange={(e) => setAssetSearch(e.target.value)}
							value={assetSearch}
						/>
					</FiltersRow>
					<SynthsTable
						synthsWithRates={filteredSynths}
						noResultsMessage={
							assetSearch && filteredSynths.length === 0 ? (
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
				</PageContent>
			</SynthsTableContainer>
		</ThemeProvider>
	);
};

const SynthsTableContainer = styled.div`
	background-color: ${({ theme }) => theme.colors.white};
	position: relative;
	padding-top: 120px;
	padding-bottom: 110px;
	${media.large`
			padding-top: 0;
			padding-bottom: 90px;
		`}
`;

const CategoryFilters = styled.div`
	display: inline-grid;
	grid-auto-flow: column;
	grid-gap: 8px;
	${media.small`
		grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
	`}
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

const SynthsChartsContent = styled(PageContent)`
	position: relative;
	z-index: ${Z_INDEX.BASE};
	transform: translateY(calc(50% - 20px));
	${media.large`
		transform: translateY(50%);
		transform: none;
		padding: 73px 24px;
	`}
	${media.medium`
		transform: translateY(50%);
		transform: none;
		padding: 40px 24px;
	`}
`;

const mapStateToProps = (state: RootState): StateProps => ({
	synths: getAvailableSynths(state),
	synthsWithRates: getOrderedSynthsWithRates(state),
	filteredSynthsWithRates: getFilteredSynthsWithRates(state),
	synthsCategoryFilter: getSynthsCategoryFilter(state),
});

const mapDispatchToProps: DispatchProps = {
	fetchHistoricalRatesRequest,
	setSynthsCategoryFilter,
};

export default connect<StateProps, DispatchProps, {}, RootState>(
	mapStateToProps,
	mapDispatchToProps
)(SynthsSection);
