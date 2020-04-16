import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import keyBy from 'lodash/keyBy';

import { synthWeight } from '../utils/synthOrdering';

import { SYNTHS_MAP, ASSETS_MAP, CurrencyKeys, CurrencyKey } from '../constants/currency';

import { RootState } from './types';

const FROZEN_SYNTHS = [SYNTHS_MAP.sMKR, SYNTHS_MAP.iMKR];

export interface SynthDefinition {
	name: CurrencyKey;
	asset: string;
	category: string;
	sign: string;
	desc: string;
	aggregator: string;
	inverted: boolean;
}

const sortSynths = (a: SynthDefinition, b: SynthDefinition) => {
	if (a.category === ASSETS_MAP.crypto && b.category === ASSETS_MAP.crypto) {
		// @ts-ignore
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

type SynthDefinitionMap = Record<string, SynthDefinition>;

export interface SynthsSliceState {
	availableSynths: SynthDefinitionMap;
	frozenSynths: CurrencyKeys;
	baseSynth: SynthDefinition;
	quoteSynth: SynthDefinition;
}

const initialState: SynthsSliceState = {
	availableSynths: {},
	frozenSynths: [],
	baseSynth: { name: DEFAULT_BASE_SYNTH, category: ASSETS_MAP.crypto } as SynthDefinition,
	quoteSynth: { name: DEFAULT_QUOTE_SYNTH, category: ASSETS_MAP.forex } as SynthDefinition,
};

export const synthsSlice = createSlice({
	name: 'synths',
	initialState,
	reducers: {
		setAvailableSynths: (state, action: PayloadAction<{ synths: SynthDefinition[] }>) => {
			const { synths } = action.payload;

			const filteredSynths = synths.filter(
				(synth: SynthDefinition) => !FROZEN_SYNTHS.includes(synth.name)
			);

			const availableSynths: SynthDefinitionMap = keyBy(filteredSynths, 'name');

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
		setSynthPair: (
			state,
			action: PayloadAction<{ baseCurrencyKey: CurrencyKey; quoteCurrencyKey: CurrencyKey }>
		) => {
			const { baseCurrencyKey, quoteCurrencyKey } = action.payload;

			state.baseSynth = state.availableSynths[baseCurrencyKey];
			state.quoteSynth = state.availableSynths[quoteCurrencyKey];
		},
		updateFrozenSynths: (state, action: PayloadAction<{ frozenSynths: CurrencyKeys }>) => {
			const { frozenSynths } = action.payload;

			frozenSynths.forEach((synth: CurrencyKey) => {
				delete state.availableSynths[synth];
			});

			state.frozenSynths = frozenSynths;
		},
	},
});

export const getSynthsState = (state: RootState) => state.synths;
export const getAvailableSynthsMap = (state: RootState) => getSynthsState(state).availableSynths;
export const getAvailableSynths = createSelector(getAvailableSynthsMap, (availableSynths) =>
	// @ts-ignore
	Object.values(availableSynths).sort(sortSynths)
);
export const getSynthPair = (state: RootState) => ({
	base: getSynthsState(state).baseSynth,
	quote: getSynthsState(state).quoteSynth,
});
export const getFrozenSynths = (state: RootState) => getSynthsState(state).frozenSynths;

export const { setAvailableSynths, setSynthPair, updateFrozenSynths } = synthsSlice.actions;

export default synthsSlice.reducer;
