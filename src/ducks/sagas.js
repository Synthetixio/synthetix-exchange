import { all } from 'redux-saga/effects';

import { watchFetchMarketsRequest } from './markets';
import { watchFetchWalletBalancesRequest } from './wallet';

const rootSaga = function*() {
	yield all([watchFetchMarketsRequest(), watchFetchWalletBalancesRequest()]);
};

export default rootSaga;
