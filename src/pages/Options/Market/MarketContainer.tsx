import React, { memo, FC, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import snxJSConnector from 'utils/snxJSConnector';
import { ethers } from 'ethers';

import binaryOptionMarketContract from 'utils/contracts/binaryOptionsMarketContract';

import { LoaderContainer } from 'shared/commonStyles';
import Spinner from 'components/Spinner';

import ROUTES, { navigateTo } from 'constants/routes';

import { BOMContractProvider } from './contexts/BOMContractContext';

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
					binaryOptionMarketContract.abi,
					(snxJSConnector as any).provider
				)
			);
		} else {
			navigateTo(ROUTES.Options.Home);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [match]);

	return BOMContract ? (
		<BOMContractProvider contract={BOMContract}>
			<Market marketAddress={match.params.marketAddress} />
		</BOMContractProvider>
	) : (
		<LoaderContainer>
			<Spinner size="sm" centered={true} />
		</LoaderContainer>
	);
});

export default MarketContainer;
