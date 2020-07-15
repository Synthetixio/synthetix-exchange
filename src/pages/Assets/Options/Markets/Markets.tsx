import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core';

import { OptionsMarkets } from 'pages/Options/types';
import SearchInput from 'components/Input/SearchInput';
import { Button } from 'components/Button';

import ROUTES, { navigateTo } from 'constants/routes';

import { ReactComponent as PencilIcon } from 'assets/images/pencil.svg';
import { ReactComponent as PersonIcon } from 'assets/images/person.svg';
import { ReactComponent as NoResultsIcon } from 'assets/images/no-results.svg';

import { GridDivCenteredCol, NoResultsMessage } from 'shared/commonStyles';

import { SEARCH_DEBOUNCE_MS } from 'constants/ui';
import useDebouncedMemo from 'shared/hooks/useDebouncedMemo';

import { MarketsTable } from 'pages/Options/Home/MarketsTable/MarketsTable';
import Card from 'components/Card';
import { tableHeaderLargeCSS } from 'components/Typography/Table';

type MarketsProps = {
	creatorMarkets: OptionsMarkets;
	userBidsMarkets: OptionsMarkets;
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

const userFilters: Array<{ filterName: Filter['name']; icon: JSX.Element }> = [
	{
		filterName: 'user-bids',
		icon: <PersonIcon width="16px" />,
	},
	{
		filterName: 'creator',
		icon: <PencilIcon width="16px" />,
	},
];

type Filter = {
	name: 'creator' | 'user-bids';
	value?: string;
};

const Markets: FC<MarketsProps> = ({ creatorMarkets, userBidsMarkets }) => {
	const classes = useStyles();
	const { t } = useTranslation();
	const [assetSearch, setAssetSearch] = useState<string>('');
	const [filter, setFilter] = useState<Filter>({
		name: userBidsMarkets.length ? 'user-bids' : 'creator',
	});

	const filteredOptionsMarkets = filter.name === 'user-bids' ? userBidsMarkets : creatorMarkets;

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

	const isCreatorFilter = filter.name === 'creator';
	const isUserBidsFilter = filter.name === 'user-bids';

	return (
		<Card>
			<StyledCardHeader>
				<Title>{t('assets.options.table.title')}</Title>
				<UserFilters>
					{userFilters.map(({ filterName, icon }) => {
						const isActive = filter.name === filterName;

						return (
							<Tooltip
								key={filterName}
								title={
									<span>
										{t(
											`options.home.explore-markets.table.filters.${filterName}.tooltip-not-connected`
										)}
									</span>
								}
								placement="top"
								classes={classes}
								arrow={true}
							>
								<ToggleButton
									onClick={() => {
										setFilter({
											name: filterName,
										});
									}}
									isActive={isActive}
								>
									{icon}
								</ToggleButton>
							</Tooltip>
						);
					})}
					<AssetSearchInput onChange={(e) => setAssetSearch(e.target.value)} value={assetSearch} />
				</UserFilters>
			</StyledCardHeader>
			<StyledCardBody>
				<MarketsTable
					palette="striped"
					optionsMarkets={assetSearch ? searchFilteredOptionsMarkets : filteredOptionsMarkets}
					isLoading={false}
					noResultsMessage={
						(assetSearch && searchFilteredOptionsMarkets.length === 0) ||
						filteredOptionsMarkets.length === 0 ? (
							<StyledNoResultsMessage>
								<NoResultsIcon />
								{assetSearch ? (
									<NoResultsText>
										{t('options.home.explore-markets.table.filters.markets.no-results')}
									</NoResultsText>
								) : (
									<>
										{isCreatorFilter && (
											<>
												<NoResultsText>
													{t('options.home.explore-markets.table.filters.creator.no-results')}
												</NoResultsText>
												<div>
													<Button
														size="lg"
														palette="primary"
														onClick={() => navigateTo(ROUTES.Assets.Options.CreateMarketModal)}
													>
														{t('options.home.market-creation.create-market-button-label')}
													</Button>
												</div>
											</>
										)}
										{isUserBidsFilter && (
											<NoResultsText>
												{t('options.home.explore-markets.table.filters.user-bids.no-results')}
											</NoResultsText>
										)}
									</>
								)}
							</StyledNoResultsMessage>
						) : undefined
					}
				/>
			</StyledCardBody>
		</Card>
	);
};

const ToggleButton = styled(Button).attrs({
	size: 'sm',
	palette: 'outline-secondary',
})`
	padding: 0 8px;
`;

const Title = styled.div`
	${tableHeaderLargeCSS};
	color: ${(props) => props.theme.colors.fontPrimary};
`;

const StyledCardHeader = styled(Card.Header)`
	height: 56px;
	justify-content: space-between;
`;

const StyledCardBody = styled(Card.Body)`
	padding: 0;
`;

const UserFilters = styled(GridDivCenteredCol)`
	grid-template-columns: auto 1fr;
	grid-gap: 15px;
`;

export const AssetSearchInput = styled(SearchInput)`
	width: 240px;
	.search-input {
		height: 32px;
		font-size: 12px;
	}
`;

const StyledNoResultsMessage = styled(NoResultsMessage)`
	padding-top: 65px;
	text-align: center;
	svg {
		path:last-child {
			fill: ${(props) => props.theme.colors.fontPrimary};
		}
	}

	button {
		width: 240px;
	}
`;

const NoResultsText = styled.div`
	padding-top: 20px;
	padding-bottom: 40px;
`;

export default Markets;
