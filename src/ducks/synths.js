import availableSynths from '../synthsList';
const SET_AVAILABLE_SYNTHS = 'SYNTHS/SET_AVAILABLE_SYNTHS';

const defaultState = {
  availableSynths,
  defaultSynth: null,
};
const reducer = (state = defaultState, action = {}) => {
  switch (action.type) {
    case SET_AVAILABLE_SYNTHS:
      return { ...state, availableSynths: action.payload };
    default:
      return state;
  }
};

export const setAvailableSynths = synths => {
  return { type: SET_AVAILABLE_SYNTHS, payload: synths };
};

export default reducer;
