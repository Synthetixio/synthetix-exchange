import { takeLatest, put } from 'redux-saga/effects';
import { RootState } from 'ducks/types';

import { createRequestSliceFactory, RequestSliceFactoryState } from '../requestSliceFactory';
import { OptionsMarketsMap } from './types';
import { createSelector } from '@reduxjs/toolkit';
import { getPhaseAndEndDate } from './constants';
import { getCurrentWalletAddress } from 'ducks/wallet/walletDetails';
import keyBy from 'lodash/keyBy';
import mapValues from 'lodash/mapValues';
import { getAvailableSynthsMap } from 'ducks/synths';

import snxData from 'synthetix-data';

export type OptionsMarketsSliceState = RequestSliceFactoryState<OptionsMarketsMap>;

const optionsMarketsSliceName = 'optionsMarkets';

const optionsMarketsSlice = createRequestSliceFactory<OptionsMarketsMap>({
	name: optionsMarketsSliceName,
	initialState: {
		data: {},
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

export const getOptionsMarketsState = (state: RootState) => state.options[optionsMarketsSliceName];
export const getOptionsMarketsData = (state: RootState) => getOptionsMarketsState(state).data;

export const getOptionsMarketsMap = createSelector(
	getOptionsMarketsData,
	getAvailableSynthsMap,
	(optionsMarketsData, synthsMap) =>
		mapValues(optionsMarketsData, (optionsMarket) => {
			const { phase, timeRemaining } = getPhaseAndEndDate(
				optionsMarket.biddingEndDate,
				optionsMarket.maturityDate,
				optionsMarket.expiryDate
			);

			return {
				...optionsMarket,
				phase,
				asset: synthsMap[optionsMarket.currencyKey]?.asset || optionsMarket.currencyKey,
				timeRemaining,
			};
		})
);

export const getOptionsMarkets = createSelector(getOptionsMarketsMap, (optionsMarketMap) =>
	Object.values(optionsMarketMap)
);

export const getYourOptionsMarkets = createSelector(
	getOptionsMarkets,
	getCurrentWalletAddress,
	(optionsMarkets, currentWalletAddress) =>
		currentWalletAddress == null
			? []
			: optionsMarkets.filter((optionsMarkets) => optionsMarkets.creator === currentWalletAddress)
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
