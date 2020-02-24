import { setSigner } from '../utils/snxJSConnector';
import { getAddress } from '../utils/formatters';
import { defaultNetwork } from '../utils/networkUtils';

const UPDATE_WALLET_STATUS = 'WALLET/UPDATE_WALLET_STATUS';
const RESET_WALLET_STATUS = 'WALLET/RESET_WALLET_STATUS';
const UPDATE_WALLET_PAGINATOR_INDEX = 'WALLET/UPDATE_WALLET_PAGINATOR_INDEX';
const SET_DERIVATION_PATH = 'WALLET/SET_DERIVATION_PATH';
const UPDATE_WALLET_BALANCES = 'WALLET/UPDATE_BALANCES';

const FETCH_WALLET_BALANCES_REQUEST = 'WALLET/FETCH_WALLET_BALANCES_REQUEST';
const FETCH_WALLET_BALANCES_SUCCESS = 'WALLET/FETCH_WALLET_BALANCES_SUCCESS';
const FETCH_WALLET_BALANCES_FAILURE = 'WALLET/FETCH_WALLET_BALANCES_FAILURE';

import { getWalletBalances } from '../dataFetcher';
import { getWalletInfo, getAvailableSynths } from './index';

const defaultState = {
	unlocked: false,
	unlockError: null,
	walletPaginatorIndex: 0,
	availableWallets: [],
	currentWallet: null,
	derivationPath: localStorage.getItem('derivationPath'),
	balances: null,
	networkId: defaultNetwork.networkId,
	networkName: defaultNetwork.networkName,
	isFetchingWalletBalances: false,
};

// Reducer
const reducer = (state = defaultState, action = {}) => {
	switch (action.type) {
		case RESET_WALLET_STATUS: {
			return defaultState;
		}
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
		case FETCH_WALLET_BALANCES_REQUEST: {
			return {
				...state,
				isFetchingWalletBalances: true,
			};
		}
		case FETCH_WALLET_BALANCES_SUCCESS: {
			return {
				...state,
				isFetchingWalletBalances: false,
			};
		}
		case FETCH_WALLET_BALANCES_FAILURE: {
			return {
				...state,
				isFetchingWalletBalances: false,
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

export const resetWalletStatus = () => {
	return {
		type: RESET_WALLET_STATUS,
	};
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

export const updateWalletBalances = ({ synths, eth }) => {
	return {
		type: UPDATE_WALLET_BALANCES,
		payload: { synths, eth },
	};
};

export const fetchWalletBalancesRequest = () => ({
	type: FETCH_WALLET_BALANCES_REQUEST,
});

export const fetchWalletBalancesSuccess = () => ({
	type: FETCH_WALLET_BALANCES_SUCCESS,
});

export const fetchWalletBalancesFailure = () => ({
	type: FETCH_WALLET_BALANCES_FAILURE,
});

export const fetchWalletBalances = () => async (dispatch, getState) => {
	const state = getState();
	const walletInfo = getWalletInfo(state);
	const synths = getAvailableSynths(state);

	const currentWallet = walletInfo.currentWallet;

	if (currentWallet != null) {
		dispatch(fetchWalletBalancesRequest());
		try {
			const balances = await getWalletBalances(currentWallet, synths);

			dispatch(updateWalletBalances(balances));
			dispatch(fetchWalletBalancesSuccess());

			return true;
		} catch (e) {
			dispatch(fetchWalletBalancesFailure());

			return false;
		}
	}
	return false;
};

export default reducer;
