import React, { FC, useContext } from 'react';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import { ThemeContext } from 'styled-components';

type MaterialUIThemeProviderProps = {
	children: React.ReactNode;
};

const MaterialUIThemeProvider: FC<MaterialUIThemeProviderProps> = ({ children }) => {
	const { colors, fonts } = useContext(ThemeContext);

	const theme = createMuiTheme({
		overrides: {
			MuiTooltip: {
				tooltip: {
					color: colors.fontPrimary,
					backgroundColor: colors.accentL1,
					fontSize: '12px',
					fontFamily: fonts.regular,
					borderRadius: '4px',
					padding: '5px 10px 6px 10px',
				},
				arrow: {
					color: colors.accentL1,
				},
			},
		},
	});

	return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};

export default MaterialUIThemeProvider;
