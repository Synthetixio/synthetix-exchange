import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

const NetworkInfoTooltip = ({ children, title, ...rest }) => {
	const { colors } = useContext(ThemeContext);
	const theme = createMuiTheme({
		overrides: {
			MuiTooltip: {
				tooltip: {
					padding: '12px',
					backgroundColor: colors.accentL1,
					borderRadius: '4px',
				},
				arrow: {
					color: colors.accentL1,
				},
			},
		},
	});
	return (
		<MuiThemeProvider theme={theme}>
			<Tooltip title={title} placement="bottom" arrow={true} {...rest}>
				{children}
			</Tooltip>
		</MuiThemeProvider>
	);
};

export default NetworkInfoTooltip;
