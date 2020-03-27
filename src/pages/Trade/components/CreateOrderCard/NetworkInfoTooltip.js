import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

const NetworkInfoTooltip = ({ children, title }) => {
	const { colors } = useContext(ThemeContext);
	const theme = createMuiTheme({
		overrides: {
			MuiTooltip: {
				tooltip: {
					padding: '16px',
					backgroundColor: colors.accentL1,
				},
			},
		},
	});
	return (
		<MuiThemeProvider theme={theme}>
			<Tooltip title={title} placement="bottom">
				{children}
			</Tooltip>
		</MuiThemeProvider>
	);
};

export default NetworkInfoTooltip;
