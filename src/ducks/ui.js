import { createSlice } from '@reduxjs/toolkit';
import { persistState, getPersistedState } from '../config/store';
import { isLightTheme, THEMES } from '../styles/theme';
import { FIAT_CURRENCY_MAP } from 'src/constants/currency';

const userPrefersDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

const initialState = {
	theme: userPrefersDarkTheme ? THEMES.DARK : THEMES.LIGHT,
	walletPopupIsVisible: false,
	gweiPopupIsVisibile: false,
	synthSearch: '',
	fiatCurrency: FIAT_CURRENCY_MAP.USD,
	hideSmallValueAssets: false,
	...getPersistedState('ui'),
};

export const uiSlice = createSlice({
	name: 'ui',
	initialState,
	reducers: {
		toggleWalletPopup: (state, action) => {
			state.walletPopupIsVisible = action.payload;
		},
		showWalletPopup: state => {
			state.walletPopupIsVisible = true;
		},
		toggleGweiPopup: (state, action) => {
			state.gweiPopupIsVisibile = action.payload;
		},
		showGweiPopup: state => {
			state.gweiPopupIsVisibile = true;
		},
		toggleTheme: state => {
			state.theme = isLightTheme(state.theme) ? THEMES.DARK : THEMES.LIGHT;
			persistState('ui', { theme: state.theme });
		},
		setSynthSearch: (state, action) => {
			state.synthSearch = action.payload;
		},
		setFiatCurrency: (state, action) => {
			state.fiatCurrency = action.payload.fiatCurrency;
		},
		toggleHideSmallValueAssets: state => {
			state.hideSmallValueAssets = !state.hideSmallValueAssets;
			persistState('ui', { hideSmallValueAssets: state.hideSmallValueAssets });
		},
	},
});

const {
	toggleWalletPopup,
	showWalletPopup,
	toggleGweiPopup,
	showGweiPopup,
	toggleTheme,
	setSynthSearch,
	setFiatCurrency,
	toggleHideSmallValueAssets,
} = uiSlice.actions;

export const getUIState = state => state.ui;
export const getFiatCurrency = state => getUIState(state).fiatCurrency;
export const getHideSmallValueAssets = state => getUIState(state).hideSmallValueAssets;

export default uiSlice.reducer;

export {
	toggleWalletPopup,
	showWalletPopup,
	toggleGweiPopup,
	showGweiPopup,
	toggleTheme,
	setSynthSearch,
	setFiatCurrency,
	toggleHideSmallValueAssets,
};
