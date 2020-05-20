import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistState, getPersistedState } from '../config/store';
import { isLightTheme, THEMES } from '../styles/theme';
import { FIAT_CURRENCY_MAP, SYNTHS_MAP, CurrencyKey } from 'constants/currency';
import { Theme } from 'styles/theme/types';
import { RootState } from './types';

const userPrefersDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

const sliceName = 'ui';

type UISliceState = {
	theme: Theme;
	walletPopupIsVisible: boolean;
	gweiPopupIsVisible: boolean;
	fiatCurrency: CurrencyKey;
	hideSmallValueAssets: boolean;
	marketsAssetFilter: CurrencyKey;
	blurBackgroundIsVisible: boolean;
	synthsCategoryFilter: string | null;
};

const initialState: UISliceState = {
	theme: userPrefersDarkTheme ? THEMES.DARK : THEMES.LIGHT,
	walletPopupIsVisible: false,
	gweiPopupIsVisible: false,
	fiatCurrency: FIAT_CURRENCY_MAP.USD,
	hideSmallValueAssets: false,
	marketsAssetFilter: SYNTHS_MAP.sUSD,
	blurBackgroundIsVisible: false,
	synthsCategoryFilter: null,
	...getPersistedState(sliceName),
};

export const uiSlice = createSlice({
	name: sliceName,
	initialState,
	reducers: {
		toggleWalletPopup: (state, action: PayloadAction<boolean>) => {
			state.walletPopupIsVisible = action.payload;
		},
		showWalletPopup: (state) => {
			state.walletPopupIsVisible = true;
		},
		toggleGweiPopup: (state, action: PayloadAction<boolean>) => {
			state.gweiPopupIsVisible = action.payload;
		},
		showGweiPopup: (state) => {
			state.gweiPopupIsVisible = true;
		},
		toggleTheme: (state) => {
			state.theme = isLightTheme(state.theme) ? THEMES.DARK : THEMES.LIGHT;
			persistState('ui', { theme: state.theme });
		},
		setFiatCurrency: (state, action) => {
			state.fiatCurrency = action.payload.fiatCurrency;
		},
		toggleHideSmallValueAssets: (state) => {
			state.hideSmallValueAssets = !state.hideSmallValueAssets;
			persistState('ui', { hideSmallValueAssets: state.hideSmallValueAssets });
		},
		setMarketsAssetFilter: (state, action: PayloadAction<{ marketsAssetFilter: CurrencyKey }>) => {
			state.marketsAssetFilter = action.payload.marketsAssetFilter;
			persistState('ui', { marketsAssetFilter: state.marketsAssetFilter });
		},
		setSynthsCategoryFilter: (state, action: PayloadAction<{ category: string | null }>) => {
			state.synthsCategoryFilter = action.payload.category;
			persistState('ui', { synthsCategoryFilter: state.synthsCategoryFilter });
		},
		setBlurBackgroundIsVisible: (state, action: PayloadAction<boolean>) => {
			state.blurBackgroundIsVisible = action.payload;
		},
	},
});

export const {
	setSynthsCategoryFilter,
	toggleWalletPopup,
	showWalletPopup,
	toggleGweiPopup,
	showGweiPopup,
	toggleTheme,
	setFiatCurrency,
	toggleHideSmallValueAssets,
	setMarketsAssetFilter,
	setBlurBackgroundIsVisible,
} = uiSlice.actions;

export const getUIState = (state: RootState) => state[sliceName];
export const getFiatCurrency = (state: RootState) => getUIState(state).fiatCurrency;
export const getCurrentTheme = (state: RootState) => getUIState(state).theme;
export const walletPopupIsVisible = (state: RootState) => getUIState(state).walletPopupIsVisible;
export const gweiPopupIsVisible = (state: RootState) => getUIState(state).gweiPopupIsVisible;
export const getHideSmallValueAssets = (state: RootState) => getUIState(state).hideSmallValueAssets;
export const getMarketsAssetFilter = (state: RootState) => getUIState(state).marketsAssetFilter;
export const getSynthsCategoryFilter = (state: RootState) => getUIState(state).synthsCategoryFilter;
export const getBlurBackgroundIsVisible = (state: RootState) =>
	getUIState(state).blurBackgroundIsVisible;

export default uiSlice.reducer;
