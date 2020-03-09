import React, { useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Spinner from 'src/components/Spinner';
import { Z_INDEX } from 'src/constants/ui';

import { getAvailableSynthsMap } from 'src/ducks/synths';
import {
	getMarketsForSplashPage,
	getIsLoadingMarkets,
	getIsRefreshingMarkets,
	getIsLoadedMarkets,
	fetchMarketsRequest,
} from 'src/ducks/markets';

import { breakpoint, media } from 'src/shared/media';
import useInterval from 'src/shared/hooks/useInterval';

import MarketsTable from './MarketsTable';
import MarketsCharts from './MarketsCharts';

import { PAIRS, MARKETS_REFRESH_INTERVAL_MS } from './constants';
import { generatePlaceholderMarkets } from './placeholder';

const PLACEHOLDER_MARKETS = generatePlaceholderMarkets(PAIRS);

export const Markets = ({ synthsMap, fetchMarketsRequest, markets, marketsLoaded }) => {
	useEffect(() => {
		fetchMarketsRequest({ pairs: PAIRS });
	}, [fetchMarketsRequest]);

	useInterval(() => {
		fetchMarketsRequest({ pairs: PAIRS });
	}, MARKETS_REFRESH_INTERVAL_MS);

	return (
		<>
			<MarketChartsContent>
				<MarketsCharts
					markets={marketsLoaded ? markets : PLACEHOLDER_MARKETS}
					synthsMap={synthsMap}
					key={marketsLoaded ? 'market-charts-placeholder' : 'market-charts'}
				/>
			</MarketChartsContent>

			<Container>
				{!marketsLoaded && <StyledSpinner size="sm" fullscreen={true} />}
				<Content>
					<MarketsTable
						markets={marketsLoaded ? markets : PLACEHOLDER_MARKETS}
						synthsMap={synthsMap}
						key={marketsLoaded ? 'market-table-placeholder' : 'market-table'}
					/>
				</Content>
			</Container>
		</>
	);
};

Markets.propTypes = {
	synthsMap: PropTypes.object,
	fetchMarketsRequest: PropTypes.func.isRequired,
	marketsLoaded: PropTypes.bool.isRequired,
};

const Container = styled.div`
	background-color: ${props => props.theme.colors.white};
	position: relative;
	padding-top: 170px;
	${media.large`
		padding-top: 70px;
	`}
	${media.medium`
		padding-top: 70px;
	`}
`;

const StyledSpinner = styled(Spinner)`
	z-index: ${Z_INDEX.BASE};
`;

const Content = styled.div`
	max-width: ${breakpoint.large};
	margin: 0 auto;
`;

const MarketChartsContent = styled(Content)`
	position: relative;
	z-index: 1;
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

const mapStateToProps = state => ({
	synthsMap: getAvailableSynthsMap(state),
	markets: getMarketsForSplashPage(state),
	marketsLoading: getIsLoadingMarkets(state),
	marketsLoaded: getIsLoadedMarkets(state),
	marketsRefreshing: getIsRefreshingMarkets(state),
});

const mapDispatchToProps = {
	fetchMarketsRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(Markets);
