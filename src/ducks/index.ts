import { combineReducers } from '@reduxjs/toolkit';

import ui from './ui';
import wallet from './wallet';
import synths from './synths';
import transaction from './transaction';
import loans from './loans';
import rates from './rates';
import historicalRates from './historicalRates';
import app from './app';
import markets from './markets';
import trades from './trades';

export default combineReducers({
	app,
	wallet,
	ui,
	synths,
	transaction,
	loans,
	rates,
	historicalRates,
	markets,
	trades,
});
