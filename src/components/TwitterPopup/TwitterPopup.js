import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';

import { hideTwitterPopup } from 'src/ducks/ui';
import { getWalletInfo } from 'src/ducks/wallet/walletDetails';

import { ReactComponent as CloseCrossIcon } from 'src/assets/images/close-cross.svg';
import { ReactComponent as QuoteRIcon } from 'src/assets/images/l2/quoteL.svg';
import { ReactComponent as QuoteLIcon } from 'src/assets/images/l2/quoteR.svg';
import { ReactComponent as TweetLineChartIcon } from 'src/assets/images/l2/tweet-line-chart.svg';

import SimpleAppHeader from 'src/pages/Root/components/SimpleAppHeader';

import {
	resetButtonCSS,
	CenteredContent,
	FlexDivCenteredCol,
	Popup,
	textShadowCSS,
} from 'src/shared/commonStyles';

import { shortenAddress } from 'src/utils/formatters';
import { L2_URL } from 'src/constants/l2';

import { media } from 'src/shared/media';

const getTweet = address => {
	const text = `Hey @Synthetix_io it's ${address}, give me some sUSD tokens on Layer 2! @optimismPBC`;
	const hashtags = 'synthetix';
	const url = L2_URL;

	return {
		text,
		hashtags,
		url,
		composed: `${text} ${url} #${hashtags}`,
	};
};

const TwitterPopup = ({ hideTwitterPopup, walletInfo }) => {
	const currentWallet = walletInfo.currentWallet;
	const tweet = getTweet(currentWallet);

	const alreadyFauceted = walletInfo.twitterFaucet > 0;

	const [polling, setPolling] = useState(false);
	// initialize twitter stuff
	const [twitterLoaded, setTwitterLoaded] = useState(false);
	const [twitterLoadedError, setTwitterLoadedError] = useState(false);
	useEffect(() => {
		function initializeTwitter() {
			window.twttr.ready().then(() => {
				window.twttr.widgets.load();
				setTwitterLoaded(true);

				window.twttr.events.bind('tweet', () => {
					setPolling(true);
				});
			});
		}

		if (!window.twttr) {
			let stale = false;

			setTimeout(() => {
				if (!stale) {
					if (window.twttr) {
						initializeTwitter();
					} else {
						setTimeout(() => {
							if (!stale) {
								if (window.twttr) {
									initializeTwitter();
								} else {
									setTwitterLoadedError(true);
								}
							}
						}, 4000);
					}
				}
			}, 1000);

			return () => {
				stale = true;
			};
		} else {
			initializeTwitter();
		}
	}, []);

	useEffect(() => {
		if (alreadyFauceted) {
			setPolling(false);
			hideTwitterPopup();
		}
	}, [alreadyFauceted, hideTwitterPopup]);

	function MetaInformation() {
		if (twitterLoadedError) {
			return <span>There was an error loading Twitter.</span>;
		} else if (!twitterLoaded) {
			return <span>Loading Twitter...</span>;
		} else if (polling) {
			return (
				<>
					<span>
						<TweetListener>
							<TweetLineChartIcon />
							listening for your Tweet...
						</TweetListener>
					</span>
				</>
			);
		} else {
			return null;
		}
	}

	return (
		<Popup>
			<SimpleAppHeader onClick={hideTwitterPopup} />
			<CenteredContent>
				<FlexDivCenteredCol style={{ padding: '0 20px' }}>
					<Headline>Tweet @ us to get sUSD OVM tokens</Headline>
					<Subtitle>
						To start trading on L2 you need to claim sUSD OVM tokens. Tweet the link to your wallet
						and start trading now!
					</Subtitle>
					<CloseButton onClick={hideTwitterPopup}>
						<CloseCrossIcon />
					</CloseButton>
					<TweetPreview>
						<StyledQuoteRIcon />
						{tweet.composed.replace(currentWallet, shortenAddress(currentWallet))}
						<StyledQuoteLIcon />
					</TweetPreview>
					<TweetContainer hide={alreadyFauceted || polling || !twitterLoaded}>
						<a
							className="twitter-share-button"
							href="https://twitter.com/intent/tweet"
							data-size="large"
							data-hashtags={tweet.hashtags}
							data-url={tweet.url}
							data-text={tweet.text}
							data-dnt="true"
							width="200"
							height="300"
						>
							Tweet
						</a>
					</TweetContainer>
					<MetaInformation />
				</FlexDivCenteredCol>
			</CenteredContent>
		</Popup>
	);
};

const TweetContainer = styled.div`
	a {
		display: none;
	}

	iframe {
		${({ hide }) =>
			hide &&
			css`
				visiblity: hidden !important;
				height: 0 !important;
			`}
	}
`;

const Headline = styled.div`
	color: ${props => props.theme.colors.fontPrimary};
	font-family: ${props => props.theme.fonts.medium};
	${textShadowCSS};
	font-size: 32px;
	line-height: 39px;
	text-align: center;
	letter-spacing: 0.2px;
	padding-bottom: 16px;
	${media.small`
		max-width: 280px;
	`}
`;

const Subtitle = styled.div`
	color: ${props => props.theme.colors.fontSecondary};
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
	top: -50px;
	right: 0;
	svg {
		width: 20px;
		height: 20px;
	}
	${media.small`
		position: fixed;
		right: 10px;
		top: 15px;
	`}
`;

const TweetPreview = styled.div`
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

	${media.small`
		font-size: 16px;
		line-height: 20px;
		padding: 26px 43px;
	`}
`;

const StyledQuoteRIcon = styled(QuoteRIcon)`
	position: absolute;
	left: 15px;
	top: 15px;
	${media.small`
		width: 14px;
		top: 10px;
		left: 10px;
	`}
`;

const StyledQuoteLIcon = styled(QuoteLIcon)`
	position: absolute;
	right: 15px;
	bottom: 15px;
	${media.small`
		width: 14px;
		right: 10px;
		bottom: 10px;
	`}
`;

const TweetListener = styled.div`
	color: ${props => props.theme.colors.fontPrimary};
	display: grid;
	grid-auto-flow: column;
	grid-gap: 10px;
`;

const mapStateToProps = state => ({
	walletInfo: getWalletInfo(state),
});

const mapDispatchToProps = {
	hideTwitterPopup,
};

export default connect(mapStateToProps, mapDispatchToProps)(TwitterPopup);
