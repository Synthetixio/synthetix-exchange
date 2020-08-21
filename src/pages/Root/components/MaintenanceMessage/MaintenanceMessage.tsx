import React, { FC } from 'react';
import styled, { ThemeProvider } from 'styled-components';

import { lightTheme } from 'styles/theme';
import { headingH3CSS } from 'components/Typography/Heading';

const MaintenanceMessage: FC = () => (
	<ThemeProvider theme={lightTheme}>
		<Container>
			<Title>Synthetix.Exchange is currently down for maintenance.</Title>
			<Title>It will be back shortly.</Title>
		</Container>
	</ThemeProvider>
);

const Container = styled.div`
	position: absolute;
	width: 100%;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	text-align: center;
`;

const Title = styled.div`
	${headingH3CSS};
	color: ${(props) => props.theme.colors.fontPrimary};
`;

export default MaintenanceMessage;
