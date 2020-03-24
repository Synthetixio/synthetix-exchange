import React, { memo } from 'react';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import PropTypes from 'prop-types';
import { darkTheme } from 'src/styles/theme';

import Footer from './Footer';
import AppHeader from '../AppHeader';

const HomeLayout = memo(({ children }) => (
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

HomeLayout.propTypes = {
	children: PropTypes.node.isRequired,
};

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${darkTheme.colors.surfaceL1};
  }
`;

export default HomeLayout;
