import { combineReducers } from 'redux';
import ui from './ui';
import wallet from './wallet';
import synths from './synths';
import transaction from './transaction';

export default combineReducers({
	wallet,
	ui,
	synths,
	transaction,
});

// UI REDUCERS
export const walletPopupIsVisible = state => {
	return state.ui.walletPopupIsVisible;
};

export const gweiPopupIsVisible = state => {
	return state.ui.gweiPopupIsVisible;
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

export const getWalletBalances = state => {
	return state.wallet.balances;
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

// TRANSACTION REDUCERS
export const getGasInfo = state => {
	const { gasPrice, gasLimit, gasSpeed } = state.transaction;
	return { gasPrice, gasLimit, gasSpeed };
};

export const getExchangeFeeRate = state => {
	return state.transaction.exchangeFeeRate;
};

export const getTransactions = state => {
	return state.transaction.transactions;
};

export const getPendingTransactions = state => {
	return state.transaction.pendingTransactions;
};
