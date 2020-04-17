import { createSlice } from '@reduxjs/toolkit';
import { persistState, getPersistedState } from '../config/store';
import { isLightTheme, THEMES } from '../styles/theme';
import { FIAT_CURRENCY_MAP, SYNTHS_MAP } from 'src/constants/currency';

const userPrefersDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

const initialState = {
	theme: userPrefersDarkTheme ? THEMES.DARK : THEMES.LIGHT,
	walletPopupIsVisible: false,
	gweiPopupIsVisible: false,
	synthSearch: '',
	fiatCurrency: FIAT_CURRENCY_MAP.USD,
	hideSmallValueAssets: false,
	marketsAssetFilter: SYNTHS_MAP.sUSD,
	blurBackgroundIsVisible: false,
	leaderboardPopupIsVisible: false,
	twitterPopupIsVisible: false,
	...getPersistedState('ui'),
};

export const uiSlice = createSlice({
	name: 'ui',
	initialState,
	reducers: {
		toggleWalletPopup: (state, action) => {
			state.walletPopupIsVisible = action.payload;
		},
		showWalletPopup: (state) => {
			state.walletPopupIsVisible = true;
		},
		toggleGweiPopup: (state, action) => {
			state.gweiPopupIsVisible = action.payload;
		},
		showGweiPopup: (state) => {
			state.gweiPopupIsVisible = true;
		},
		showLeaderboardPopup: (state) => {
			state.leaderboardPopupIsVisible = true;
		},
		hideLeaderboardPopup: (state) => {
			state.leaderboardPopupIsVisible = false;
		},
		showTwitterPopup: (state) => {
			state.twitterPopupIsVisible = true;
		},
		hideTwitterPopup: (state) => {
			state.twitterPopupIsVisible = false;
		},
		toggleTheme: (state) => {
			state.theme = isLightTheme(state.theme) ? THEMES.DARK : THEMES.LIGHT;
			persistState('ui', { theme: state.theme });
		},
		setSynthSearch: (state, action) => {
			state.synthSearch = action.payload;
		},
		setFiatCurrency: (state, action) => {
			state.fiatCurrency = action.payload.fiatCurrency;
		},
		toggleHideSmallValueAssets: (state) => {
			state.hideSmallValueAssets = !state.hideSmallValueAssets;
			persistState('ui', { hideSmallValueAssets: state.hideSmallValueAssets });
		},
		setMarketsAssetFilter: (state, action) => {
			state.marketsAssetFilter = action.payload.marketsAssetFilter;
			persistState('ui', { marketsAssetFilter: state.marketsAssetFilter });
		},
		setBlurBackgroundIsVisible: (state, action) => {
			state.blurBackgroundIsVisible = action.payload;
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
	setMarketsAssetFilter,
	setBlurBackgroundIsVisible,
	showLeaderboardPopup,
	hideLeaderboardPopup,
	showTwitterPopup,
	hideTwitterPopup,
} = uiSlice.actions;

export const getUIState = (state) => state.ui;
export const getFiatCurrency = (state) => getUIState(state).fiatCurrency;
export const getCurrentTheme = (state) => getUIState(state).theme;
export const walletPopupIsVisible = (state) => getUIState(state).walletPopupIsVisible;
export const gweiPopupIsVisible = (state) => getUIState(state).gweiPopupIsVisible;
export const depotPopupIsVisible = (state) => getUIState(state).depotPopupIsVisible;
export const getSynthSearch = (state) => getUIState(state).synthSearch;
export const getHideSmallValueAssets = (state) => getUIState(state).hideSmallValueAssets;
export const getMarketsAssetFilter = (state) => getUIState(state).marketsAssetFilter;
export const getBlurBackgroundIsVisible = (state) => getUIState(state).blurBackgroundIsVisible;
export const getLeaderboardPopupIsVisible = (state) => getUIState(state).leaderboardPopupIsVisible;
export const getTwitterPopupIsVisible = (state) => getUIState(state).twitterPopupIsVisible;

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
	setMarketsAssetFilter,
	setBlurBackgroundIsVisible,
	showLeaderboardPopup,
	hideLeaderboardPopup,
	showTwitterPopup,
	hideTwitterPopup,
};
