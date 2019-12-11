const SET_AVAILABLE_SYNTHS = 'SYNTHS/SET_AVAILABLE_SYNTHS';
const SET_SYNTH_PAIR = 'SYNTHS/SET_SYNTH_PAIR';
const SET_EXCHANGE_RATES = 'SYNTHS/SET_EXCHANGE_RATES';
const SET_FROZEN_SYNTHS = 'SYNTHS/SET_FROZEN_SYNTHS';

const defaultState = {
	availableSynths: [],
	synthTypes: [],
	defaultSynth: null,
	frozenSynths: null,
	baseSynth: null,
	quoteSynth: null,
	exchangeRates: null,
	ethRate: null,
};

const sortSynths = (a, b) => {
	if (a.category === 'crypto') return -1;
	if (a.category === 'commodity' && !['crypto', 'commodity'].includes(b.category)) {
		return -1;
	}
	if (a.category === 'forex' && b.category === 'forex' && a.name === 'sUSD') {
		return -1;
	}
	return 0;
};

const reducer = (state = defaultState, action = {}) => {
	switch (action.type) {
		case SET_AVAILABLE_SYNTHS: {
			const baseSynth = action.payload.find(synth => synth.name === 'sBTC').name;
			const quoteSynth = action.payload.find(synth => synth.name === 'sUSD').name;
			const availableSynths = action.payload.sort(sortSynths);
			return { ...state, availableSynths: availableSynths, baseSynth, quoteSynth };
		}
		case SET_SYNTH_PAIR: {
			const { quote, base } = action.payload;
			return { ...state, baseSynth: base, quoteSynth: quote };
		}
		case SET_EXCHANGE_RATES: {
			const { synthRates, ethRate } = action.payload;
			return { ...state, exchangeRates: synthRates, ethRate };
		}
		case SET_FROZEN_SYNTHS: {
			return { ...state, frozenSynths: action.payload };
		}
		default:
			return state;
	}
};

export const setAvailableSynths = synths => {
	return { type: SET_AVAILABLE_SYNTHS, payload: synths };
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

export const updateExchangeRates = ({ synthRates, ethRate }) => {
	let rateObject = {};
	Object.keys(synthRates).forEach(synth => {
		rateObject[synth] = convertBaseSynth(synth, synthRates);
	});
	return {
		type: SET_EXCHANGE_RATES,
		payload: { synthRates: rateObject, ethRate },
	};
};

export default reducer;
