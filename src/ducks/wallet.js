const CONNECT_WALLET = 'WALLET/CONNECT_WALLET';

const defaultState = {
  walletType: null,
};
const reducer = (state = defaultState, action = {}) => {
  switch (action.type) {
    case CONNECT_WALLET:
      return { ...state, walletType: action.payload };
    default:
      return state;
  }
};

export const connectWallet = walletType => {
  return { type: CONNECT_WALLET, payload: walletType };
};

export default reducer;
