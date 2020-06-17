import React, { Suspense, FC, memo } from 'react';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { darkTheme, lightTheme } from 'styles/theme';

import Footer from './Footer';
import AppHeader from '../AppHeader';

import Spinner from 'components/Spinner';

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
		<Suspense fallback={<Spinner size="sm" centered={true} />}>{children}</Suspense>
		<Footer />
	</>
));

const GlobalStyle = createGlobalStyle`
  body {
		background-color: ${darkTheme.colors.surfaceL1};
		color: ${lightTheme.colors.fontPrimary};
  }
`;

export default HomeLayout;
