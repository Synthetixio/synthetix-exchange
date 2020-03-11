import React, { memo } from 'react';
import { ThemeProvider, createGlobalStyle } from 'styled-components';

import { darkTheme } from 'src/styles/theme';

import Hero from './Hero';
import Markets from './Markets';
import NewUserPromo from './NewUserPromo';
import ExchangeFeatures from './ExchangeFeatures';
import Footer from './Footer';

import AppHeader from '../Root/components/AppHeader';

const Home = memo(() => (
	<>
		<GlobalStyle />
		{/* force the app header to be in dark mode */}
		<ThemeProvider theme={darkTheme}>
			<AppHeader showThemeToggle={false} isOnSplashPage={true} />
		</ThemeProvider>
		<Hero />
		<Markets />
		<NewUserPromo />
		<ExchangeFeatures />
		<Footer />
	</>
));

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${darkTheme.colors.surfaceL1};
  }
`;

export default Home;
