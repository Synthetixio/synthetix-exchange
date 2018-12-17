const CHANGE_SCREEN = 'UI/CHANGE_SCREEN';
const TOGGLE_WALLET_SELECTOR_POPUP = 'UI/TOGGLE_WALLET_SELECTOR_POPUP';
const TOGGLE_TRANSACTION_STATUS_POPUP = 'UI/TOGGLE_TRANSACTION_STATUS_POPUP';

const defaultState = {
  currentScreen: 'exchange',
  walletSelectorPopupIsVisible: false,
  transactionStatusPopupIsVisible: false,
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
    case TOGGLE_TRANSACTION_STATUS_POPUP:
      return {
        ...state,
        transactionStatusPopupIsVisible: action.payload,
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

export const toggleTransactionStatusPopup = isVisible => {
  return { type: TOGGLE_TRANSACTION_STATUS_POPUP, payload: isVisible };
};

export default reducer;
