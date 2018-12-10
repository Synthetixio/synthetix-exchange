import { combineReducers } from 'redux';
import ui from './ui';
import wallet from './wallet';

export default combineReducers({
  wallet,
  ui,
});

export const getCurrentScreen = state => {
  return state.ui.currentScreen;
};

export const walletSelectorPopupIsVisible = state => {
  return state.ui.walletSelectorPopupIsVisible;
};

export const getCurrentWalletType = state => {
  return state.wallet.walletType;
};
