import React, { memo } from 'react';
import { connect } from 'react-redux';
import styled, { createGlobalStyle } from 'styled-components';
import AppHeader from 'src/pages/Root/components/AppHeader';

import { getTwitterUsername } from 'src/ducks/wallet/walletDetails';

import { CenteredContent } from 'src/shared/commonStyles';

import NewUser from './NewUser';
import SignedUser from './SignedUser';

const Splash = memo(({ twitterUsername }) => (
	<>
		<GlobalStyle />
		<Container>
			<AppHeader isOnSplashPage={true} />
			<Content>
				{twitterUsername ? <SignedUser twitterUsername={twitterUsername} /> : <NewUser />}
			</Content>
		</Container>
	</>
));

const Content = styled(CenteredContent)`
	max-width: unset;
`;

const Container = styled.div`
	width: 100%;
	height: 100vh;
`;

const GlobalStyle = createGlobalStyle`
  body {
		color: ${props => props.theme.colors.fontPrimary};
    background: linear-gradient(180deg, #020B29 0%, #0F0F33 100%);
  }
`;

const mapStateToProps = state => ({
	twitterUsername: getTwitterUsername(state),
});

export default connect(mapStateToProps, null)(Splash);
