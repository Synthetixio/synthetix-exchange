import availableSynths from '../synthsList';

const SET_AVAILABLE_SYNTHS = 'SYNTHS/SET_AVAILABLE_SYNTHS';
const SET_SYNTH_TO_BUY = 'SYNTHS/SET_SYNTH_TO_BUY';
const SET_SYNTH_TO_EXCHANGE = 'SYNTHS/SET_SYNTH_TO_EXCHANGE';
const SET_EXCHANGE_RATES = 'SYNTHS/SET_EXCHANGE_RATES';

const defaultState = {
  availableSynths,
  defaultSynth: null,
  fromSynth: 'sUSD',
  toSynth: 'sAUD',
  exchangeRates: null,
  ethRate: null,
};
const reducer = (state = defaultState, action = {}) => {
  switch (action.type) {
    case SET_AVAILABLE_SYNTHS: {
      return { ...state, availableSynths: action.payload };
    }
    case SET_SYNTH_TO_EXCHANGE: {
      let updateObject = {};
      updateObject['fromSynth'] = action.payload;
      if (state.toSynth === action.payload) {
        const filteredSynths = availableSynths.filter(
          synth => synth !== action.payload
        );
        updateObject['toSynth'] = filteredSynths[0];
      }
      return { ...state, ...updateObject };
    }
    case SET_SYNTH_TO_BUY: {
      return { ...state, toSynth: action.payload };
    }
    case SET_EXCHANGE_RATES: {
      const { synthRates, ethRate } = action.payload;
      return { ...state, exchangeRates: synthRates, ethRate };
    }
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

export const setSynthToExchange = synth => {
  return { type: SET_SYNTH_TO_EXCHANGE, payload: synth };
};

const convertFromSynth = (synth, rates) => {
  let convertedRates = [];
  Object.keys(rates).forEach(r => {
    const conversion = rates[synth] * (1 / rates[r]);
    convertedRates.push({ synth: r, rate: conversion });
  });
  return convertedRates;
};

export const updateExchangeRates = (synthRates, ethRate) => {
  let rateObject = {};
  Object.keys(synthRates).forEach(synth => {
    rateObject[synth] = convertFromSynth(synth, synthRates);
  });
  return {
    type: SET_EXCHANGE_RATES,
    payload: { synthRates: rateObject, ethRate },
  };
};

export default reducer;
