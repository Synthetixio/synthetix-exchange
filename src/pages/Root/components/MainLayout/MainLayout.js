import React from 'react';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import PropTypes from 'prop-types';

import AppHeader from '../AppHeader';

import Spinner from 'src/components/Spinner';

import { FlexDiv } from 'src/shared/commonStyles';

export const MainLayout = ({ children, isAppReady }) => (
	<>
		<GlobalStyle />
		<FullScreenContainer>
			<AppHeader />
			{isAppReady ? children : <Spinner fullscreen={true} size="sm" />}
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
		background: linear-gradient(180deg, #020B29 0%, #0F0F33 100%);
  }
`;

const FullScreenContainer = styled(FlexDiv)`
	flex-flow: column;
	width: 100%;
	height: 100vh;
	position: relative;
`;

export default MainLayout;
