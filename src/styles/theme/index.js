import ThemeDark from './dark';
import ThemeLight from './light';

const sharedColors = {
	green: 'linear-gradient(357.51deg, #00E2DF 4.3%, #BFF360 94.52%);',
	greenColor: '#00E2DF',
	white: '#FFFFFF',
	black: '#000000',
	red: '#D94454',
	hyperlink: '#00E2DF',
	buttonDefault: 'linear-gradient(154.92deg, #F49E25 -8.54%, #B252E9 101.04%);',
	buttonHover: 'linear-gradient(154.92deg, #F4C625 -8.54%, #E652E9 101.04%)',
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
