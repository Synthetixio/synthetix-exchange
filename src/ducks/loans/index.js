import { combineReducers } from 'redux';

import myLoans from './myLoans';
import contractInfo from './contractInfo';

export default combineReducers({
	myLoans,
	contractInfo,
});
