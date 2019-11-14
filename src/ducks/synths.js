const SET_AVAILABLE_SYNTHS = 'SYNTHS/SET_AVAILABLE_SYNTHS';
const SET_SYNTH_TO_BUY = 'SYNTHS/SET_SYNTH_TO_BUY';
const SET_SYNTH_TO_EXCHANGE = 'SYNTHS/SET_SYNTH_TO_EXCHANGE';
const SET_EXCHANGE_RATES = 'SYNTHS/SET_EXCHANGE_RATES';
const SET_FROZEN_SYNTHS = 'SYNTHS/SET_FROZEN_SYNTHS';

const defaultState = {
	availableSynths: [],
	synthTypes: [],
	defaultSynth: null,
	frozenSynths: null,
	fromSynth: null,
	toSynth: null,
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
			const fromSynth = action.payload.find(synth => synth.name === 'sUSD');
			const toSynth = action.payload.find(synth => synth.name === 'sBTC');
			const availableSynths = action.payload.sort(sortSynths);
			return { ...state, availableSynths: availableSynths, fromSynth, toSynth };
		}
		case SET_SYNTH_TO_EXCHANGE: {
			const { availableSynths } = state;
			let updateObject = {};
			updateObject['fromSynth'] = action.payload;
			if (state.toSynth === action.payload) {
				const filteredSynths = availableSynths.filter(synth => synth !== action.payload);
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

export const setSynthToBuy = synth => {
	return { type: SET_SYNTH_TO_BUY, payload: synth };
};

export const setSynthToExchange = synth => {
	return { type: SET_SYNTH_TO_EXCHANGE, payload: synth };
};

export const updateFrozenSynths = synths => {
	return { type: SET_FROZEN_SYNTHS, payload: synths };
};

const convertFromSynth = (synth, rates) => {
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
		rateObject[synth] = convertFromSynth(synth, synthRates);
	});
	return {
		type: SET_EXCHANGE_RATES,
		payload: { synthRates: rateObject, ethRate },
	};
};

export default reducer;
