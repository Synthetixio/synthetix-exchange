import React, { memo } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { createGlobalStyle } from 'styled-components';

import { darkTheme } from 'src/styles/theme';
import { breakpoint } from 'src/shared/media';

import Hero from './Hero';
import Markets from './Markets';
import Footer from './Footer';

import AppHeader from '../Root/components/AppHeader';

const Home = memo(() => (
	<>
		{/* force the app header to be in dark mode */}
		<ThemeProvider theme={darkTheme}>
			<GlobalStyle />
			<StyledAppHeader showThemeToggle={false} />
		</ThemeProvider>
		<Hero />
		<Markets />
		<Footer />
	</>
));

const StyledAppHeader = styled(AppHeader)`
	background-color: ${props => props.theme.colors.surfaceL1};
	> div {
		max-width: ${breakpoint.large};
	}
`;

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${props => props.theme.colors.surfaceL1};
  }
`;

export default Home;
