import { synthWeight } from '../utils/synthOrdering';
const SET_AVAILABLE_SYNTHS = 'SYNTHS/SET_AVAILABLE_SYNTHS';
const SET_SYNTH_PAIR = 'SYNTHS/SET_SYNTH_PAIR';
const SET_EXCHANGE_RATES = 'SYNTHS/SET_EXCHANGE_RATES';
const SET_FROZEN_SYNTHS = 'SYNTHS/SET_FROZEN_SYNTHS';

const defaultState = {
	availableSynths: [],
	synthsSigns: {},
	synthTypes: [],
	topSynthByVolume: [],
	defaultSynth: null,
	frozenSynths: null,
	exchangeRates: null,
	ethRate: null,
	baseSynth: { name: 'sBTC', category: 'crypto' },
	quoteSynth: { name: 'sUSD', category: 'forex' },
};

const FROZEN_SYNTHS = ['sMKR', 'iMKR'];

const sortSynths = (a, b) => {
	if (a.category === 'crypto' && b.category === 'crypto') {
		const nameOrder = synthWeight[a.name.slice(1)] - synthWeight[b.name.slice(1)];
		if (!a.inverted && b.inverted) {
			return nameOrder - 1;
		} else if ((a.inverted && b.inverted) || (!a.inverted && !b.inverted)) {
			return nameOrder;
		} else return 0;
	}
	if (a.category === 'crypto' && b.category !== 'crypto') {
		return -1;
	}
};

const reducer = (state = defaultState, action = {}) => {
	switch (action.type) {
		case SET_AVAILABLE_SYNTHS: {
			const baseSynth = action.payload.find(synth => synth.name === 'sBTC');
			const quoteSynth = action.payload.find(synth => synth.name === 'sUSD');
			const availableSynths = action.payload.sort(sortSynths);
			const signs = {};
			availableSynths.forEach(synth => {
				signs[synth.name] = synth.sign;
			});
			return {
				...state,
				availableSynths: availableSynths,
				baseSynth,
				quoteSynth,
				synthsSigns: signs,
			};
		}
		case SET_SYNTH_PAIR: {
			const { quote, base } = action.payload;
			return { ...state, baseSynth: base, quoteSynth: quote };
		}
		case SET_EXCHANGE_RATES: {
			const { synthsRates, ethRate } = action.payload;
			return { ...state, exchangeRates: synthsRates, ethRate };
		}
		case SET_FROZEN_SYNTHS: {
			const frozenSynths = action.payload;
			return {
				...state,
				frozenSynths: action.payload,
				availableSynths: state.availableSynths.filter(synth => !frozenSynths[synth.name]),
			};
		}
		default:
			return state;
	}
};

export const setAvailableSynths = synths => {
	return {
		type: SET_AVAILABLE_SYNTHS,
		payload: synths.filter(synth => !FROZEN_SYNTHS.includes(synth.name)),
	};
};

export const setSynthPair = pair => {
	return { type: SET_SYNTH_PAIR, payload: pair };
};

export const updateFrozenSynths = synths => {
	return { type: SET_FROZEN_SYNTHS, payload: synths };
};

const convertBaseSynth = (synth, rates) => {
	let convertedRates = {};
	Object.keys(rates).forEach(r => {
		const conversion = rates[synth] * (1 / rates[r]);
		convertedRates[r] = conversion;
	});
	return convertedRates;
};

export const updateExchangeRates = ({ synthsRates, ethRate }) => {
	let rateObject = {};
	Object.keys(synthsRates).forEach(synth => {
		rateObject[synth] = convertBaseSynth(synth, synthsRates);
	});
	return {
		type: SET_EXCHANGE_RATES,
		payload: { synthsRates: rateObject, ethRate },
	};
};

export default reducer;
