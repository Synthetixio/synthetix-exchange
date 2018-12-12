import availableSynths from '../synthsList';

const SET_AVAILABLE_SYNTHS = 'SYNTHS/SET_AVAILABLE_SYNTHS';
const SET_SYNTH_TO_BUY = 'SYNTHS/SET_SYNTH_TO_BUY';

const defaultState = {
  availableSynths,
  defaultSynth: null,
  synthToBuy: null,
};
const reducer = (state = defaultState, action = {}) => {
  switch (action.type) {
    case SET_AVAILABLE_SYNTHS:
      return { ...state, availableSynths: action.payload };
    case SET_SYNTH_TO_BUY:
      return { ...state, synthToBuy: action.payload };
    default:
      return state;
  }
};

export const setAvailableSynths = synths => {
  return { type: SET_AVAILABLE_SYNTHS, payload: synths };
};

export const setSynthToBuy = synth => {
  return { type: SET_SYNTH_TO_BUY, payload: synth };
};

export default reducer;
