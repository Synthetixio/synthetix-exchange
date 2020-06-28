import React, { FC, useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useQuery, queryCache } from 'react-query';
import BiddingPhaseCard from './BiddingPhaseCard';
import TradingPhaseCard from './TradingPhaseCard';
import MaturityPhaseCard from './MaturityPhaseCard';

import snxJSConnector from 'utils/snxJSConnector';

import { RootState } from 'ducks/types';
import { getIsLoggedIn, getCurrentWalletAddress } from 'ducks/wallet/walletDetails';

import { BINARY_OPTIONS_EVENTS } from 'constants/events';
import QUERY_KEYS from 'constants/queryKeys';

import { useMarketContext } from '../contexts/MarketContext';
import { useBOMContractContext } from '../contexts/BOMContractContext';

import { bigNumberFormatter, toBigNumber } from 'utils/formatters';
import { AccountMarketInfo } from 'ducks/options/types';

const mapStateToProps = (state: RootState) => ({
	isLoggedIn: getIsLoggedIn(state),
	currentWalletAddress: getCurrentWalletAddress(state),
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const TradeCard: FC<PropsFromRedux> = ({ isLoggedIn, currentWalletAddress }) => {
	const optionsMarket = useMarketContext();
	const BOMContract = useBOMContractContext();

	let claimableLongAmount = 0;
	let claimableShortAmount = 0;
	let bidLongAmount = 0;
	let bidShortAmount = 0;
	let totalLongPrice = 0;
	let totalShortPrice = 0;
	let nothingToClaim = true;

	const accountMarketInfoQuery = useQuery(
		QUERY_KEYS.BinaryOptions.AccountMarketInfo(
			optionsMarket.address,
			currentWalletAddress as string
		),
		async () => {
			const result = await (snxJSConnector as any).binaryOptionsMarketDataContract.getAccountMarketInfo(
				optionsMarket.address,
				currentWalletAddress
			);
			return {
				claimable: {
					long: bigNumberFormatter(result.claimable.long),
					short: bigNumberFormatter(result.claimable.short),
				},
				balances: {
					long: bigNumberFormatter(result.balances.long),
					short: bigNumberFormatter(result.balances.short),
				},
				bids: {
					long: bigNumberFormatter(result.bids.long),
					short: bigNumberFormatter(result.bids.short),
				},
			};
		},
		{
			enabled: isLoggedIn,
		}
	);

	let accountMarketInfo: AccountMarketInfo | null = null;

	if (isLoggedIn && accountMarketInfoQuery.isSuccess && accountMarketInfoQuery.data) {
		const { bids, claimable } = accountMarketInfoQuery.data;

		claimableLongAmount = claimable.long;
		claimableShortAmount = claimable.short;
		bidLongAmount = bids.long;
		bidShortAmount = bids.short;
		totalLongPrice = optionsMarket.longPrice * bidLongAmount;
		totalShortPrice = optionsMarket.shortPrice * bidShortAmount;
		nothingToClaim = !bidLongAmount && !bidShortAmount;
	}

	accountMarketInfo = {
		claimableLongAmount,
		claimableShortAmount,
		bidLongAmount,
		bidShortAmount,
		totalLongPrice,
		totalShortPrice,
		nothingToClaim,
	};

	useEffect(() => {
		BOMContract.on(BINARY_OPTIONS_EVENTS.BID, () => {
			queryCache.invalidateQueries(QUERY_KEYS.BinaryOptions.Market(BOMContract.address));
			if (currentWalletAddress) {
				queryCache.invalidateQueries(
					QUERY_KEYS.BinaryOptions.AccountMarketInfo(
						optionsMarket.address,
						currentWalletAddress as string
					)
				);
			}
		});
		BOMContract.on(BINARY_OPTIONS_EVENTS.REFUND, () => {
			queryCache.invalidateQueries(QUERY_KEYS.BinaryOptions.Market(BOMContract.address));
			if (currentWalletAddress) {
				queryCache.invalidateQueries(
					QUERY_KEYS.BinaryOptions.AccountMarketInfo(
						optionsMarket.address,
						currentWalletAddress as string
					)
				);
			}
		});
		return () => {
			BOMContract.removeAllListeners(BINARY_OPTIONS_EVENTS.BID);
			BOMContract.removeAllListeners(BINARY_OPTIONS_EVENTS.REFUND);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			{optionsMarket.phase === 'bidding' && (
				<BiddingPhaseCard optionsMarket={optionsMarket} accountMarketInfo={accountMarketInfo} />
			)}
			{optionsMarket.phase === 'trading' && (
				<TradingPhaseCard optionsMarket={optionsMarket} accountMarketInfo={accountMarketInfo} />
			)}
			{optionsMarket.phase === 'maturity' && (
				<MaturityPhaseCard optionsMarket={optionsMarket} accountMarketInfo={accountMarketInfo} />
			)}
		</>
	);
};

export default connector(TradeCard);
