import React, { FC } from 'react';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';

import AppHeader from '../AppHeader';

import Spinner from 'components/Spinner';

import { FlexDiv } from 'shared/commonStyles';

type MainLayoutProps = {
	children: React.ReactNode;
	isAppReady: boolean;
};

export const MainLayout: FC<MainLayoutProps> = ({ children, isAppReady }) => (
	<>
		<GlobalStyle />
		<FullScreenContainer>
			<AppHeader />
			{isAppReady ? children : <Spinner fullscreen={true} size="sm" />}
		</FullScreenContainer>
	</>
);

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.colors.surfaceL1};
  }
`;

const FullScreenContainer = styled(FlexDiv)`
	flex-flow: column;
	width: 100%;
	height: 100vh;
	position: relative;
`;

export default MainLayout;
