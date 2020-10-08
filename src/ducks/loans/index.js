import { combineReducers } from 'redux';

import myLoans from './myLoans';
import contractInfo from './contractInfo';
import allLiquidations from './allLiquidations';

export default combineReducers({
	myLoans,
	allLiquidations,
	contractInfo,
});
