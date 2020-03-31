import React from 'react';
import { Switch, Route } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

import { ROUTES } from 'src/constants/routes';

import Spinner from 'src/components/Spinner';

import ManageWallet from './ManageWallet';
import ListWallets from './ListWallets';

const Delegate = ({ isAppReady }) => (
	<>
		<GlobalStyle />
		<Container>
			{isAppReady ? (
				<Switch>
					<Route path={ROUTES.Delegate.ManageWalletMatch} component={ManageWallet} />
					<Route component={ListWallets} />
				</Switch>
			) : (
				<Spinner size="sm" fullscreen={true} />
			)}
		</Container>
	</>
);

const Container = styled.div`
	padding: 27px;
	text-align: center;
	margin: 0 auto;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	> * {
		flex-shrink: 0;
		width: 100%;
	}
	max-width: 374px;
`;

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${props => props.theme.colors.surfaceL1};
  }
`;

export default Delegate;
