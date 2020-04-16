import React, { memo } from 'react';
import styled from 'styled-components';

import { ButtonPrimary } from 'src/components/Button';

import { ReactComponent as SynthSIcon } from 'src/assets/images/l2/sUSD/s.svg';
import { ReactComponent as SynthUSDICon } from 'src/assets/images/l2/sUSD/usd.svg';

import { navigateTo, ROUTES } from 'src/constants/routes';

import { textShadowCSS, gradientTextCSS, FlexDivCenteredCol } from 'src/shared/commonStyles';

import { media } from 'src/shared/media';

const SignedUser = memo(({ twitterHandle }) => (
	<FlexDivCenteredCol style={{ padding: '0 20px' }}>
		<Heading>Here are your tokens, @{twitterHandle}:</Heading>
		<Subtitle>
			Your wallet now has OVM sUSD, start trading now to experience the speed of synthetix.exchange
			powered by the OVM.
		</Subtitle>
		<Tokens>
			<TokenSVG>
				<SynthSIcon />
				<SynthUSDICon />
			</TokenSVG>
			<TokensText>1,000 OVM sUSD</TokensText>
		</Tokens>
		<StyledButtonPrimary size="lg" onClick={() => navigateTo(ROUTES.Trade)}>
			start trading now
		</StyledButtonPrimary>
	</FlexDivCenteredCol>
));

const Heading = styled.div`
	${textShadowCSS};
	font-family: ${props => props.theme.fonts.medium};
	font-size: 40px;
	line-height: 49px;
	text-align: center;
	letter-spacing: 0.2px;
	padding-bottom: 16px;

	${media.small`
		font-size: 32px;
		line-height: 39px;
	`}
`;

const Subtitle = styled.div`
	color: ${props => props.theme.colors.fontSecondary};
	font-size: 20px;
	line-height: 120%;
	text-align: center;
	letter-spacing: 0.2px;
	padding-bottom: 32px;
	max-width: 610px;
	${media.small`
		font-size: 16px;
		line-height: 20px;
	`}
`;

const Tokens = styled.div`
	display: flex;
	align-items: center;
	margin-bottom: 86px;
	${media.small`
		margin-bottom: 48px;
	`}
`;

const TokensText = styled.div`
	color: ${props => props.theme.colors.hyperlink};
	font-size: 56px;
	line-height: 70px;
	text-align: center;
	letter-spacing: 0.2px;

	background: -webkit-linear-gradient(353.8deg, #00e2df 4.3%, #bff360 94.52%);
	${gradientTextCSS};
	-webkit-text-stroke: 1px #43eeec;
	text-shadow: 0px 0px 20px rgba(255, 164, 235, 0.3);

	${media.small`
		font-size: 32px;
		line-height: 39px;
	`}

	white-space: nowrap;
`;

const TokenSVG = styled.div`
	position: relative;
	top: 5px;
	margin-right: 24px;
	background: -webkit-linear-gradient(353.8deg, #00e2df 4.3%, #bff360 94.52%);
	display: flex;
	width: 56px;
	height: 56px;
	border-radius: 50%;
	align-items: center;
	justify-content: center;
	border: 1px solid #43eeec;
	box-shadow: 0px 0px 20px rgba(255, 164, 235, 0.3);
	flex-shrink: 0;

	${media.small`
		width: 32px;
		height: 32px;

		svg {
			&:first-child {
				width: 10px;
			}
			&:last-child {
				height: 12px;
			}
		}
	`}
`;

const StyledButtonPrimary = styled(ButtonPrimary)`
	width: 300px;
	${media.small`
		width: 240px;
	`}
`;

export default SignedUser;
