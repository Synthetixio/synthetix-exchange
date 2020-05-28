import React, { FC, memo } from 'react';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { darkTheme } from 'styles/theme';

import Footer from './Footer';
import AppHeader from '../AppHeader';

type HomeLayoutProps = {
	children: React.ReactNode;
};

const HomeLayout: FC<HomeLayoutProps> = memo(({ children }) => (
	<>
		<GlobalStyle />
		{/* force the app header to be in dark mode */}
		<ThemeProvider theme={darkTheme}>
			<AppHeader showThemeToggle={false} isOnSplashPage={true} />
		</ThemeProvider>
		{children}
		<Footer />
	</>
));

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${darkTheme.colors.surfaceL1};
  }
`;

export default HomeLayout;
