import ThemeDark from './dark';
import ThemeLight from './light';

const sharedColors = {
	green: '#10BA97',
	white: '#FFFFFF',
	red: '#D94454',
	hyperlink: '#A08AFF',
	buttonDefault: '#795DF5',
	buttonHover: '#947BFF',
	icons: '#5641F2',
};

const fonts = {
	light: `'apercu-light', sans-serif`,
	regular: `'apercu-regular', sans-serif`,
	medium: `'apercu-medium', sans-serif`,
	bold: `'apercu-bold', sans-serif`,
};

export const THEMES = {
	DARK: 'dark',
	LIGHT: 'light',
};

export const isDarkTheme = theme => theme === THEMES.DARK;
export const isLightTheme = theme => theme === THEMES.LIGHT;

const theme = themeName => {
	const darkTheme = isDarkTheme(themeName);
	const lightTheme = isLightTheme(themeName);

	const colorStyle = darkTheme ? ThemeDark : ThemeLight;

	return {
		name: themeName,
		isDarkTheme: darkTheme,
		isLightTheme: lightTheme,
		colors: { ...colorStyle, ...sharedColors },
		fonts,
	};
};

export const darkTheme = theme(THEMES.DARK);
export const lightTheme = theme(THEMES.LIGHT);

export const themes = [darkTheme, lightTheme];

export default theme;
