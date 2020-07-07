import React, { memo, FC, useState, useEffect, useMemo } from 'react';
import { ConnectedProps, connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation, Trans } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core';

import { OptionsMarkets } from 'pages/Options/types';
import SearchInput from 'components/Input/SearchInput';
import { Button } from 'components/Button';

import { getIsLoggedIn, getCurrentWalletAddress } from 'ducks/wallet/walletDetails';
import { RootState } from 'ducks/types';

import { ReactComponent as PencilIcon } from 'assets/images/pencil.svg';

import { media } from 'shared/media';
import { GridDivCenteredCol, NoResultsMessage, Strong, FlexDivRow } from 'shared/commonStyles';

import { SEARCH_DEBOUNCE_MS } from 'constants/ui';
import useDebouncedMemo from 'shared/hooks/useDebouncedMemo';

import MarketsTable from '../MarketsTable';
import { useLocalStorage } from 'shared/hooks/useLocalStorage';
import { LOCAL_STORAGE_KEYS } from 'constants/storage';
import { PHASES } from 'pages/Options/constants';

const { BIDDING_PHASE_FILTER } = LOCAL_STORAGE_KEYS;

const mapStateToProps = (state: RootState) => ({
	isLoggedIn: getIsLoggedIn(state),
	currentWalletAddress: getCurrentWalletAddress(state),
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type ExploreMarketsProps = PropsFromRedux & {
	optionsMarkets: OptionsMarkets;
};

const useStyles = makeStyles({
	tooltip: {
		fontSize: '12px',
		background: '#020B29',
		borderRadius: '4px',
		width: '160px',
		textAlign: 'center',
	},
	arrow: {
		color: '#020B29',
	},
});

const phasesWithAll = ['all', ...PHASES];

const ExploreMarkets: FC<ExploreMarketsProps> = memo(
	({ optionsMarkets, isLoggedIn, currentWalletAddress }) => {
		const classes = useStyles();
		const { t } = useTranslation();
		const [assetSearch, setAssetSearch] = useState<string>('');
		const [showCreatorMarkets, setShowCreatorMarkets] = useState<boolean>(false);
		const [phaseFilter, setPhaseFilter] = useLocalStorage(BIDDING_PHASE_FILTER, 'all');

		const phaseFilteredOptionsMarkets = useMemo(
			() =>
				phaseFilter === 'all'
					? optionsMarkets
					: optionsMarkets.filter(({ phase }) => phase === phaseFilter),
			[optionsMarkets, phaseFilter]
		);

		const searchFilteredOptionsMarkets = useDebouncedMemo(
			() =>
				phaseFilteredOptionsMarkets.filter(({ asset }) =>
					asset.toLowerCase().includes(assetSearch.toLowerCase())
				),
			[phaseFilteredOptionsMarkets, assetSearch],
			SEARCH_DEBOUNCE_MS
		);

		const creatorOptionsMarkets = useMemo(
			() =>
				isLoggedIn && showCreatorMarkets
					? optionsMarkets.filter(({ creator }) => creator.toLowerCase() === currentWalletAddress)
					: optionsMarkets,
			[isLoggedIn, showCreatorMarkets, optionsMarkets, currentWalletAddress]
		);

		useEffect(() => {
			if (showCreatorMarkets) {
				setAssetSearch('');
				setPhaseFilter('all');
			}
		}, [setAssetSearch, setPhaseFilter, showCreatorMarkets]);

		return (
			<Container>
				<FiltersRow>
					<PhaseFilters>
						{phasesWithAll.map((phase) => (
							<ToggleButton
								isActive={phase === phaseFilter}
								onClick={() => setPhaseFilter(phase)}
								key={phase}
							>
								{phase === 'all' ? t('common.filters.all') : t(`options.phases.${phase}`)}
							</ToggleButton>
						))}
					</PhaseFilters>
					<UserFilters>
						<Tooltip
							title={
								<span>
									{!isLoggedIn
										? t('options.home.explore-markets.table.filters.creator.tooltip-logged-in')
										: t('options.home.explore-markets.table.filters.creator.tooltip-logged-out')}
								</span>
							}
							placement="top"
							classes={classes}
							arrow={true}
						>
							<ToggleButton
								onClick={() => setShowCreatorMarkets(!showCreatorMarkets)}
								isActive={showCreatorMarkets}
							>
								<PencilIcon />
							</ToggleButton>
						</Tooltip>
						<AssetSearchInput
							onChange={(e) => setAssetSearch(e.target.value)}
							value={assetSearch}
						/>
					</UserFilters>
				</FiltersRow>

				<MarketsTable
					optionsMarkets={showCreatorMarkets ? creatorOptionsMarkets : searchFilteredOptionsMarkets}
					noResultsMessage={
						assetSearch && searchFilteredOptionsMarkets.length === 0 ? (
							<NoResultsMessage>
								<Trans
									i18nKey="common.search-results.no-results-for-query"
									values={{ searchQuery: assetSearch }}
									components={[<Strong />]}
								/>
							</NoResultsMessage>
						) : showCreatorMarkets && creatorOptionsMarkets.length === 0 ? (
							<NoResultsMessage>
								<Trans
									i18nKey="common.search-results.no-results-for-query"
									values={{ searchQuery: currentWalletAddress }}
									components={[<Strong />]}
								/>
							</NoResultsMessage>
						) : undefined
					}
				/>
			</Container>
		);
	}
);

const Container = styled.div``;

const ToggleButton = styled(Button).attrs({
	size: 'md',
	palette: 'toggle',
})``;

const FiltersRow = styled(FlexDivRow)`
	align-items: center;
	flex-wrap: wrap;
	padding: 0 0 32px;
	${media.large`
		padding: 0 32px 24px;
	`}
	margin-top: -20px;
	> * {
		margin-top: 20px;
		${media.small`
		    flex-basis: 100%;
		`}
	}
`;

const UserFilters = styled(GridDivCenteredCol)`
	grid-template-columns: auto 1fr;
	grid-gap: 15px;
`;

const PhaseFilters = styled.div`
	display: inline-grid;
	grid-auto-flow: column;
	grid-gap: 8px;
	${media.small`
		grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
	`}
`;

export const AssetSearchInput = styled(SearchInput)`
	width: 240px;
	.search-input {
		height: 40px;
	}
	${media.small`
		width: 100%;
	`}
`;

export default connector(ExploreMarkets);
