import { combineReducers } from '@reduxjs/toolkit';

import optionsMarkets from './optionsMarkets';
import recentOptionsTransactions from './recentOptionsTransactions';
import userOptionsTransactions from './userOptionsTransactions';

export default combineReducers({
	optionsMarkets,
	recentOptionsTransactions,
	userOptionsTransactions,
});
