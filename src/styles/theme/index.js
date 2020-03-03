import ThemeDark from './dark';
import ThemeLight from './light';

const sharedColors = {
	green: '#10BA97',
	white: '#FFFFFF',
	black: '#090818',
	red: '#D94454',
	hyperlink: '#A08AFF',
	buttonDefault: '#795DF5',
	buttonHover: '#947BFF',
	icons: '#5641F2',
};

const fonts = {
	light: 'apercu-light',
	regular: 'apercu-regular',
	medium: 'apercu-medium',
	bold: 'apercu-bold',
};

export const isDarkTheme = theme => theme === 'dark';
export const isLightTheme = theme => theme === 'light';

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

export const darkTheme = theme('dark');
export const lightTheme = theme('light');

export const themes = [darkTheme, lightTheme];

export default theme;
