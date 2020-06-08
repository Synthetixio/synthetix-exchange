import React, { memo, FC } from 'react';
import styled from 'styled-components';

import { OptionsMarkets } from 'ducks/options/types';

type Props = {
	optionsMarkets: OptionsMarkets;
};

type ExploreMarketsProps = Props;

const ExploreMarkets: FC<ExploreMarketsProps> = memo(() => {
	return <Container>Explore Markets</Container>;
});

const Container = styled.div``;

export default ExploreMarkets;
