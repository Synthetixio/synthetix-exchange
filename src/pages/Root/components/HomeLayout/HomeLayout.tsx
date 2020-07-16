import React, { Suspense, FC } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { darkTheme, lightTheme } from 'styles/theme';

import Footer from './Footer';
import AppHeader from '../AppHeader';

import Spinner from 'components/Spinner';

type HomeLayoutProps = {
	children: React.ReactNode;
	isAppReady?: boolean;
};

const LoadingContainer: FC = () => (
	<LoaderContainer>
		<Spinner size="sm" centered={true} />
	</LoaderContainer>
);

const HomeLayout: FC<HomeLayoutProps> = ({ children, isAppReady }) => {
	let componentToRender = children;

	if (isAppReady != null) {
		componentToRender = isAppReady ? children : <LoadingContainer />;
	}

	return (
		<>
			<GlobalStyle />
			{/* force the app header to be in dark mode */}
			<ThemeProvider theme={darkTheme}>
				<AppHeader showThemeToggle={false} isOnSplashPage={true} />
			</ThemeProvider>
			<Suspense fallback={<LoadingContainer />}>{componentToRender}</Suspense>
			<Footer />
		</>
	);
};

const LoaderContainer = styled.div`
	position: relative;
	height: 400px;
`;

const GlobalStyle = createGlobalStyle`
  body {
		background-color: ${darkTheme.colors.surfaceL1};
		color: ${lightTheme.colors.fontPrimary};
  }
`;

export default HomeLayout;
