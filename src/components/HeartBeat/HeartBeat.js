import React from 'react';
import styled, { css, keyframes } from 'styled-components';

import { absoluteCenteredCSS } from '../../shared/commonStyles';

const HeartBeat = ({ className, fullscreen = false, surface = 2, ...rest }) => (
	<Container className={className} fullscreen={fullscreen} {...rest}>
		<svg version="1.0" x="0px" y="0px" width="80px" viewBox="0 0 150 73">
			<polyline
				fill="none"
				stroke="#00E2DF"
				stroke-width="4"
				stroke-miterlimit="10"
				points="0,45.486 38.514,45.486 44.595,33.324 50.676,45.486 57.771,45.486 62.838,55.622 71.959,9 80.067,63.729 84.122,45.486 97.297,45.486 103.379,40.419 110.473,45.486 150,45.486"
			/>
		</svg>
		<FadeIn surface={surface} />
		<FadeOut surface={surface} />
	</Container>
);

const Container = styled.div`
	${absoluteCenteredCSS};
`;

const heartRateIn = keyframes`
  0% {
    width: 100%;
  }
  50% {
    width: 0%;
  }
  100% {
    width: 0;
  }
`;

const heartRateOut = keyframes`
  0% {
    left: -120%;
  }
  30% {
    left: -120%;
  }
  100% {
    left: 0;
  }
`;

const FadeIn = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	right: 0;
	animation: ${heartRateIn} 1.5s linear infinite;
	${props =>
		props.surface === 1 &&
		css`
			background: rgb(2, 11, 41);
		`}
	${props =>
		props.surface === 2 &&
		css`
			background: rgba(15, 15, 51);
		`}
	${props =>
		props.surface === 3 &&
		css`
			background: rgb(27, 27, 63);
		`}		
`;

const FadeOut = styled.div`
	position: absolute;
	width: 120%;
	height: 100%;
	top: 0;
	left: -120%;
	animation: ${heartRateOut} 1.5s linear infinite;

	${props =>
		props.surface === 1 &&
		css`
			background: linear-gradient(
				to right,
				rgba(2, 11, 41, 1) 0%,
				rgba(2, 11, 41, 1) 80%,
				rgba(2, 11, 41, 0) 100%
			);
		`}

	${props =>
		props.surface === 2 &&
		css`
			background: linear-gradient(
				to right,
				rgba(15, 15, 51, 1) 0%,
				rgba(15, 15, 51, 1) 80%,
				rgba(15, 15, 51, 0) 100%
			);
		`}

	${props =>
		props.surface === 3 &&
		css`
			background: linear-gradient(
				to right,
				rgba(27, 27, 63, 1) 0%,
				rgba(27, 27, 63, 1) 80%,
				rgba(27, 27, 63, 0) 100%
			);
		`}		
`;

export default HeartBeat;
