import React, { memo, FC, useState, useEffect, useMemo } from 'react';
import { ConnectedProps, connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation, Trans } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core';

import { OptionsMarkets } from 'pages/Options/types';
import { headingH4CSS } from 'components/Typography/Heading';
import SearchInput from 'components/Input/SearchInput';
import { Button } from 'components/Button';

import { getIsLoggedIn, getCurrentWalletAddress } from 'ducks/wallet/walletDetails';
import { RootState } from 'ducks/types';

import { ReactComponent as PencilIcon } from 'assets/images/pencil.svg';

import { media } from 'shared/media';
import { GridDivCenteredCol, NoResultsMessage, Strong } from 'shared/commonStyles';

import { SEARCH_DEBOUNCE_MS } from 'constants/ui';
import useDebouncedMemo from 'shared/hooks/useDebouncedMemo';

import MarketsTable from '../MarketsTable';

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

const ExploreMarkets: FC<ExploreMarketsProps> = memo(
	({ optionsMarkets, isLoggedIn, currentWalletAddress }) => {
		const classes = useStyles();
		const { t } = useTranslation();
		const [assetSearch, setAssetSearch] = useState<string>('');
		const [showCreatorMarkets, setShowCreatorMarkets] = useState<boolean>(false);

		const filteredOptionsMarkets = useDebouncedMemo(
			() =>
				optionsMarkets.filter(({ asset }) =>
					asset.toLowerCase().includes(assetSearch.toLowerCase())
				),
			[optionsMarkets, assetSearch],
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
			setAssetSearch('');
		}, [showCreatorMarkets]);

		return (
			<Container>
				<Header>
					<Title>{t('options.home.explore-markets.title')}</Title>
					<Filters>
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
							<Button
								size="md"
								palette="toggle"
								onClick={() => setShowCreatorMarkets(!showCreatorMarkets)}
								isActive={showCreatorMarkets}
							>
								<PencilIcon />
							</Button>
						</Tooltip>
						<AssetSearchInput
							onChange={(e) => setAssetSearch(e.target.value)}
							value={assetSearch}
						/>
					</Filters>
				</Header>

				<MarketsTable
					optionsMarkets={showCreatorMarkets ? creatorOptionsMarkets : filteredOptionsMarkets}
					noResultsMessage={
						assetSearch && filteredOptionsMarkets.length === 0 ? (
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

const Header = styled(GridDivCenteredCol)`
	padding-bottom: 40px;
	grid-template-columns: 1fr auto;
	justify-items: initial;
	${media.large`
		padding: 0 20px 40px 20px;
	`}
	${media.small`
    grid-gap: 20px;
		grid-template-columns: unset;
		grid-template-rows: auto auto;
	`}
`;

const Filters = styled(GridDivCenteredCol)`
	grid-template-columns: auto 1fr;
	grid-gap: 15px;
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

const Title = styled.div`
	${headingH4CSS};
	color: ${(props) => props.theme.colors.brand};
`;

export default connector(ExploreMarkets);
