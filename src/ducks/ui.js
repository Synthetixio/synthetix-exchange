const CHANGE_SCREEN = 'UI/CHANGE_SCREEN';

const defaultState = {
  currentScreen: 'exchange',
};
const reducer = (state = defaultState, action = {}) => {
  switch (action.type) {
    case CHANGE_SCREEN:
      return { ...state, currentScreen: action.payload };
    default:
      return state;
  }
};

export const changeScreen = screen => {
  return { type: CHANGE_SCREEN, payload: screen };
};

export default reducer;
