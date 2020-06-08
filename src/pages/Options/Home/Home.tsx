import React, { memo, FC, useEffect, useMemo } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from 'ducks/types';
import { fetchOptionsMarketsRequest, getOrderedOptionsMarkets } from 'ducks/options/optionsMarkets';

import HotMarkets from './HotMarkets';
import ExploreMarkets from './ExploreMarkets';

import { PageContent } from 'shared/commonStyles';
import { media } from 'shared/media';
import { lightTheme } from 'styles/theme';

import { Z_INDEX } from 'constants/ui';

import YourMarkets from './YourMarkets';

const mapStateToProps = (state: RootState) => ({
	optionsMarkets: getOrderedOptionsMarkets(state),
});

const mapDispatchToProps = {
	fetchOptionsMarketsRequest,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type HomeProps = PropsFromRedux;

const MAX_HOT_MARKETS = 4;

const Home: FC<HomeProps> = memo(({ fetchOptionsMarketsRequest, optionsMarkets }) => {
	useEffect(() => {
		fetchOptionsMarketsRequest();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const hotMarkets = useMemo(() => optionsMarkets.slice(0, MAX_HOT_MARKETS), [optionsMarkets]);

	return (
		<ThemeProvider theme={lightTheme}>
			<HotMarketsContent>
				<HotMarkets optionsMarkets={hotMarkets} />
			</HotMarketsContent>
			<YourMarketsContainer>
				<PageContent>
					<YourMarkets />
				</PageContent>
			</YourMarketsContainer>
			<ExploreMarketsContainer>
				<ExploreMarkets optionsMarkets={hotMarkets} />
			</ExploreMarketsContainer>
		</ThemeProvider>
	);
});

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

const YourMarketsContainer = styled(Container)`
	padding-bottom: 65px;
	padding-top: 140px;
	${media.large`
		padding-top: 0;
	`}
	${media.medium`
		padding-top: 40px;
	`}
`;

const ExploreMarketsContainer = styled(Container)`
	padding-bottom: 97px;
`;

export default connector(Home);
