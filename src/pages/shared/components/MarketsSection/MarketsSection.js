import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import styled, { ThemeProvider } from 'styled-components';
import { Z_INDEX } from 'src/constants/ui';
import { breakpoint, media } from 'src/shared/media';

import {
	getIsLoadedFilteredMarkets,
	fetchMarketsRequest,
	getOrderedMarkets,
} from 'src/ducks/markets';

import { getMarketsAssetFilter, setMarketsAssetFilter } from 'src/ducks/ui';

import { lightTheme } from 'src/styles/theme';

import { getFilteredMarketNames } from 'src/constants/currency';
import { navigateTo, ROUTES } from 'src/constants/routes';
import useInterval from 'src/shared/hooks/useInterval';

import { Button } from 'src/components/Button';

import MarketsTable from './MarketsTable';
import MarketsCharts from './MarketsCharts';

import { ASSET_FILTERS, MARKETS_REFRESH_INTERVAL_MS } from './constants';

export const MarketsSection = ({
	fetchMarketsRequest,
	markets,
	marketsLoaded,
	marketsAssetFilter,
	setMarketsAssetFilter,
	isOnSplashPage,
}) => {
	const { t } = useTranslation();

	const marketPairs = getFilteredMarketNames(marketsAssetFilter);

	useEffect(() => {
		fetchMarketsRequest({ pairs: marketPairs });
	}, [fetchMarketsRequest, marketPairs]);

	useInterval(() => {
		fetchMarketsRequest({ pairs: marketPairs });
	}, MARKETS_REFRESH_INTERVAL_MS);

	return (
		<ThemeProvider theme={lightTheme}>
			<MarketChartsContent>
				<MarketsCharts markets={markets} marketsLoaded={marketsLoaded} />
			</MarketChartsContent>
			<MarketsTableContainer>
				<Content>
					<AssetFilters>
						{ASSET_FILTERS.map(({ asset }) => (
							<FilterButton
								size="sm"
								palette="secondary"
								isActive={asset === marketsAssetFilter}
								key={asset}
								onClick={() => setMarketsAssetFilter({ marketsAssetFilter: asset })}
							>
								{asset}
							</FilterButton>
						))}
					</AssetFilters>
					<MarketsTable markets={markets} marketsLoaded={marketsLoaded} />
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
				</Content>
			</MarketsTableContainer>
		</ThemeProvider>
	);
};

MarketsSection.propTypes = {
	synthsMap: PropTypes.object,
	fetchMarketsRequest: PropTypes.func.isRequired,
	marketsLoaded: PropTypes.bool.isRequired,
	markets: PropTypes.array.isRequired,
	isOnSplashPage: PropTypes.bool,
};

const AssetFilters = styled.div`
	padding: 32px 0;
	display: inline-grid;
	grid-auto-flow: column;
	grid-gap: 8px;

	${media.large`
		padding: 32px 24px;
	`}
`;

const FilterButton = styled(Button)`
	text-transform: none;
`;

const MarketsTableContainer = styled.div`
	background-color: ${props => props.theme.colors.white};
	position: relative;
	padding-top: 120px;
	${media.large`
			padding-top: 0;
		`}
	${media.medium`
		padding-top: 0px;
	`}
`;

const Content = styled.div`
	max-width: ${breakpoint.large}px;
	margin: 0 auto;
`;

const MarketChartsContent = styled(Content)`
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

const mapStateToProps = (state, ownProps) => ({
	markets: ownProps.isOnSplashPage
		? getOrderedMarkets(state).slice(0, 10)
		: getOrderedMarkets(state),
	marketsLoaded: getIsLoadedFilteredMarkets(state),
	marketsAssetFilter: getMarketsAssetFilter(state),
});

const mapDispatchToProps = {
	fetchMarketsRequest,
	setMarketsAssetFilter,
};

export default connect(mapStateToProps, mapDispatchToProps)(MarketsSection);
