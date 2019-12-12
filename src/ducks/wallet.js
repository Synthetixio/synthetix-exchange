import { setSigner } from '../utils/snxJSConnector';
import { getAddress } from '../utils/formatters';

const UPDATE_WALLET_STATUS = 'WALLET/UPDATE_WALLET_STATUS';
const UPDATE_WALLET_PAGINATOR_INDEX = 'WALLET/UPDATE_WALLET_PAGINATOR_INDEX';
const SET_DERIVATION_PATH = 'WALLET/SET_DERIVATION_PATH';
const UPDATE_WALLET_BALANCES = 'WALLET/UPDATE_BALANCES';

const defaultState = {
	unlocked: false,
	walletPaginatorIndex: 0,
	availableWallets: [],
	currentWallet: null,
	derivationPath: localStorage.getItem('derivationPath'),
	balances: null,
};

// Reducer
const reducer = (state = defaultState, action = {}) => {
	switch (action.type) {
		case UPDATE_WALLET_STATUS: {
			return { ...state, ...action.payload };
		}
		case UPDATE_WALLET_PAGINATOR_INDEX: {
			return { ...state, walletPaginatorIndex: action.payload };
		}
		case SET_DERIVATION_PATH: {
			return {
				...state,
				derivationPath: action.payload,
				availableWallets: [],
				walletPaginatorIndex: 0,
			};
		}
		case UPDATE_WALLET_BALANCES: {
			return {
				...state,
				balances: action.payload,
			};
		}
		default:
			return state;
	}
};

// Actions
const setDerivationPath = path => {
	return {
		type: SET_DERIVATION_PATH,
		payload: path,
	};
};

export const derivationPathChange = (signerOptions, derivationPath) => {
	setSigner(signerOptions);
	localStorage.setItem('derivationPath', derivationPath);
	return setDerivationPath(derivationPath);
};

export const updateWalletStatus = walletStatus => {
	const payload = walletStatus.currentWallet
		? {
				...walletStatus,
				currentWallet: walletStatus.currentWallet ? getAddress(walletStatus.currentWallet) : null,
		  }
		: { ...walletStatus };
	return {
		type: UPDATE_WALLET_STATUS,
		payload,
	};
};

export const updateWalletPaginatorIndex = index => {
	return {
		type: UPDATE_WALLET_PAGINATOR_INDEX,
		payload: index,
	};
};

export const updateWalletBalances = ({ synths, eth, snx }) => {
	return {
		type: UPDATE_WALLET_BALANCES,
		payload: { synths, eth, snx },
	};
};

export default reducer;
