import React, { memo, FC, useState, useEffect, useMemo } from 'react';
import { ConnectedProps, connect } from 'react-redux';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core';
import snxData from 'synthetix-data';
import { useQuery } from 'react-query';

import { OptionsMarkets } from 'pages/Options/types';
import SearchInput from 'components/Input/SearchInput';
import { Button } from 'components/Button';

import { getIsWalletConnected, getCurrentWalletAddress } from 'ducks/wallet/walletDetails';
import { RootState } from 'ducks/types';

import { ReactComponent as PencilIcon } from 'assets/images/pencil.svg';
import { ReactComponent as PersonIcon } from 'assets/images/person.svg';
import { ReactComponent as NoResultsIcon } from 'assets/images/no-results.svg';

import { media } from 'shared/media';
import { GridDivCenteredCol, NoResultsMessage, FlexDivRow } from 'shared/commonStyles';

import { SEARCH_DEBOUNCE_MS } from 'constants/ui';
import { PHASES } from 'pages/Options/constants';
import QUERY_KEYS from 'constants/queryKeys';
import useDebouncedMemo from 'shared/hooks/useDebouncedMemo';

import MarketsTable from '../MarketsTable';
import ROUTES, { navigateTo } from 'constants/routes';

const mapStateToProps = (state: RootState) => ({
	isWalletConnected: getIsWalletConnected(state),
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

type Filter = {
	name: 'creator' | 'user-bids' | 'phase';
	value?: string;
};

const defaultFilter: Filter = {
	name: 'phase',
};

const ExploreMarkets: FC<ExploreMarketsProps> = memo(
	({ optionsMarkets, isWalletConnected, currentWalletAddress }) => {
		const classes = useStyles();
		const { t } = useTranslation();
		const [assetSearch, setAssetSearch] = useState<string>('');
		const [filter, setFilter] = useState<Filter>(defaultFilter);

		const userBidsMarketsQuery = useQuery<string[], any>(
			QUERY_KEYS.BinaryOptions.UserMarkets(currentWalletAddress || ''),
			() => snxData.binaryOptions.marketsBidOn({ account: currentWalletAddress }),
			{
				enabled: isWalletConnected && filter.name === 'user-bids',
			}
		);

		const filteredOptionsMarkets = useMemo(() => {
			if (filter.name === 'creator' && isWalletConnected) {
				return optionsMarkets.filter(
					({ creator }) => creator.toLowerCase() === currentWalletAddress
				);
			} else if (filter.name === 'user-bids' && isWalletConnected) {
				return userBidsMarketsQuery.isSuccess && Array.isArray(userBidsMarketsQuery.data)
					? optionsMarkets.filter(({ address }) => userBidsMarketsQuery.data.includes(address))
					: [];
			}
			// phase filter
			return filter.value == null
				? optionsMarkets
				: optionsMarkets.filter(({ phase }) => phase === filter.value);
		}, [
			optionsMarkets,
			filter,
			isWalletConnected,
			currentWalletAddress,
			userBidsMarketsQuery.data,
			userBidsMarketsQuery.isSuccess,
		]);

		const searchFilteredOptionsMarkets = useDebouncedMemo(
			() =>
				assetSearch
					? filteredOptionsMarkets.filter(({ asset }) =>
							asset.toLowerCase().includes(assetSearch.toLowerCase())
					  )
					: filteredOptionsMarkets,
			[filteredOptionsMarkets, assetSearch],
			SEARCH_DEBOUNCE_MS
		);

		useEffect(() => {
			setAssetSearch('');
		}, [filter, setAssetSearch]);

		const userFilters: Array<{ filterName: Filter['name']; icon: JSX.Element }> = [
			{
				filterName: 'user-bids',
				icon: <PersonIcon />,
			},
			{
				filterName: 'creator',
				icon: <PencilIcon />,
			},
		];

		const isPhaseFilter = filter.name === 'phase';
		const isCreatorFilter = filter.name === 'creator';
		const isUserBidsFilter = filter.name === 'user-bids';

		const setDefaultFilter = () => setFilter(defaultFilter);

		return (
			<div>
				<FiltersRow>
					<PhaseFilters>
						<ToggleButton
							isActive={isPhaseFilter && filter.value == null}
							onClick={() => setFilter({ name: 'phase' })}
						>
							{t('common.filters.all')}
						</ToggleButton>
						{PHASES.map((phase) => (
							<ToggleButton
								isActive={isPhaseFilter && filter.value === phase}
								onClick={() => setFilter({ name: 'phase', value: phase })}
								key={phase}
							>
								{t(`options.phases.${phase}`)}
							</ToggleButton>
						))}
					</PhaseFilters>
					<UserFilters>
						{userFilters.map(({ filterName, icon }) => {
							const isActive = filter.name === filterName;

							return (
								<Tooltip
									key={filterName}
									title={
										<span>
											{!isWalletConnected
												? t(
														`options.home.explore-markets.table.filters.${filterName}.tooltip-connected`
												  )
												: t(
														`options.home.explore-markets.table.filters.${filterName}.tooltip-not-connected`
												  )}
										</span>
									}
									placement="top"
									classes={classes}
									arrow={true}
								>
									<ToggleButton
										onClick={
											isWalletConnected
												? () => {
														if (isActive) {
															// toggle off
															setDefaultFilter();
														} else {
															// toggle on
															setFilter({
																name: filterName,
															});
														}
												  }
												: undefined
										}
										isActive={isActive}
									>
										{icon}
									</ToggleButton>
								</Tooltip>
							);
						})}
						<AssetSearchInput
							onChange={(e) => setAssetSearch(e.target.value)}
							value={assetSearch}
						/>
					</UserFilters>
				</FiltersRow>

				<MarketsTable
					optionsMarkets={assetSearch ? searchFilteredOptionsMarkets : filteredOptionsMarkets}
					isLoading={userBidsMarketsQuery.isLoading}
					noResultsMessage={
						(assetSearch && searchFilteredOptionsMarkets.length === 0) ||
						filteredOptionsMarkets.length === 0 ? (
							<StyledNoResultsMessage>
								<NoResultsIcon />
								{isPhaseFilter && (
									<NoResultsText>
										{t('options.home.explore-markets.table.filters.markets.no-results')}
									</NoResultsText>
								)}
								{isCreatorFilter && (
									<>
										<NoResultsText>
											{t('options.home.explore-markets.table.filters.creator.no-results')}
										</NoResultsText>
										<div>
											<Button
												size="lg"
												palette="primary"
												onClick={() => navigateTo(ROUTES.Options.CreateMarketModal)}
											>
												{t('options.home.market-creation.create-market-button-label')}
											</Button>
											<ButtonSpacer>{t('common.or')}</ButtonSpacer>
										</div>
									</>
								)}
								{isUserBidsFilter && (
									<NoResultsText>
										{t('options.home.explore-markets.table.filters.user-bids.no-results')}
									</NoResultsText>
								)}
								<Button size="lg" palette="outline" onClick={setDefaultFilter}>
									{isUserBidsFilter
										? t('options.home.explore-markets.table.view-all-open-markets')
										: t('options.home.explore-markets.table.view-all-markets')}
								</Button>
							</StyledNoResultsMessage>
						) : undefined
					}
				/>
			</div>
		);
	}
);

const ToggleButton = styled(Button).attrs({
	size: 'md',
	palette: 'toggle',
})`
	${(props) =>
		!props.onClick &&
		css`
			cursor: default;
			&:hover {
				background-color: ${(props) => props.theme.colors.white} !important;
				svg {
					color: ${(props) => props.theme.colors.fontTertiary};
				}
			}
		`}
`;

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

const StyledNoResultsMessage = styled(NoResultsMessage)`
	padding-top: 65px;
	text-align: center;

	button {
		width: 240px;
	}
`;

const ButtonSpacer = styled.div`
	padding: 16px 0;
`;

const NoResultsText = styled.div`
	padding-top: 20px;
	padding-bottom: 40px;
`;

export default connector(ExploreMarkets);
