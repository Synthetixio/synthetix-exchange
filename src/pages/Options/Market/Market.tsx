import React, { memo, FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router-dom';

import { OptionsMarket } from 'ducks/options/types';

import ROUTES, { navigateTo } from 'constants/routes';

import Spinner from 'components/Spinner';

type Props = RouteComponentProps<{
	marketAddress: string;
}>;

type MarketProps = Props;

const Market: FC<MarketProps> = memo(({ match }) => {
	const [optionsMarket, setOptionsMarket] = useState<OptionsMarket | null>(null);

	useEffect(() => {
		const { params } = match;

		if (params && params.marketAddress) {
			// check for market
			setOptionsMarket(null);
		} else {
			navigateTo(ROUTES.Options.Home);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [match]);

	return optionsMarket ? (
		<div>Market</div>
	) : (
		<LoaderContainer>
			<Spinner size="sm" centered={true} />
		</LoaderContainer>
	);
});

const LoaderContainer = styled.div`
	position: relative;
	height: 400px;
`;

export default Market;
