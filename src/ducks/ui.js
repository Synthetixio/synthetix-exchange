const CHANGE_SCREEN = 'UI/CHANGE_SCREEN';
const TOGGLE_WALLET_SELECTOR_POPUP = 'UI/TOGGLE_WALLET_SELECTOR_POPUP';
const TOGGLE_TRANSACTION_STATUS_POPUP = 'UI/TOGGLE_TRANSACTION_STATUS_POPUP';
const TOGGLE_DEPOT_POPUP = 'UI/TOGGLE_DEPOT_POPUP';
const TOGGLE_FEEDBACK_POPUP = 'UI/TOGGLE_FEEDBACK_POPUP';
const TOGGLE_TESTNET_POPUP = 'UI/TOGGLE_TESTNET_POPUP';
const TOGGLE_WALKTHROUGH_POPUP = 'UI/TOGGLE_WALKTHROUGH_POPUP';
const TOGGLE_LOADING_SCREEN = 'UI/TOGGLE_LOADING_SCREEN';

const defaultState = {
  currentScreen: 'exchange',
  walletSelectorPopupIsVisible: false,
  transactionStatusPopupIsVisible: false,
  depotPopupIsVisible: false,
  walkthroughPopupIsVisible: false,
  feedbackPopupIsVisible: false,
  testnetPopupIsVisible: false,
  loadingScreenIsVisible: false,
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
    case TOGGLE_TESTNET_POPUP:
      return {
        ...state,
        testnetPopupIsVisible: action.payload,
      };
    case TOGGLE_DEPOT_POPUP:
      return {
        ...state,
        depotPopupIsVisible: action.payload,
      };
    case TOGGLE_FEEDBACK_POPUP:
      return {
        ...state,
        feedbackPopupIsVisible: action.payload,
      };
    case TOGGLE_WALKTHROUGH_POPUP:
      return {
        ...state,
        walkthroughPopupIsVisible: action.payload,
      };
    case TOGGLE_LOADING_SCREEN:
      return {
        ...state,
        loadingScreenIsVisible: action.payload,
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

export const toggleTestnetPopup = isVisible => {
  return { type: TOGGLE_TESTNET_POPUP, payload: isVisible };
};

export const toggleLoadingScreen = isVisible => {
  return { type: TOGGLE_LOADING_SCREEN, payload: isVisible };
};

export const toggleDepotPopup = isVisible => {
  return { type: TOGGLE_DEPOT_POPUP, payload: isVisible };
};

export const toggleFeedbackPopup = isVisible => {
  return { type: TOGGLE_FEEDBACK_POPUP, payload: isVisible };
};

export const toggleWalkthroughPopup = isVisible => {
  return { type: TOGGLE_WALKTHROUGH_POPUP, payload: isVisible };
};

export default reducer;
