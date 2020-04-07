import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { hideTwitterPopup } from 'src/ducks/ui';

import { ReactComponent as CloseCrossIcon } from 'src/assets/images/close-cross.svg';
import { ReactComponent as TweetIcon } from 'src/assets/images/l2/tweet.svg';
import { ReactComponent as QuoteRIcon } from 'src/assets/images/l2/quoteL.svg';
import { ReactComponent as QuoteLIcon } from 'src/assets/images/l2/quoteR.svg';
import { ReactComponent as TweetLineChartIcon } from 'src/assets/images/l2/tweet-line-chart.svg';

import SimpleAppHeader from 'src/pages/Root/components/SimpleAppHeader';

import { resetButtonCSS, CenteredContent, Popup } from 'src/shared/commonStyles';

const TwitterPopup = ({ hideTwitterPopup }) => {
	return (
		<Popup>
			<SimpleAppHeader />
			<Content>
				<Headline>Tweet @ us to get sUSD OVM tokens</Headline>
				<Subtitle>
					To start trading on L2 you need to claim sUSD OVM tokens. Tweet the link to your wallet
					and start trading now!
				</Subtitle>
				<CloseButton onClick={hideTwitterPopup}>
					<CloseCrossIcon />
				</CloseButton>
				<TweetBox>
					<StyledQuoteRIcon />
					Hey @Synthetix_io it's 0x3e7e...edx24, give me some sUSD tokens on Layer 2! #synthetix
					https://synthetix.exchange @optimismPBC
					<StyledQuoteLIcon />
				</TweetBox>
				<TweetButton>
					<TweetIcon />
					Tweet
				</TweetButton>
				<TweetListener>
					<TweetLineChartIcon />
					listening for your Tweet...
				</TweetListener>
			</Content>
		</Popup>
	);
};

const Content = styled(CenteredContent)`
	max-width: 624px;
`;

const Headline = styled.div`
	color: ${props => props.theme.colors.fontPrimary};
	font-family: ${props => props.theme.fonts.medium};
	text-shadow: 0px 0px 10px #b47598;
	font-size: 32px;
	line-height: 39px;
	text-align: center;
	letter-spacing: 0.2px;
	padding-bottom: 16px;
`;

const Subtitle = styled.div`
	color: ${props => props.theme.colors.fontSecondary};
	font-family: ${props => props.theme.fonts.regular};
	font-size: 16px;
	line-height: 20px;
	text-align: center;
	letter-spacing: 0.2px;
	padding-bottom: 50px;
	max-width: 480px;
`;

const CloseButton = styled.button`
	${resetButtonCSS};
	position: absolute;
	right: -100px;
	top: 97px;
	svg {
		width: 20px;
		height: 20px;
	}
`;

const TweetBox = styled.div`
	background: ${props => props.theme.colors.surfaceL3};
	color: ${props => props.theme.colors.fontPrimary};
	border: 0.5px solid #cb5bf2;
	box-sizing: border-box;
	border-radius: 1px;

	font-size: 24px;
	line-height: 120%;

	text-align: center;
	letter-spacing: 0.2px;
	position: relative;
	padding: 43px;
	margin-bottom: 40px;
`;

const StyledQuoteRIcon = styled(QuoteRIcon)`
	position: absolute;
	left: 15px;
	top: 15px;
`;

const StyledQuoteLIcon = styled(QuoteLIcon)`
	position: absolute;
	right: 15px;
	bottom: 15px;
`;

const TweetButton = styled.button`
	${resetButtonCSS};
	color: ${props => props.theme.colors.fontPrimary};
	font-size: 20px;
	line-height: 25px;
	/* identical to box height */

	text-align: center;
	letter-spacing: 0.2px;

	background: #2daae1;
	border-radius: 2px;
	margin-bottom: 60px;
	display: flex;
	padding: 10px;
	align-items: center;
	svg {
		margin-right: 5px;
	}
`;

const TweetListener = styled.div`
	color: ${props => props.theme.colors.fontPrimary};
	display: grid;
	grid-auto-flow: column;
	grid-gap: 10px;
`;

const mapDispatchToProps = {
	hideTwitterPopup,
};

export default connect(null, mapDispatchToProps)(TwitterPopup);
