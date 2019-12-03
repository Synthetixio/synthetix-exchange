import { persistState, getPersistedState } from '../config/store';

const CHANGE_SCREEN = 'UI/CHANGE_SCREEN';
const TOGGLE_WALLET_POPUP = 'UI/TOGGLE_WALLET_SELECTOR_POPUP';
const TOGGLE_DEPOT_POPUP = 'UI/TOGGLE_DEPOT_POPUP';
const TOGGLE_THEME = 'UI/TOGGLE_THEME';

const persistedState = getPersistedState('ui');
const defaultState = Object.assign(
	{
		theme: 'light',
		walletPopupIsVisible: false,
		depotPopupIsVisible: false,
	},
	persistedState
);
const reducer = (state = defaultState, action = {}) => {
	switch (action.type) {
		case CHANGE_SCREEN:
			return {
				...state,
				currentScreen: action.payload,
				walletPopupIsVisible: false,
			};
		case TOGGLE_WALLET_POPUP:
			return {
				...state,
				walletPopupIsVisible: action.payload,
			};
		case TOGGLE_DEPOT_POPUP:
			return {
				...state,
				depotPopupIsVisible: action.payload,
			};
		case TOGGLE_THEME: {
			const theme = state.theme === 'light' ? 'dark' : 'light';
			persistState('ui', { theme });
			return {
				...state,
				theme,
			};
		}
		default:
			return state;
	}
};

export const changeScreen = screen => {
	return { type: CHANGE_SCREEN, payload: screen };
};

export const toggleWalletPopup = isVisible => {
	return { type: TOGGLE_WALLET_POPUP, payload: isVisible };
};

export const toggleTheme = () => {
	return { type: TOGGLE_THEME };
};

export default reducer;
