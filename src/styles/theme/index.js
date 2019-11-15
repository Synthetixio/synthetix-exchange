import ThemeDark from './dark';
import ThemeLight from './light';

const sharedColors = {
	green: '#10BA97',
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
	return { colors: { ...colorStyle, ...sharedColors }, fonts };
};

export default theme;
