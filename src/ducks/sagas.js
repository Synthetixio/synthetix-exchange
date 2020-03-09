import { all } from 'redux-saga/effects';

import { watchFetchMarketsRequest } from './markets';

const rootSaga = function*() {
	yield all([watchFetchMarketsRequest()]);
};

export default rootSaga;
