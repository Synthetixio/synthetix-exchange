import { combineReducers } from 'redux';
import ui from './ui';
import wallet from './wallet';
import synths from './synths';
import transaction from './transaction';
import loans from './loans';
import rates from './rates';
import app from './app';
import markets from './markets';
import trades from './trades';
import leaderboard from './leaderboard';
import dashboard from './dashboard';
import holders from './holders';

export default combineReducers({
	app,
	wallet,
	ui,
	synths,
	transaction,
	loans,
	rates,
	markets,
	trades,
	leaderboard,
	dashboard,
	holders,
});
