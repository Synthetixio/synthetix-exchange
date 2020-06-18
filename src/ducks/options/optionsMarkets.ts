import { takeLatest, put } from 'redux-saga/effects';
import { RootState } from 'ducks/types';

import { createRequestSliceFactory, RequestSliceFactoryState } from '../requestSliceFactory';
import { OptionsMarketsMap, OptionsMarkets } from './types';
import { createSelector } from '@reduxjs/toolkit';
import { getPhase } from './constants';
import { getCurrentWalletAddress } from 'ducks/wallet/walletDetails';
import orderBy from 'lodash/orderBy';

export type OptionsMarketsSliceState = RequestSliceFactoryState<OptionsMarketsMap>;

const optionsMarketsSliceName = 'optionsMarkets';

const optionsMarketsSlice = createRequestSliceFactory<OptionsMarketsMap>({
	name: optionsMarketsSliceName,
	initialState: {
		data: {
			ad1: {
				timestamp: Date.now(),
				currencyKey: 'sBTC',
				marketAddress: 'ad1',
				creatorAddress: 'xxx',
				phase: 'bidding',
				maturityDate: Date.now() + 100000,
				destructionDate: Date.now() + 1000000,
				strikePrice: 10000,
				endOfBidding: Date.now() + 10000000,
				prices: {
					long: 10,
					short: 90,
				},
				poolSize: 1000,
				transactions: [],
			},
			ad2: {
				timestamp: Date.now(),
				currencyKey: 'sBTC',
				marketAddress: 'ad2',
				creatorAddress: 'xxx',
				phase: 'bidding',
				maturityDate: Date.now() + 100000,
				destructionDate: Date.now() + 1000000,
				strikePrice: 10000,
				endOfBidding: Date.now() + 10000000,
				prices: {
					long: 10,
					short: 90,
				},
				poolSize: 1000,
				transactions: [],
			},
			ad3: {
				timestamp: Date.now(),
				currencyKey: 'sBTC',
				marketAddress: 'ad3',
				creatorAddress: 'xxx',
				phase: 'bidding',
				maturityDate: Date.now() + 100000000,
				destructionDate: Date.now() + 100000000,
				strikePrice: 10000,
				endOfBidding: Date.now() + 1000000,
				prices: {
					long: 10,
					short: 90,
				},
				poolSize: 1000,
				transactions: [],
			},
			ad4: {
				timestamp: Date.now(),
				currencyKey: 'sBTC',
				marketAddress: 'ad4',
				creatorAddress: 'xxx',
				phase: 'bidding',
				maturityDate: Date.now() + 100000,
				destructionDate: Date.now() + 1000000,
				strikePrice: 10000,
				endOfBidding: Date.now() + 10000000,
				prices: {
					long: 50,
					short: 50,
				},
				poolSize: 1000,
				transactions: [],
			},
		},
	},
	options: {
		mergeData: true,
	},
});

export const {
	fetchFailure: fetchOptionsMarketsFailure,
	fetchSuccess: fetchOptionsMarketsSuccess,
	fetchRequest: fetchOptionsMarketsRequest,
} = optionsMarketsSlice.actions;

const orderByBiddingEndDate = (optionsMarkets: OptionsMarkets) =>
	orderBy(optionsMarkets, 'endOfBidding', 'desc');

export const getOptionsMarketsState = (state: RootState) => state.options[optionsMarketsSliceName];

export const getOptionsMarketsMap = (state: RootState) => getOptionsMarketsState(state).data;
export const getOptionsMarkets = createSelector(getOptionsMarketsMap, (optionsMarketMap) =>
	Object.values(optionsMarketMap).map((optionsMarket) => ({
		...optionsMarket,
		phase: getPhase(optionsMarket),
	}))
);

export const getOrderedOptionsMarkets = createSelector(getOptionsMarkets, (optionsMarkets) =>
	orderByBiddingEndDate(optionsMarkets)
);

export const getYourOptionsMarkets = createSelector(
	getOptionsMarkets,
	getCurrentWalletAddress,
	(optionsMarkets, currentWalletAddress) =>
		currentWalletAddress == null
			? []
			: optionsMarkets.filter(
					(optionsMarkets) => optionsMarkets.creatorAddress === currentWalletAddress
			  )
);

export const getOrderedYourOptionsMarkets = createSelector(
	getYourOptionsMarkets,
	(optionsMarkets) => orderByBiddingEndDate(optionsMarkets)
);

function* fetchOptionsMarkets() {
	try {
		yield put(
			fetchOptionsMarketsSuccess({
				data: {},
			})
		);
	} catch (e) {
		yield put(fetchOptionsMarketsFailure({ error: e.message }));
	}
}

export function* watchFetchOptionsMarketsRequest() {
	yield takeLatest(fetchOptionsMarketsRequest.type, fetchOptionsMarkets);
}

export default optionsMarketsSlice.reducer;
