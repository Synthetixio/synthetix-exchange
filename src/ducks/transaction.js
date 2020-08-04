import { DEFAULT_GAS_LIMIT } from '../constants/transaction';

import { normalizeGasLimit } from '../utils/transactions';

import { TRANSACTION_STATUS } from 'constants/transaction';

const SET_GAS_PRICE = 'TRANSACTION/SET_GAS_PRICE';
const SET_GAS_LIMIT = 'TRANSACTION/SET_GAS_LIMIT';
const SET_NETWORK_GAS_INFO = 'TRANSACTION/NETWORK_GAS_INFO';
const CREATE_TRANSACTION = 'TRANSACTION/CREATE';
const UPDATE_TRANSACTION = 'TRANSACTION/UPDATE';
const REMOVE_TRANSACTION = 'TRANSACTION/REMOVE';
const ADD_PENDING_TRANSACTION = 'TRANSACTION/ADD_PENDING_TRANSACTION';
const REMOVE_PENDING_TRANSACTION = 'TRANSACTION/REMOVE_PENDING_TRANSACTION';

const defaultState = {
	gasPrice: null,
	gasLimit: DEFAULT_GAS_LIMIT,
	gasSpeed: {},
	transactions: [],
	pendingTransactions: [],
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
		case CREATE_TRANSACTION: {
			return {
				...state,
				transactions: [...state.transactions, action.payload],
			};
		}
		case UPDATE_TRANSACTION: {
			const { updates, id, hash } = action.payload;
			const storeUpdates = {
				transactions: state.transactions.map((tx) => {
					if (tx.id === id || tx.hash === hash) {
						return {
							...tx,
							...updates,
						};
					}
					return tx;
				}),
			};
			if (updates.status === TRANSACTION_STATUS.PENDING && updates.hash) {
				storeUpdates.pendingTransactions = [...state.pendingTransactions, updates.hash];
			}
			return {
				...state,
				...storeUpdates,
			};
		}
		case ADD_PENDING_TRANSACTION: {
			const hash = action.payload;
			if (state.pendingTransactions.find((tx) => tx.hash === hash)) return state;
			return {
				...state,
				pendingTransactions: [...state.pendingTransactions, hash],
			};
		}
		case REMOVE_PENDING_TRANSACTION: {
			const hash = action.payload;
			return {
				...state,
				pendingTransactions: state.pendingTransactions.filter((txHash) => txHash !== hash),
			};
		}

		case REMOVE_TRANSACTION: {
			const hash = action.payload;
			return {
				...state,
				transactions: state.transactions.filter((txHash) => txHash !== hash),
			};
		}

		default:
			return state;
	}
};

export const setGasPrice = (gasPrice) => {
	return {
		type: SET_GAS_PRICE,
		payload: gasPrice,
	};
};

export const setGasLimit = (gasLimit) => {
	return {
		type: SET_GAS_LIMIT,
		payload: normalizeGasLimit(gasLimit),
	};
};

export const setNetworkGasInfo = (gasInfo) => {
	return {
		type: SET_NETWORK_GAS_INFO,
		payload: gasInfo,
	};
};

export const createTransaction = (transaction) => {
	return {
		type: CREATE_TRANSACTION,
		payload: transaction,
	};
};

export const removePendingTransaction = (hash) => {
	return {
		type: REMOVE_PENDING_TRANSACTION,
		payload: hash,
	};
};

export const updateTransaction = (updates, id, hash = null) => {
	return {
		type: UPDATE_TRANSACTION,
		payload: { updates, id, hash },
	};
};

export const removeTransaction = (hash) => {
	return {
		type: REMOVE_TRANSACTION,
		payload: hash,
	};
};

export const getTransactionState = (state) => state.transaction;
export const getGasInfo = (state) => {
	const { gasPrice, gasLimit, gasSpeed } = getTransactionState(state);
	return { gasPrice, gasLimit, gasSpeed };
};
export const getTransactions = (state) => getTransactionState(state).transactions;
export const getPendingTransactions = (state) => getTransactionState(state).pendingTransactions;

export default reducer;
