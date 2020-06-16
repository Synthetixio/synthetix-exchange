import React, { FC, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation, Trans } from 'react-i18next';
import styled from 'styled-components';
import Tooltip from '@material-ui/core/Tooltip';
import orderBy from 'lodash/orderBy';

import {
	fetchMarketsRequest,
	MarketPairsMap,
	getAllMarketsMap,
	BaseMarketPairs,
} from 'ducks/markets';
import { RootState } from 'ducks/types';
import { SynthDefinition } from 'ducks/synths';

import { getFilteredMarketNames, getMarketPairByMC, toMarketPair } from 'constants/currency';
import { DEFAULT_REQUEST_REFRESH_INTERVAL, SEARCH_DEBOUNCE_MS } from 'constants/ui';
import ROUTES, { navigateTo } from 'constants/routes';

import useInterval from 'shared/hooks/useInterval';
import { media } from 'shared/media';
import { GridDivCenteredCol, AssetSearchInput, NoResultsMessage } from 'shared/commonStyles';
import useDebouncedMemo from 'shared/hooks/useDebouncedMemo';

import { Button } from 'components/Button';
import { headingH4CSS } from 'components/Typography/Heading';

import MarketsTable from 'pages/shared/components/MarketsSection/MarketsTable';
import { makeStyles } from '@material-ui/core';

type StateProps = {
	marketsMap: MarketPairsMap;
	marketPairs: BaseMarketPairs;
};

type Props = {
	synth: SynthDefinition;
};

type DispatchProps = {
	fetchMarketsRequest: typeof fetchMarketsRequest;
};

type MarketSectionProps = StateProps & DispatchProps & Props;

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

const TOP_RANK = 5;

export const SynthMarkets: FC<MarketSectionProps> = ({
	fetchMarketsRequest,
	synth,
	marketsMap,
	marketPairs,
}) => {
	const classes = useStyles();
	const { t } = useTranslation();
	const [assetSearch, setAssetSearch] = useState<string>('');
	const [showTopRanking, setShowTopRanking] = useState<boolean>(true);

	useEffect(() => {
		fetchMarketsRequest({ pairs: marketPairs });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useInterval(() => {
		fetchMarketsRequest({ pairs: marketPairs });
	}, DEFAULT_REQUEST_REFRESH_INTERVAL);

	const markets = useMemo(
		() => marketPairs.map((market) => marketsMap[market.pair]),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[marketsMap]
	);

	const filteredMarkets = useDebouncedMemo(
		() =>
			markets.filter(
				({ baseCurrencyKey, quoteCurrencyKey }) =>
					baseCurrencyKey.toLowerCase().includes(assetSearch.toLowerCase()) ||
					quoteCurrencyKey.toLowerCase().includes(assetSearch.toLowerCase())
			),
		[markets, assetSearch],
		SEARCH_DEBOUNCE_MS
	);

	const topMarkets = useMemo(
		() => orderBy(filteredMarkets, 'rates24hVol', 'desc').slice(0, TOP_RANK),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[showTopRanking, filteredMarkets]
	);

	const marketsLoaded = useMemo(() => markets.every((market) => market.isLoaded), [markets]);

	const topRankingDisabled = !!assetSearch;

	return (
		<>
			<Header>
				<Title>{t('synths.overview.synth-markets.title', { currencyKey: synth.name })}</Title>
				<Filters>
					<Tooltip
						title={<span>{t('synths.overview.synth-markets.top-rank-synth-tooltip')}</span>}
						placement="top"
						classes={classes}
						arrow={true}
					>
						<Button
							size="md"
							palette="outline-secondary"
							onClick={() => setShowTopRanking(!showTopRanking)}
							isActive={showTopRanking}
							disabled={topRankingDisabled}
						>
							{t('common.top-number', { number: TOP_RANK })}
						</Button>
					</Tooltip>
					<AssetSearchInput onChange={(e) => setAssetSearch(e.target.value)} value={assetSearch} />
				</Filters>
			</Header>
			<MarketsTable
				markets={showTopRanking && !topRankingDisabled ? topMarkets : filteredMarkets}
				marketsLoaded={marketsLoaded}
				noResultsMessage={
					assetSearch && filteredMarkets.length === 0 ? (
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
			<ButtonContainer>
				<StyledButton palette="outline" onClick={() => navigateTo(ROUTES.Synths.Home, false, true)}>
					{t('synths.overview.synth-markets.back-button-label')}
				</StyledButton>
			</ButtonContainer>
		</>
	);
};

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

const Title = styled.div`
	${headingH4CSS};
	color: ${(props) => props.theme.colors.brand};
`;

const ButtonContainer = styled.div`
	padding-top: 50px;
	text-align: center;
`;

const StyledButton = styled(Button)`
	padding: 0 30px;
	background-color: transparent;
`;

const mapStateToProps = (state: RootState, ownProps: Props): StateProps => ({
	marketsMap: getAllMarketsMap(state),
	marketPairs: getFilteredMarketNames(ownProps.synth.name, 'quote').map((market) => {
		const { base, quote } = getMarketPairByMC(market.baseCurrencyKey, market.quoteCurrencyKey);
		return {
			baseCurrencyKey: base,
			quoteCurrencyKey: quote,
			pair: toMarketPair(base, quote),
		};
	}),
});

const mapDispatchToProps: DispatchProps = {
	fetchMarketsRequest,
};

export default connect<StateProps, DispatchProps, Props, RootState>(
	mapStateToProps,
	mapDispatchToProps
)(SynthMarkets);
