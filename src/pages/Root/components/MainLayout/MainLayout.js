import React from 'react';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import PropTypes from 'prop-types';

import AppHeader from '../AppHeader';

import HeartBeat from 'src/components/HeartBeat';

import { FlexDiv } from 'src/shared/commonStyles';

export const MainLayout = ({ children, isAppReady, showHeader = true, isOnSplashPage = false }) => (
	<>
		<GlobalStyle />
		<FullScreenContainer>
			{showHeader && <AppHeader isOnSplashPage={isOnSplashPage} />}
			{isAppReady ? children : <HeartBeat surface={1} />}
		</FullScreenContainer>
	</>
);

MainLayout.propTypes = {
	children: PropTypes.node.isRequired,
	isAppReady: PropTypes.bool.isRequired,
};

const GlobalStyle = createGlobalStyle`
  body {
		color: ${props => props.theme.colors.fontPrimary};
		background: #020B29;
  }
`;

const FullScreenContainer = styled(FlexDiv)`
	flex-flow: column;
	width: 100%;
	height: 100vh;
	position: relative;
`;

export default MainLayout;
