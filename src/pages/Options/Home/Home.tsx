import React, { FC, useMemo } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useQuery } from 'react-query';
import snxData from 'synthetix-data';
import { ConnectedProps, connect } from 'react-redux';

import { OptionsMarkets } from 'pages/Options/types';
import { getAvailableSynthsMap } from 'ducks/synths';
import { RootState } from 'ducks/types';

import { PageContent, LoaderContainer } from 'shared/commonStyles';
import { media } from 'shared/media';
import { lightTheme } from 'styles/theme';

import QUERY_KEYS from 'constants/queryKeys';
import { Z_INDEX } from 'constants/ui';

import Spinner from 'components/Spinner';

import MarketCreation from './MarketCreation';
import HotMarkets from './HotMarkets';
import ExploreMarkets from './ExploreMarkets';

import { sortOptionsMarkets } from './utils';

const mapStateToProps = (state: RootState) => ({
	synthsMap: getAvailableSynthsMap(state),
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type HomeProps = PropsFromRedux;

const MAX_HOT_MARKETS = 4;

const Home: FC<HomeProps> = ({ synthsMap }) => {
	const marketsQuery = useQuery<OptionsMarkets, any>(QUERY_KEYS.BinaryOptions.Markets, () =>
		snxData.binaryOptions.markets()
	);

	const optionsMarkets = useMemo(
		() =>
			marketsQuery.isSuccess && Array.isArray(marketsQuery.data)
				? sortOptionsMarkets(marketsQuery.data, synthsMap)
				: [],
		[marketsQuery, synthsMap]
	);

	const hotMarkets = useMemo(() => optionsMarkets.slice(0, MAX_HOT_MARKETS), [optionsMarkets]);

	return (
		<ThemeProvider theme={lightTheme}>
			{optionsMarkets.length ? (
				<>
					<HotMarketsContent>
						<HotMarkets optionsMarkets={hotMarkets} />
					</HotMarketsContent>
					<MarketCreationContainer>
						<PageContent>
							<MarketCreation />
						</PageContent>
					</MarketCreationContainer>
					<ExploreMarketsContainer>
						<PageContent>
							<ExploreMarkets optionsMarkets={optionsMarkets} />
						</PageContent>
					</ExploreMarketsContainer>
				</>
			) : (
				<LoaderContainer>
					<Spinner size="sm" centered={true} />
				</LoaderContainer>
			)}
		</ThemeProvider>
	);
};

const HotMarketsContent = styled(PageContent)`
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

const Container = styled.div`
	background-color: ${(props) => props.theme.colors.white};
`;

const MarketCreationContainer = styled(Container)`
	padding-bottom: 65px;
	padding-top: 140px;
	${media.large`
		padding-top: 40px;
	`}
`;

const ExploreMarketsContainer = styled(Container)`
	padding-bottom: 97px;
`;

export default connector(Home);
