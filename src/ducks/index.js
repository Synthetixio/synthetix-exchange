import { combineReducers } from 'redux';
import ui from './ui';
import wallet from './wallet';
import synths from './synths';

export default combineReducers({
	wallet,
	ui,
	synths,
});

// UI REDUCERS
export const walletPopupIsVisible = state => {
	return state.ui.walletPopupIsVisible;
};

export const depotPopupIsVisible = state => {
	return state.ui.depotPopupIsVisible;
};

export const getCurrentTheme = state => {
	return state.ui.theme;
};

// WALLET REDUCERS
export const getWalletInfo = state => {
	return state.wallet;
};

export const getTransactionSettings = state => {
	return {
		transactionSpeed: state.wallet.transactionSpeed,
		gasAndSpeedInfo: state.wallet.gasAndSpeedInfo,
	};
};

export const getExchangeFeeRate = state => {
	return state.wallet.exchangeFeeRate;
};

// SYNTHS REDUCERS
export const getAvailableSynths = state => {
	return state.synths.availableSynths;
};

export const getSynthPair = state => {
	return { base: state.synths.baseSynth, quote: state.synths.quoteSynth };
};

export const getExchangeRates = state => {
	return state.synths.exchangeRates;
};

export const getEthRate = state => {
	return state.synths.ethRate;
};

export const getFrozenSynths = state => {
	return state.synths.frozenSynths;
};
