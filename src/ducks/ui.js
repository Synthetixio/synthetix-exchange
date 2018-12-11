const CHANGE_SCREEN = 'UI/CHANGE_SCREEN';
const TOGGLE_WALLET_SELECTOR_POPUP = 'UI/TOGGLE_WALLET_SELECTOR_POPUP';

const defaultState = {
  currentScreen: 'exchange',
  walletSelectorPopupIsVisible: false,
};
const reducer = (state = defaultState, action = {}) => {
  switch (action.type) {
    case CHANGE_SCREEN:
      return {
        ...state,
        currentScreen: action.payload,
        walletSelectorPopupIsVisible: false,
      };
    case TOGGLE_WALLET_SELECTOR_POPUP:
      return {
        ...state,
        walletSelectorPopupIsVisible: action.payload,
      };
    default:
      return state;
  }
};

export const changeScreen = screen => {
  return { type: CHANGE_SCREEN, payload: screen };
};

export const toggleWalletSelectorPopup = isVisible => {
  return { type: TOGGLE_WALLET_SELECTOR_POPUP, payload: isVisible };
};

export default reducer;
