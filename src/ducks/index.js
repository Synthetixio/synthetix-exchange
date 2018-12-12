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
export const getCurrentScreen = state => {
  return state.ui.currentScreen;
};

export const walletSelectorPopupIsVisible = state => {
  return state.ui.walletSelectorPopupIsVisible;
};

// WALLET REDUCERS
export const getCurrentWalletInfo = state => {
  return state.wallet;
};

// SYNTHS REDUCERS
export const getAvailableSynths = state => {
  return state.synths.availableSynths;
};

export const getSynthToBuy = state => {
  return state.synths.toSynth;
};

export const getSynthToExchange = state => {
  return state.synths.fromSynth;
};
