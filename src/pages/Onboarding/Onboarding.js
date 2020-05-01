import React, { memo } from 'react';
import { connect } from 'react-redux';
import styled, { createGlobalStyle } from 'styled-components';
import AppHeader from 'src/pages/Root/components/AppHeader';

import { getWalletInfo } from 'src/ducks/wallet/walletDetails';

import { CenteredContent } from 'src/shared/commonStyles';

import NewUser from './NewUser';
import SignedUser from './SignedUser';

const Splash = memo(({ walletInfo }) => (
	<>
		<GlobalStyle />
		<Container>
			<AppHeader isOnSplashPage={true} />
			<Content>
				{walletInfo.twitterFaucet > 0 ? (
					<SignedUser twitterHandle={walletInfo.twitterHandle} />
				) : (
					<NewUser />
				)}
			</Content>
		</Container>
	</>
));

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
    background: #020B29;
  }
`;

const mapStateToProps = state => ({
	walletInfo: getWalletInfo(state),
});

export default connect(mapStateToProps, null)(Splash);
