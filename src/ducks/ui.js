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
	dashboardPopupIsVisible: false,
	twitterPopupIsVisible: false,
	ovmTradeTooltipVisible: false,
	seenOvmTradeTooltip: false,
	viewTxModalVisible: false,
	viewTxModalProps: {},
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
			state.gweiPopupIsVisible = action.payload;
		},
		showGweiPopup: state => {
			state.gweiPopupIsVisible = true;
		},
		showLeaderboardPopup: state => {
			state.leaderboardPopupIsVisible = true;
		},
		hideLeaderboardPopup: state => {
			state.leaderboardPopupIsVisible = false;
		},
		showDashboardPopup: state => {
			state.dashboardPopupIsVisible = true;
		},
		hideDashboardPopup: state => {
			state.dashboardPopupIsVisible = false;
		},
		showTwitterPopup: state => {
			state.twitterPopupIsVisible = true;
		},
		hideTwitterPopup: state => {
			state.twitterPopupIsVisible = false;
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
		setMarketsAssetFilter: (state, action) => {
			state.marketsAssetFilter = action.payload.marketsAssetFilter;
			persistState('ui', { marketsAssetFilter: state.marketsAssetFilter });
		},
		setBlurBackgroundIsVisible: (state, action) => {
			state.blurBackgroundIsVisible = action.payload;
		},
		setOvmTradeTooltipVisible: (state, action) => {
			state.ovmTradeTooltipVisible = action.payload;
			if (state.ovmTradeTooltipVisible == true) {
				state.seenOvmTradeTooltip = true;
				persistState('ui', { seenOvmTradeTooltip: true });
			}
		},
		showViewTxModal: (state, action) => {
			state.viewTxModalVisible = true;
			state.viewTxModalProps = action.payload;
		},
		hideViewTxModal: state => {
			state.viewTxModalVisible = false;
			state.viewTxModalProps = {};
		},
	},
});

export const {
	showViewTxModal,
	hideViewTxModal,
	setSeenOvmTradeTooltip,
	setOvmTradeTooltipVisible,
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
	showDashboardPopup,
	hideDashboardPopup,
	showTwitterPopup,
	hideTwitterPopup,
} = uiSlice.actions;

export const getUIState = state => state.ui;
export const getFiatCurrency = state => getUIState(state).fiatCurrency;
export const getCurrentTheme = state => getUIState(state).theme;
export const walletPopupIsVisible = state => getUIState(state).walletPopupIsVisible;
export const gweiPopupIsVisible = state => getUIState(state).gweiPopupIsVisible;
export const depotPopupIsVisible = state => getUIState(state).depotPopupIsVisible;
export const getSynthSearch = state => getUIState(state).synthSearch;
export const getHideSmallValueAssets = state => getUIState(state).hideSmallValueAssets;
export const getMarketsAssetFilter = state => getUIState(state).marketsAssetFilter;
export const getBlurBackgroundIsVisible = state => getUIState(state).blurBackgroundIsVisible;
export const getLeaderboardPopupIsVisible = state => getUIState(state).leaderboardPopupIsVisible;
export const getDashboardPopupIsVisible = state => getUIState(state).dashboardPopupIsVisible;
export const getTwitterPopupIsVisible = state => getUIState(state).twitterPopupIsVisible;
export const getOvmTradeTooltipVisible = state => getUIState(state).ovmTradeTooltipVisible;
export const getSeenTradeTooltipVisible = state => getUIState(state).seenOvmTradeTooltip;
export const getViewTxModalVisible = state => getUIState(state).viewTxModalVisible;
export const getViewTxModalProps = state => getUIState(state).viewTxModalProps;

export default uiSlice.reducer;
