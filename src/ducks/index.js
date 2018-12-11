import { combineReducers } from 'redux';
import ui from './ui';
import wallet from './wallet';
import synths from './synths';

export default combineReducers({
  wallet,
  ui,
  synths,
});

export const getCurrentScreen = state => {
  return state.ui.currentScreen;
};

export const walletSelectorPopupIsVisible = state => {
  return state.ui.walletSelectorPopupIsVisible;
};

export const getCurrentWalletInfo = state => {
  return state.wallet;
};

export const getAvailableSynths = state => {
  return state.synths.availableSynths;
};
