import React, { memo } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import SimpleAppHeader from 'src/pages/Root/components/SimpleAppHeader';
import { darkTheme } from 'src/styles/theme';

import Link from 'src/components/Link';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis } from 'recharts';

import { textShadowCSS, CenteredContent } from 'src/shared/commonStyles';

import mockRates from './mockRates';

import { media } from 'src/shared/media';

const Maintenance = memo(() => {
	return (
		<ThemeProvider theme={darkTheme}>
			<GlobalStyle />
			<Container>
				<SimpleAppHeader />
				<Content>
					<Hero>
						<Heading>See you on Mainnet!</Heading>
						<Subtitle>
							The L2 Synthetix.Exchange OVM demo has now been{' '}
							<Link to="https://blog.synthetix.io/l2-sx-ovm-demo-results/" isExternal={true}>
								completed
							</Link>
							.
						</Subtitle>
						<Subtitle>
							Thanks to everyone who tried out lightning-quick trades on the OVM in the demo, and
							stay tuned later in the year for further news about collaboration between Optimism and
							Synthetix!
						</Subtitle>
					</Hero>
					<ResponsiveContainer width="100%" height={200} id="onboarding-chart">
						<LineChart data={mockRates} margin={{ top: 0, left: 0, right: 0, bottom: 0 }}>
							<Line dataKey="rate" stroke="#00E2DF" dot={false} activeDot={false} strokeWidth={2} />
							<XAxis dataKey="timestamp" hide={true} />
							<YAxis type="number" domain={['auto', 'auto']} orientation="right" hide={true} />
						</LineChart>
					</ResponsiveContainer>
				</Content>
			</Container>
		</ThemeProvider>
	);
});

const Hero = styled.div`
	text-align: center;
	padding: 0 20px;
	margin-bottom: 40px;
`;

const Heading = styled.div`
	${textShadowCSS};
	font-family: ${props => props.theme.fonts.medium};
	font-weight: 500;
	font-size: 48px;
	text-align: center;
	letter-spacing: 0.2px;
	padding-bottom: 32px;
	margin: 0 auto;
	${media.small`
		font-size: 32px;
	`}
`;

const Subtitle = styled.div`
	font-size: 24px;
	padding-bottom: 25px;
	max-width: 750px;
	line-height: 120%;
	margin: 0 auto;
	color: ${props => props.theme.colors.fontSecondary};
	font-weight: normal;
	a {
		text-decoration: underline;
		color: ${props => props.theme.colors.fontSecondary};
		&:hover {
			text-decoration: underline;
		}
	}
	${media.small`
		font-size: 16px;
	`}
`;

const Content = styled(CenteredContent)`
	max-width: unset;
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
