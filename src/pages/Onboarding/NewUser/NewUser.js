import React, { memo } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { ButtonPrimary } from 'src/components/Button';
import Link from 'src/components/Link';

import ChartLineSVG from 'src/assets/images/l2/chart-line.svg';

import { showTwitterPopup } from 'src/ducks/ui';

import { textShadowCSS, gradientTextCSS } from 'src/shared/commonStyles';

import { media } from 'src/shared/media';

const NewUser = memo(({ showTwitterPopup }) => (
	<>
		<Hero>
			<Welcome>Welcome to</Welcome>
			<Heading>Synthetix.Exchange</Heading>
			<Subtitle>
				An L2 testnet trading competition powered by the{' '}
				<Link to="https://optimism.io/ovm/" isExternal={true}>
					OVM
				</Link>
				. Experience the speed of optimistic rollups.
			</Subtitle>
			<StyledButtonPrimary size="lg" onClick={showTwitterPopup}>
				get your tokens now
			</StyledButtonPrimary>
		</Hero>
		<ChartLineImage src={ChartLineSVG} />
	</>
));

const ChartLineImage = styled.img`
	width: 100%;
`;

const Hero = styled.div`
	text-align: center;
	padding: 0 20px;
	margin-bottom: 40px;
`;

const Welcome = styled.div`
	font-size: 20px;
	line-height: 25px;
	letter-spacing: 0.2px;
	text-transform: uppercase;
	font-family: ${props => props.theme.fonts.medium};
	background: -webkit-linear-gradient(167.03deg, #f4c625 -8.54%, #e652e9 101.04%);
	${gradientTextCSS};
	padding-bottom: 12px;
	${media.small`
		font-size: 16px;
		line-height: 20px;
	`}
`;

const Heading = styled.div`
	${textShadowCSS};
	font-family: ${props => props.theme.fonts.medium};
	font-size: 56px;
	line-height: 70px;
	text-align: center;
	letter-spacing: 0.2px;
	padding-bottom: 12px;
	text-transform: uppercase;
	word-break: break-word;
	margin: 0 auto;
	${media.small`
		font-size: 48px;
		line-height: 110%;
		max-width: 250px;
	`}
`;

const Subtitle = styled.div`
	font-size: 24px;
	padding-bottom: 58px;
	max-width: 650px;
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
		line-height: 20px;
	`}
`;

const StyledButtonPrimary = styled(ButtonPrimary)`
	width: 300px;
	${media.small`
		width: 240px;
	`}
`;

const mapDispatchToProps = {
	showTwitterPopup,
};

export default connect(null, mapDispatchToProps)(NewUser);
