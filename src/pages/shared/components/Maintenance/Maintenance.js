import React, { memo } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import SimpleAppHeader from 'src/pages/Root/components/SimpleAppHeader';
import { darkTheme } from 'src/styles/theme';

import Link from 'src/components/Link';

const Maintenance = memo(() => (
	<ThemeProvider theme={darkTheme}>
		<GlobalStyle />
		<Container>
			<SimpleAppHeader />
			<Content>
				<TitleMessage>See you on Mainnet!</TitleMessage>
				<Message>
					<div>
						The L2 Synthetix.Exchange OVM demo has now been{' '}
						<StyledLink to="https://blog.synthetix.io/l2-sx-ovm-demo-results/" isExternal={true}>
							completed
						</StyledLink>
						.
					</div>
					<div>
						Thanks to everyone who tried out lightning-quick trades on the OVM in the demo, and stay
						tuned later in the year for further news about collaboration between Optimism and
						Synthetix!
					</div>
				</Message>
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
	padding-bottom: 20px;
`;

const TitleMessage = styled(Message)`
	font-size: 38px;
`;

const StyledLink = styled(Link)`
	color: ${props => props.theme.colors.hyperlink};
`;

const Content = styled.div`
	text-align: center;
	padding: 100px 24px;
	max-width: 1140px;
	margin: 0 auto;
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
