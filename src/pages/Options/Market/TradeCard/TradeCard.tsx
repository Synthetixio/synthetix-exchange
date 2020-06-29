import React, { FC, useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useQuery, queryCache, AnyQueryKey } from 'react-query';

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

import { bigNumberFormatter } from 'utils/formatters';
import { AccountMarketInfo } from 'pages/Options/types';

const mapStateToProps = (state: RootState) => ({
	isLoggedIn: getIsLoggedIn(state),
	currentWalletAddress: getCurrentWalletAddress(state),
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const TradeCard: FC<PropsFromRedux> = ({ isLoggedIn, currentWalletAddress }) => {
	const optionsMarket = useMarketContext();
	const BOMContract = useBOMContractContext();

	const accountMarketInfoQuery = useQuery<AccountMarketInfo, any>(
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

	let accountMarketInfo = {
		balances: {
			long: 0,
			short: 0,
		},
		claimable: {
			long: 0,
			short: 0,
		},
		bids: {
			long: 0,
			short: 0,
		},
	};

	if (isLoggedIn && accountMarketInfoQuery.isSuccess && accountMarketInfoQuery.data) {
		const { balances, claimable, bids } = accountMarketInfoQuery.data as AccountMarketInfo;

		accountMarketInfo.balances = balances;
		accountMarketInfo.claimable = claimable;
		accountMarketInfo.bids = bids;
	}

	useEffect(() => {
		const refetchQueries = () => {
			queryCache.invalidateQueries(
				(QUERY_KEYS.BinaryOptions.Market(BOMContract.address) as unknown) as AnyQueryKey
			);

			if (currentWalletAddress) {
				queryCache.invalidateQueries(
					(QUERY_KEYS.BinaryOptions.AccountMarketInfo(
						optionsMarket.address,
						currentWalletAddress as string
					) as unknown) as AnyQueryKey
				);
			}
		};
		BOMContract.on(BINARY_OPTIONS_EVENTS.BID, () => {
			refetchQueries();
		});
		BOMContract.on(BINARY_OPTIONS_EVENTS.REFUND, () => {
			refetchQueries();
		});
		return () => {
			BOMContract.removeAllListeners(BINARY_OPTIONS_EVENTS.BID);
			BOMContract.removeAllListeners(BINARY_OPTIONS_EVENTS.REFUND);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const sharedProps = {
		optionsMarket,
		accountMarketInfo,
	};

	return (
		<>
			{optionsMarket.phase === 'bidding' && <BiddingPhaseCard {...sharedProps} />}
			{optionsMarket.phase === 'trading' && <TradingPhaseCard {...sharedProps} />}
			{optionsMarket.phase === 'maturity' && <MaturityPhaseCard {...sharedProps} />}
		</>
	);
};

export default connector(TradeCard);
