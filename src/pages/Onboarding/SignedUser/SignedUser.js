import React, { memo } from 'react';
import styled from 'styled-components';

import { ButtonPrimary } from 'src/components/Button';

// import { ReactComponent as sUSDIcon } from 'src/assets/images/l2/sUSD.svg';

import { navigateTo, ROUTES } from 'src/constants/routes';

const SignedUser = memo(({ twitterUsername }) => (
	<Hero>
		<Heading>Here are your tokens, @{twitterUsername}:</Heading>
		<Subtitle>
			Your wallet now has OVM sUSD, start trading now to experience the speed of synthetix.exchange
			powered by the OVM.
		</Subtitle>
		<Tokens>1,000 OVM sUSD</Tokens>
		<ButtonPrimary size="lg" style={{ width: '300px' }} onClick={() => navigateTo(ROUTES.Trade)}>
			start trading now
		</ButtonPrimary>
	</Hero>
));

const Hero = styled.div`
	text-align: center;
	padding: 0 30px 30px 30px;
`;

const Heading = styled.div`
	text-shadow: 0px 0px 10px #b47598;
	font-size: 40px;
	line-height: 49px;
	text-align: center;
	letter-spacing: 0.2px;
	padding-bottom: 16px;
`;

const Subtitle = styled.div`
	font-size: 20px;
	line-height: 120%;
	text-align: center;
	letter-spacing: 0.2px;
	padding-bottom: 32px;
	max-width: 610px;
`;

const Tokens = styled.div`
	color: ${props => props.theme.colors.hyperlink};
	font-size: 56px;
	line-height: 70px;
	text-align: center;
	letter-spacing: 0.2px;
	margin-bottom: 86px;
`;

export default SignedUser;
