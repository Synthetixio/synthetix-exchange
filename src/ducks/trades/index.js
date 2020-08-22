import { combineReducers } from 'redux';

import allTrades from './allTrades';
import myTrades from './myTrades';

export default combineReducers({
	allTrades,
	myTrades,
});
