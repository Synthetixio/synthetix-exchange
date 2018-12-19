const CONNECT_WALLET = 'WALLET/CONNECT_WALLET';
const SET_SELECTED_WALLET = 'WALLET/SET_SELECTED_WALLET';
const SET_BALANCES = 'WALLET/SET_BALANCES';
const SET_TRANSACTION_STATUS_TO_CONFIRM =
  'WALLET/SET_TRANSACTION_STATUS_TO_CONFIRM';
const SET_TRANSACTION_STATUS_TO_PROGRESS =
  'WALLET/SET_TRANSACTION_STATUS_TO_PROGRESS';
const SET_TRANSACTION_PAIR = 'WALLET/SET_TRANSACTION_PAIR';
const SET_TRANSACTION_STATUS_TO_SUCCESS =
  'WALLET/SET_TRANSACTION_STATUS_TO_SUCCESS';
const SET_TRANSACTION_STATUS_TO_CLEARED =
  'WALLET/SET_TRANSACTION_STATUS_TO_CLEARED';
const SET_TRANSACTION_STATUS_TO_ERROR =
  'WALLET/SET_TRANSACTION_STATUS_TO_ERROR';

const defaultTransactionState = {
  transactionStatus: null,
  transactionErrorType: null,
  transactionHash: null,
  transactionPair: null,
};

const defaultState = {
  walletType: null,
  availableWallets: null,
  unlocked: false,
  selectedWallet: null,
  walletSelectorIndex: 0,
  networkId: 1,
  balances: null,
  ...defaultTransactionState,
};
const reducer = (state = defaultState, action = {}) => {
  switch (action.type) {
    case CONNECT_WALLET:
      return { ...state, ...action.payload };
    case SET_SELECTED_WALLET:
      const { availableWallets, selectedWallet } = action.payload;
      return { ...state, availableWallets, selectedWallet };
    case SET_BALANCES:
      return { ...state, balances: action.payload };
    case SET_TRANSACTION_STATUS_TO_CONFIRM:
      return {
        ...state,
        ...defaultTransactionState,
        transactionStatus: 'confirm',
      };
    case SET_TRANSACTION_STATUS_TO_PROGRESS:
      return {
        ...state,
        transactionStatus: 'progress',
        transactionHash: action.payload,
      };
    case SET_TRANSACTION_STATUS_TO_SUCCESS:
      return { ...state, transactionStatus: 'success' };
    case SET_TRANSACTION_STATUS_TO_CLEARED: {
      return {
        ...state,
        transactionHash: null,
        transactionPair: null,
        transactionStatus: 'cleared',
      };
    }
    case SET_TRANSACTION_STATUS_TO_ERROR:
      return {
        ...state,
        transactionStatus: 'error',
        transactionErrorType: action.payload,
      };
    case SET_TRANSACTION_PAIR:
      const { fromSynth, fromAmount, toSynth, toAmount } = action.payload;
      const transactionPair = { fromSynth, fromAmount, toSynth, toAmount };
      return { ...state, transactionPair };
    default:
      return state;
  }
};

export const connectToWallet = walletType => {
  return { type: CONNECT_WALLET, payload: walletType };
};

export const setSelectedWallet = ({ availableWallets, selectedWallet }) => {
  return {
    type: SET_SELECTED_WALLET,
    payload: { availableWallets, selectedWallet },
  };
};

export const setWalletBalances = balances => {
  return {
    type: SET_BALANCES,
    payload: balances,
  };
};

export const setTransactionStatusToConfirm = () => {
  return {
    type: SET_TRANSACTION_STATUS_TO_CONFIRM,
  };
};

export const setTransactionStatusToProgress = hash => {
  return {
    type: SET_TRANSACTION_STATUS_TO_PROGRESS,
    payload: hash,
  };
};

export const setTransactionStatusToSuccess = () => {
  return {
    type: SET_TRANSACTION_STATUS_TO_SUCCESS,
  };
};

export const setTransactionStatusToCleared = () => {
  return {
    type: SET_TRANSACTION_STATUS_TO_CLEARED,
  };
};

export const setTransactionStatusToError = errorType => {
  return {
    type: SET_TRANSACTION_STATUS_TO_ERROR,
    payload: errorType,
  };
};

export const setTransactionPair = transactionPair => {
  return {
    type: SET_TRANSACTION_PAIR,
    payload: transactionPair,
  };
};

export default reducer;
