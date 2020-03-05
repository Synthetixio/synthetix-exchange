import React, { memo } from 'react';
import styled, { ThemeProvider } from 'styled-components';

import Hero from './Hero';
import Markets from './Markets';

import AppHeader from '../Root/components/AppHeader';
import { darkTheme } from 'src/styles/theme';

const Home = memo(() => (
	<>
		{/* force the app header to be in dark mode */}
		<ThemeProvider theme={darkTheme}>
			<StyledAppHeader showThemeToggle={false} />
		</ThemeProvider>
		<Hero />
		<Markets />
	</>
));

const StyledAppHeader = styled(AppHeader)`
	background-color: ${props => props.theme.colors.surfaceL1};
`;

export default Home;
