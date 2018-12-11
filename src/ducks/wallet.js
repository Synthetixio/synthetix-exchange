const CONNECT_WALLET = 'WALLET/CONNECT_WALLET';
const SET_SELECTED_WALLET = 'WALLET/SET_SELECTED_WALLET';

const defaultState = {
  walletType: null,
  availableWallets: null,
  unlocked: false,
  selectedWallet: null,
  walletSelectorIndex: 0,
  networkId: 1,
};
const reducer = (state = defaultState, action = {}) => {
  switch (action.type) {
    case CONNECT_WALLET:
      return { ...state, ...action.payload };
    case SET_SELECTED_WALLET:
      const { availableWallets, selectedWallet } = action.payload;
      return { ...state, availableWallets, selectedWallet };
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

export default reducer;
