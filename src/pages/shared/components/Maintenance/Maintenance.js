import React, { memo } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import SimpleAppHeader from 'src/pages/Root/components/SimpleAppHeader';
import { darkTheme } from 'src/styles/theme';

import { CenteredContent } from 'src/shared/commonStyles';

const Maintenance = memo(() => (
	<ThemeProvider theme={darkTheme}>
		<GlobalStyle />
		<Container>
			<SimpleAppHeader />
			<Content>
				<Message>Synthetix.Exchange L2 is currently down for maintenance.</Message>
				<Message>We apologise for the inconvenience, it will be back shortly.</Message>
			</Content>
		</Container>
	</ThemeProvider>
));

const Message = styled.div`
	color: #fff;
	font-style: normal;
	font-weight: 500;
	font-size: 24px;
	line-height: 29px;
	letter-spacing: 0.2px;
`;

const Content = styled(CenteredContent)`
	max-width: unset;
	padding: 24px;
`;

const Container = styled.div`
	display: flex;
	flex-flow: column;
	width: 100%;
	height: 100vh;
`;

const GlobalStyle = createGlobalStyle`
  body {
		color: ${props => props.theme.colors.fontPrimary};
    background: #0F0F33;
  }
`;

export default Maintenance;
