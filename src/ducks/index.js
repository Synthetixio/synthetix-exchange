import { combineReducers } from 'redux';
import ui from './ui';
import wallet from './wallet';
import synths from './synths';
import transaction from './transaction';
import loans from './loans';
import rates from './rates';
import app from './app';
import markets from './markets';

export default combineReducers({
	app,
	wallet,
	ui,
	synths,
	transaction,
	loans,
	rates,
	markets,
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

export const getSynthSearch = state => {
	return state.ui.synthSearch;
};

// WALLET REDUCERS

export const getNetworkId = state => {
	return state.wallet.networkId;
};

export const getWalletInfo = state => {
	return state.wallet;
};

export const getTransactionSettings = state => {
	return {
		transactionSpeed: state.wallet.transactionSpeed,
		gasAndSpeedInfo: state.wallet.gasAndSpeedInfo,
	};
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
