import ThemeDark from './dark';
import ThemeLight from './light';

const sharedColors = {
	green: '#10BA97',
	white: '#FFFFFF',
	red: '#D94454',
	hyperLink: '#A08AFF',
	buttonDefault: '#795DF5',
	buttonHover: '#947BFF',
	icons: '#5641F2',
};

const fonts = {
	regular: 'apercu-regular',
	medium: 'apercu-medium',
	bold: 'apercu-bold',
};

const theme = mode => {
	const colorStyle = mode === 'dark' ? ThemeDark : ThemeLight;
	return { name: mode, colors: { ...colorStyle, ...sharedColors }, fonts };
};

export const darkTheme = theme('dark');
export const lightTheme = theme('light');

export const themes = [darkTheme, lightTheme];

export default theme;
