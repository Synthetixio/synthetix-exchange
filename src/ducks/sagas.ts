import { all } from 'redux-saga/effects';

import { watchFetchMarketsRequest } from './markets';
import { watchFetchWalletBalancesRequest } from './wallet/walletBalances';
import { watchFetchHistoricalRatesRequest } from './historicalRates';
import { watchFetchSystemStatusRequest } from './app';
import { watchFetchRatesRequest } from './rates';

const rootSaga = function* () {
	yield all([
		watchFetchHistoricalRatesRequest(),
		watchFetchMarketsRequest(),
		watchFetchWalletBalancesRequest(),
		watchFetchRatesRequest(),
		watchFetchSystemStatusRequest(),
	]);
};

export default rootSaga;
