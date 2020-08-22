import { all } from 'redux-saga/effects';

import { watchFetchMarketsRequest } from './markets';
import { watchFetchWalletBalancesRequest } from './wallet/walletBalances';
import { watchFetchMyTradesRequest } from './trades/myTrades';
import { watchFetchAllTradesRequest } from './trades/allTrades';
import { watchFetchHistoricalRatesRequest } from './historicalRates';
import { watchFetchRatesRequest } from './rates';

const rootSaga = function* () {
	yield all([
		watchFetchHistoricalRatesRequest(),
		watchFetchMarketsRequest(),
		watchFetchWalletBalancesRequest(),
		watchFetchMyTradesRequest(),
		watchFetchAllTradesRequest(),
		watchFetchRatesRequest(),
	]);
};

export default rootSaga;
