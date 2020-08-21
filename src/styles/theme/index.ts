import darkThemeColors from './dark';
import lightThemeColors from './light';
import colors from './colors';
import fonts from './fonts';

import { Theme } from './types';

export const isDarkTheme = (theme: Theme) => theme === 'dark';
export const isLightTheme = (theme: Theme) => theme === 'light';

const styledTheme = (themeName: Theme) => {
	const darkTheme = isDarkTheme(themeName);
	const lightTheme = isLightTheme(themeName);

	const colorStyle = darkTheme ? darkThemeColors : lightThemeColors;

	return {
		name: themeName,
		isDarkTheme: darkTheme,
		isLightTheme: lightTheme,
		colors: { ...colors, ...colorStyle },
		fonts,
	};
};

export const darkTheme = styledTheme('dark');
export const lightTheme = styledTheme('light');

export type ThemeInterface = typeof darkTheme;

export const themes = [darkTheme, lightTheme];

export const THEMES: Record<string, Theme> = {
	DARK: 'dark',
	LIGHT: 'light',
};
