import { takeLatest, put } from 'redux-saga/effects';
import { RootState } from 'ducks/types';

import { createRequestSliceFactory, RequestSliceFactoryState } from '../requestSliceFactory';
import { OptionsMarketsMap, OptionsMarkets } from './types';
import { createSelector } from '@reduxjs/toolkit';
import { getPhase } from './constants';
import { getCurrentWalletAddress } from 'ducks/wallet/walletDetails';
import orderBy from 'lodash/orderBy';
import keyBy from 'lodash/keyBy';
import mapValues from 'lodash/mapValues';
import { getAvailableSynthsMap } from 'ducks/synths';

import snxData from 'synthetix-data';

export type OptionsMarketsSliceState = RequestSliceFactoryState<OptionsMarketsMap>;

const optionsMarketsSliceName = 'optionsMarkets';

const optionsMarketsSlice = createRequestSliceFactory<OptionsMarketsMap>({
	name: optionsMarketsSliceName,
	initialState: {
		data: {
			'0x62bf0c296872b5b67c781cdbab4656ac63c76750': {
				address: '0x62bf0c296872b5b67c781cdbab4656ac63c76750',
				timestamp: 1592802444000,
				creator: '0x133675afe710dd0da4a61e99e039c225671cc9a3',
				currencyKey: 'sDEFI',
				strikePrice: 1900,
				biddingEndDate: 1592975160000,
				maturityDate: 1593148020000,
				expiryDate: 1608872820000,
				isOpen: true,
				longPrice: 0.6734006734006734,
				shortPrice: 0.05611672278338945,
				poolSize: 18,
				asset: 'DEFI',
				phase: 'bidding',
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
	orderBy(optionsMarkets, 'biddingEndDate', 'desc');

export const getOptionsMarketsState = (state: RootState) => state.options[optionsMarketsSliceName];
export const getOptionsMarketsData = (state: RootState) => getOptionsMarketsState(state).data;

export const getOptionsMarketsMap = createSelector(
	getOptionsMarketsData,
	getAvailableSynthsMap,
	(optionsMarketsData, synthsMap) =>
		mapValues(optionsMarketsData, (optionsMarket) => ({
			...optionsMarket,
			phase: getPhase(optionsMarket),
			asset: synthsMap[optionsMarket.currencyKey]?.asset || optionsMarket.currencyKey,
		}))
);

export const getOptionsMarkets = createSelector(getOptionsMarketsMap, (optionsMarketMap) =>
	Object.values(optionsMarketMap)
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
			: optionsMarkets.filter((optionsMarkets) => optionsMarkets.creator === currentWalletAddress)
);

export const getOrderedYourOptionsMarkets = createSelector(
	getYourOptionsMarkets,
	(optionsMarkets) => orderByBiddingEndDate(optionsMarkets)
);

function* fetchOptionsMarkets() {
	try {
		const markets = yield snxData.binaryOptions.markets();

		yield put(
			fetchOptionsMarketsSuccess({
				data: keyBy(markets, 'address'),
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
