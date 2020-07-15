import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

const NetworkInfoTooltip = ({ children, title, open = undefined }) => {
	const { colors } = useContext(ThemeContext);
	const theme = createMuiTheme({
		overrides: {
			MuiTooltip: {
				tooltip: {
					padding: '16px',
					color: colors.fontPrimary,
					backgroundColor: colors.accentL1,
					fontSize: '12px',
					fontFamily: `'apercu-regular', sans-serif`,
				},
			},
		},
	});
	return (
		<MuiThemeProvider theme={theme}>
			<Tooltip open={open} title={title} placement="bottom">
				{children}
			</Tooltip>
		</MuiThemeProvider>
	);
};

export default NetworkInfoTooltip;
