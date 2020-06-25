import React, { memo, FC, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import snxJSConnector from 'utils/snxJSConnector';
import { ethers } from 'ethers';

import { binaryOptionMarket } from 'utils/contracts';

import ROUTES, { navigateTo } from 'constants/routes';

import Market from './Market';

type MarketContainerProps = RouteComponentProps<{
	marketAddress: string;
}>;

const MarketContainer: FC<MarketContainerProps> = memo(({ match }) => {
	const [BOMContract, setBOMContract] = useState<ethers.Contract>();

	useEffect(() => {
		const { params } = match;

		if (params && params.marketAddress) {
			setBOMContract(
				new ethers.Contract(
					params.marketAddress,
					binaryOptionMarket.abi,
					// @ts-ignore
					snxJSConnector.provider
				)
			);
		} else {
			navigateTo(ROUTES.Options.Home);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [match]);

	return BOMContract ? (
		<Market BOMContract={BOMContract} marketAddress={match.params.marketAddress} />
	) : null;
});

export default MarketContainer;
