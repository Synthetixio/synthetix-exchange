// import { DEFAULT_GAS_LIMIT, GWEI } from '../utils/ethUtils';

// const SET_TRANSACTION_STATUS_TO_CONFIRM = 'WALLET/SET_TRANSACTION_STATUS_TO_CONFIRM';
// const SET_TRANSACTION_STATUS_TO_PROGRESS = 'WALLET/SET_TRANSACTION_STATUS_TO_PROGRESS';
// const SET_TRANSACTION_PAIR = 'WALLET/SET_TRANSACTION_PAIR';
// const SET_TRANSACTION_STATUS_TO_SUCCESS = 'WALLET/SET_TRANSACTION_STATUS_TO_SUCCESS';
// const SET_TRANSACTION_STATUS_TO_CLEARED = 'WALLET/SET_TRANSACTION_STATUS_TO_CLEARED';
// const SET_TRANSACTION_STATUS_TO_ERROR = 'WALLET/SET_TRANSACTION_STATUS_TO_ERROR';
// const UPDATE_GAS_AND_SPEED_INFO = 'WALLET/UPDATE_GAS_AND_SPEED_INFO';
// const SET_TRANSACTION_SPEED = 'WALLET/SET_TRANSACTION_SPEED';
// const UPDATE_EXCHANGE_FEE_RATE = 'WALLET/UPDATE_EXCHANGE_FEE_RATE';

// const defaultTransactionState = {
// 	transactionStatus: null,
// 	transactionErrorType: null,
// 	transactionHash: null,
// 	transactionPair: null,
// };

const SET_GAS_PRICE = 'TRANSACTION/SET_GAS_PRICE';
const SET_GAS_LIMIT = 'TRANSACTION/SET_GAS_LIMIT';
const SET_EXCHANGE_FEE_RATE = 'TRANSACTION/SET_FEE_RATE';
const SET_NETWORK_GAS_INFO = 'TRANSACTION/NETWORK_GAS_INFO';

const GAS_LIMIT_BUFFER = 5000;
const DEFAULT_GAS_LIMIT = 300000;

const defaultState = {
	gasPrice: null,
	gasLimit: DEFAULT_GAS_LIMIT,
	gasSpeed: {},
	// transactionSpeed: 'averageAllowed',
	// gasAndSpeedInfo: null\
	// gasPriceUsd: null,
	// exchangeFeeRate: null,
	// ...defaultTransactionState,
};

const reducer = (state = defaultState, action = {}) => {
	switch (action.type) {
		case SET_GAS_PRICE: {
			return {
				...state,
				gasPrice: action.payload,
			};
		}
		case SET_GAS_LIMIT: {
			return {
				...state,
				gasLimit: action.payload,
			};
		}
		case SET_EXCHANGE_FEE_RATE: {
			return {
				...state,
				exchangeFeeRate: action.payload,
			};
		}
		case SET_NETWORK_GAS_INFO: {
			const gasSpeed = action.payload;
			const currentGasPrice = state.gasPrice || gasSpeed['slowAllowed'];
			return {
				...state,
				gasSpeed,
				gasPrice:
					currentGasPrice > gasSpeed['fastestAllowed']
						? gasSpeed['fastestAllowed']
						: currentGasPrice,
			};
		}
		// case SET_TRANSACTION_STATUS_TO_CONFIRM: {
		// 	return {
		// 		...state,
		// 		...defaultTransactionState,
		// 		transactionStatus: 'confirm',
		// 	};
		// }
		// case SET_TRANSACTION_STATUS_TO_PROGRESS: {
		// 	return {
		// 		...state,
		// 		transactionStatus: 'progress',
		// 		transactionHash: action.payload,
		// 	};
		// }
		// case SET_TRANSACTION_STATUS_TO_SUCCESS: {
		// 	return { ...state, transactionStatus: 'success' };
		// }
		// case SET_TRANSACTION_STATUS_TO_CLEARED: {
		// 	return {
		// 		...state,
		// 		transactionHash: null,
		// 		transactionPair: null,
		// 		transactionStatus: 'cleared',
		// 	};
		// }
		// case SET_TRANSACTION_STATUS_TO_ERROR: {
		// 	return {
		// 		...state,
		// 		transactionStatus: 'error',
		// 		transactionErrorType: action.payload,
		// 	};
		// }
		// case SET_TRANSACTION_PAIR: {
		// 	const { fromSynth, fromAmount, toSynth, toAmount } = action.payload;
		// 	const transactionPair = { fromSynth, fromAmount, toSynth, toAmount };
		// 	return { ...state, transactionPair };
		// }

		// case SET_TRANSACTION_SPEED: {
		// 	const gasAndSpeedInfo = state.gasAndSpeedInfo;
		// 	const transactionSpeed = action.payload;
		// 	return {
		// 		...state,
		// 		transactionSpeed,
		// 		gasPrice: gasAndSpeedInfo[transactionSpeed].gwei * GWEI,
		// 		gasPriceUsd: gasAndSpeedInfo[transactionSpeed].price,
		// 	};
		// }

		default:
			return state;
	}
};

export const setGasPrice = gasPrice => {
	return {
		type: SET_GAS_PRICE,
		payload: gasPrice,
	};
};

export const setGasLimit = gasLimit => {
	return {
		type: SET_GAS_LIMIT,
		payload: gasLimit + GAS_LIMIT_BUFFER,
	};
};

export const setExchangeFeeRate = feeRate => {
	return {
		type: SET_EXCHANGE_FEE_RATE,
		payload: feeRate,
	};
};

export const setNetworkGasInfo = gasInfo => {
	return {
		type: SET_NETWORK_GAS_INFO,
		payload: gasInfo,
	};
};

// export const setTransactionStatusToConfirm = () => {
// 	return {
// 		type: SET_TRANSACTION_STATUS_TO_CONFIRM,
// 	};
// };

// export const setTransactionStatusToProgress = hash => {
// 	return {
// 		type: SET_TRANSACTION_STATUS_TO_PROGRESS,
// 		payload: hash,
// 	};
// };

// export const setTransactionStatusToSuccess = () => {
// 	return {
// 		type: SET_TRANSACTION_STATUS_TO_SUCCESS,
// 	};
// };

// export const setTransactionStatusToCleared = () => {
// 	return {
// 		type: SET_TRANSACTION_STATUS_TO_CLEARED,
// 	};
// };

// export const setTransactionStatusToError = errorType => {
// 	return {
// 		type: SET_TRANSACTION_STATUS_TO_ERROR,
// 		payload: errorType,
// 	};
// };

// export const setTransactionPair = transactionPair => {
// 	return {
// 		type: SET_TRANSACTION_PAIR,
// 		payload: transactionPair,
// 	};
// };

// export const updateExchangeFeeRate = exchangeFeeRate => {
// 	return {
// 		type: UPDATE_EXCHANGE_FEE_RATE,
// 		payload: exchangeFeeRate,
// 	};
// };

// export const setTransactionSpeed = speed => {
// 	return {
// 		type: SET_TRANSACTION_SPEED,
// 		payload: speed,
// 	};
// };

export default reducer;
