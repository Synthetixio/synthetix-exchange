import React, { useState, memo, FC, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components';
import { useTranslation, Trans } from 'react-i18next';

import { breakpoint, media } from 'shared/media';
import { lightTheme } from 'styles/theme';
import useInterval from 'shared/hooks/useInterval';

import { RootState } from 'ducks/types';
import {
	getAvailableSynths,
	getOrderedSynthsWithRates,
	SynthDefinition,
	SynthDefinitionWithRates,
} from 'ducks/synths';
import { getSynthsCategoryFilter, setSynthsCategoryFilter } from 'ducks/ui';

import { fetchHistoricalRatesRequest } from 'ducks/historicalRates';

import { Z_INDEX } from 'constants/ui';
import { FlexDivRow } from 'shared/commonStyles';

import { SearchInput } from 'components/Input';
import { Button } from 'components/Button';

import SynthsTable from './SynthsTable';
import SynthsCharts from './SynthsCharts';

import { SYNTHS_REFRESH_INTERVAL_MS, CATEGORY_FILTERS } from './constants';

type StateProps = {
	synths: SynthDefinition[];
	synthsWithRates: SynthDefinitionWithRates[];
	synthsCategoryFilter: string[];
};

type DispatchProps = {
	fetchHistoricalRatesRequest: typeof fetchHistoricalRatesRequest;
	setSynthsCategoryFilter: typeof setSynthsCategoryFilter;
};

type SynthsSectionProps = StateProps & DispatchProps;

const MAX_TOP_SYNTHS = 3;

export const SynthsSection: FC<SynthsSectionProps> = memo(
	({
		synths,
		synthsWithRates,
		fetchHistoricalRatesRequest,
		synthsCategoryFilter,
		setSynthsCategoryFilter,
	}) => {
		const [assetSearch, setAssetSearch] = useState('');

		const { t } = useTranslation();

		useEffect(() => {
			fetchHistoricalRatesRequest({ synths, periods: ['ONE_DAY'] });
		}, [fetchHistoricalRatesRequest, synths]);

		useInterval(() => {
			fetchHistoricalRatesRequest({ synths, periods: ['ONE_DAY'] });
		}, SYNTHS_REFRESH_INTERVAL_MS);

		const filteredSynths = useMemo(
			() =>
				assetSearch
					? synthsWithRates.filter(({ name, desc }) => {
							const assetSearchL = assetSearch.toLowerCase();

							return (
								name.toLowerCase().includes(assetSearchL) ||
								desc.toLowerCase().includes(assetSearchL)
							);
					  })
					: synthsWithRates,
			[synthsWithRates, assetSearch]
		);

		const topGainersLosersSynths = useMemo(
			() => [
				...synthsWithRates.slice(0, MAX_TOP_SYNTHS),
				...synthsWithRates.slice(-MAX_TOP_SYNTHS),
			],
			[synthsWithRates]
		);

		return (
			<>
				<ThemeProvider theme={lightTheme}>
					<SynthsChartsContent>
						<SynthsCharts synthsWithRates={topGainersLosersSynths} maxTopSynths={MAX_TOP_SYNTHS} />
					</SynthsChartsContent>
					<SynthsTableContainer>
						<Content>
							<FiltersRow>
								<CategoryFilters>
									{CATEGORY_FILTERS.map(({ category }) => (
										<FilterButton
											size="md"
											palette="toggle"
											isActive={synthsCategoryFilter.includes(category)}
											onClick={() => setSynthsCategoryFilter({ category })}
											key={category}
										>
											{t(`common.currency.${category}`)}
										</FilterButton>
									))}
								</CategoryFilters>
								<AssetSearchInput
									// @ts-ignore
									onChange={(e: any) => setAssetSearch(e.target.value)}
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
												components={[<strong />]}
											/>
										</NoResultsMessage>
									) : undefined
								}
							/>
						</Content>
					</SynthsTableContainer>
				</ThemeProvider>
			</>
		);
	}
);

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

const Content = styled.div`
	max-width: ${breakpoint.large}px;
	margin: 0 auto;
`;

const NoResultsMessage = styled.div`
	padding: 18px;
`;

const CategoryFilters = styled.div`
	display: inline-grid;
	grid-auto-flow: column;
	grid-gap: 8px;
`;

const FilterButton = styled(Button)``;

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

const AssetSearchInput = styled(SearchInput)`
	width: 240px;
	${media.small`
		width: 100%;
	`}
`;

const SynthsChartsContent = styled(Content)`
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
