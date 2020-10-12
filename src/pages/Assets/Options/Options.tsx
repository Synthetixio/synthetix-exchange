import React, { FC, useMemo } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import styled from 'styled-components';
import { GridDiv } from 'shared/commonStyles';
import snxData from 'synthetix-data';

import { SYNTHS_MAP } from 'constants/currency';
import { getCurrencyKeyBalance } from 'utils/balances';

import { getWalletBalancesMap, getIsRefreshingWalletBalances } from 'ducks/wallet/walletBalances';
import { RootState } from 'ducks/types';

import Spinner from 'components/Spinner';

import Banner from './Banner';
import Markets from './Markets';
import { useQuery } from 'react-query';
import { OptionsMarkets } from 'pages/Options/types';
import QUERY_KEYS from 'constants/queryKeys';
import { getCurrentWalletAddress } from 'ducks/wallet/walletDetails';
import { sortOptionsMarkets } from 'pages/Options/Home/utils';
import { getAvailableSynthsMap } from 'ducks/synths';

const mapStateToProps = (state: RootState) => ({
	walletBalancesMap: getWalletBalancesMap(state),
	isRefreshingWalletBalances: getIsRefreshingWalletBalances(state),
	currentWalletAddress: getCurrentWalletAddress(state),
	synthsMap: getAvailableSynthsMap(state),
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type OptionsProps = PropsFromRedux;

const Options: FC<OptionsProps> = ({
	walletBalancesMap,
	isRefreshingWalletBalances,
	currentWalletAddress,
	synthsMap,
}) => {
	const sUSDBalance = getCurrencyKeyBalance(walletBalancesMap, SYNTHS_MAP.sUSD) || 0;

	const marketsQuery = useQuery<OptionsMarkets, any>(QUERY_KEYS.BinaryOptions.Markets, () =>
		snxData.binaryOptions.markets({ max: Infinity })
	);

	const userBidsMarketsQuery = useQuery<string[], any>(
		QUERY_KEYS.BinaryOptions.UserMarkets(currentWalletAddress!),
		() => snxData.binaryOptions.marketsBidOn({ account: currentWalletAddress })
	);

	const optionsMarkets = useMemo(
		() =>
			marketsQuery.isSuccess && Array.isArray(marketsQuery.data)
				? sortOptionsMarkets(marketsQuery.data, synthsMap)
				: [],
		[marketsQuery, synthsMap]
	);

	const creatorMarkets = useMemo(
		() =>
			optionsMarkets.filter(
				(market) => market.creator.toLowerCase() === currentWalletAddress!.toLowerCase()
			),
		[optionsMarkets, currentWalletAddress]
	);

	const userBidsMarkets = useMemo(
		() =>
			userBidsMarketsQuery.isSuccess && Array.isArray(userBidsMarketsQuery.data)
				? optionsMarkets.filter(({ address }) => userBidsMarketsQuery.data.includes(address))
				: [],
		[optionsMarkets, userBidsMarketsQuery.data, userBidsMarketsQuery.isSuccess]
	);

	const hasMarkets = Boolean(creatorMarkets.length || userBidsMarkets.length);
	const isLoading =
		isRefreshingWalletBalances || marketsQuery.isLoading || userBidsMarketsQuery.isLoading;

	return (
		<Container>
			{isLoading ? (
				<Spinner size="sm" centered={true} />
			) : (
				<>
					<Banner hasMarkets={hasMarkets} noSUSD={!sUSDBalance} />
					{hasMarkets && (
						<Markets creatorMarkets={creatorMarkets} userBidsMarkets={userBidsMarkets} />
					)}
				</>
			)}
		</Container>
	);
};

const Container = styled(GridDiv)`
	grid-template-rows: auto 1fr;
	height: 100%;
	position: relative;
	grid-gap: 20px;
`;

export default connector(Options);
