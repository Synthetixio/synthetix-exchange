import { createSlice, createSelector } from '@reduxjs/toolkit';
import keyBy from 'lodash/keyBy';

import { synthWeight } from '../utils/synthOrdering';

import { SYNTHS_MAP, ASSETS_MAP } from '../constants/currency';

const FROZEN_SYNTHS = [SYNTHS_MAP.sMKR, SYNTHS_MAP.iMKR];

const sortSynths = (a, b) => {
	if (a.category === ASSETS_MAP.crypto && b.category === ASSETS_MAP.crypto) {
		const nameOrder = synthWeight[a.name.slice(1)] - synthWeight[b.name.slice(1)];
		if (!a.inverted && b.inverted) {
			return nameOrder - 1;
		} else if ((a.inverted && b.inverted) || (!a.inverted && !b.inverted)) {
			return nameOrder;
		} else return 0;
	}
	if (a.category === ASSETS_MAP.crypto && b.category !== ASSETS_MAP.crypto) {
		return -1;
	}
};

const DEFAULT_BASE_SYNTH = SYNTHS_MAP.sBTC;
const DEFAULT_QUOTE_SYNTH = SYNTHS_MAP.sUSD;

export const synthsSlice = createSlice({
	name: 'synths',
	initialState: {
		availableSynths: {},
		frozenSynths: {},
		baseSynth: { name: DEFAULT_BASE_SYNTH, category: ASSETS_MAP.crypto },
		quoteSynth: { name: DEFAULT_QUOTE_SYNTH, category: ASSETS_MAP.forex },
	},
	reducers: {
		setAvailableSynths: (state, action) => {
			const { synths } = action.payload;

			const filteredSynths = synths.filter(synth => !FROZEN_SYNTHS.includes(synth.name));

			const availableSynths = keyBy(filteredSynths, 'name');

			const baseSynth = availableSynths[DEFAULT_BASE_SYNTH];
			const quoteSynth = availableSynths[DEFAULT_QUOTE_SYNTH];

			if (baseSynth) {
				state.baseSynth = baseSynth;
			}
			if (quoteSynth) {
				state.quoteSynth = quoteSynth;
			}

			state.availableSynths = availableSynths;
		},
		setSynthPair: (state, action) => {
			const { baseCurrencyKey, quoteCurrencyKey } = action.payload;

			state.baseSynth = state.availableSynths[baseCurrencyKey];
			state.quoteSynth = state.availableSynths[quoteCurrencyKey];
		},
		updateFrozenSynths: (state, action) => {
			const { frozenSynths } = action.payload;

			Object.values(state.availableSynths).forEach(synth => {
				state.availableSynths[synth.name].isFrozen = frozenSynths.includes(synth.name);
			});

			state.frozenSynths = frozenSynths;
		},
	},
});

export const getSynthsState = state => state.synths;
export const getAvailableSynthsMap = state => getSynthsState(state).availableSynths;
export const getAvailableSynths = createSelector(getAvailableSynthsMap, availableSynths =>
	Object.values(availableSynths).sort(sortSynths)
);
export const getSynthPair = state => ({
	base: getSynthsState(state).baseSynth,
	quote: getSynthsState(state).quoteSynth,
});
export const getFrozenSynths = state => getSynthsState(state).frozenSynths;

const { setAvailableSynths, setSynthPair, updateFrozenSynths } = synthsSlice.actions;

export default synthsSlice.reducer;

export { setAvailableSynths, setSynthPair, updateFrozenSynths };
