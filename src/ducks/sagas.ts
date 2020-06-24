import { all } from 'redux-saga/effects';

import { watchFetchMarketsRequest } from './markets';
import { watchFetchWalletBalancesRequest } from './wallet/walletBalances';
import { watchFetchMyTradesRequest } from './trades/myTrades';
import { watchFetchAllTradesRequest } from './trades/allTrades';
import { watchFetchHistoricalRatesRequest } from './historicalRates';
import { watchFetchRatesRequest } from './rates';
import { watchFetchOptionsMarketsRequest } from './options/optionsMarkets';
import { watchFetchRecentOptionsTransactionsRequest } from './options/recentOptionsTransactions';
import { watchFetchUserOptionsTransactionsRequest } from './options/userOptionsTransactions';

const rootSaga = function* () {
	yield all([
		watchFetchHistoricalRatesRequest(),
		watchFetchMarketsRequest(),
		watchFetchWalletBalancesRequest(),
		watchFetchMyTradesRequest(),
		watchFetchAllTradesRequest(),
		watchFetchRatesRequest(),
		watchFetchOptionsMarketsRequest(),
		watchFetchRecentOptionsTransactionsRequest(),
		watchFetchUserOptionsTransactionsRequest(),
	]);
};

export default rootSaga;
