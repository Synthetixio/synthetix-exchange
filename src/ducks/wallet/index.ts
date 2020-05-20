import { combineReducers } from 'redux';

import walletDetails from './walletDetails';
import walletBalances from './walletBalances';

export default combineReducers({
	walletDetails,
	walletBalances,
});
