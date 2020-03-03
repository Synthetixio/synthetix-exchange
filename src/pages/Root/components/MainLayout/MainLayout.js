import React from 'react';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import PropTypes from 'prop-types';

import Header from '../../../../components/Header';

import Spinner from '../../../../components/Spinner';

import { FlexDiv } from '../../../../shared/commonStyles';

export const MainLayout = ({ children, isAppReady }) => (
	<>
		<GlobalStyle />
		<FullScreenContainer>
			<Header />
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
    background-color: ${props => props.theme.colors.surfaceL1};
  }
`;

const FullScreenContainer = styled(FlexDiv)`
	flex-flow: column;
	width: 100%;
	height: 100vh;
	position: relative;
`;

export default MainLayout;
