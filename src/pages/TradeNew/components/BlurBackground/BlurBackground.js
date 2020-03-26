import React from 'react';
import { connect } from 'react-redux';

import { getBlurBackgroundIsVisible } from 'src/ducks/ui';
import styled, { keyframes, css } from 'styled-components';
import { Z_INDEX } from 'src/constants/ui';

const BlurBackground = ({ blurBackgroundIsVisible }) => (
	<Blur isVisible={blurBackgroundIsVisible} />
);

const keyf = keyframes`
from {
	backdrop-filter: blur(0px);
	opacity: 0;
}
to {
	backdrop-filter: blur(5px);
	opacity: 0.7
}
`;

const isBlurred = css`
	animation: ${keyf} 0.1s linear forwards;
`;

const Blur = styled.div`
	backdrop-filter: blur(0px);
	pointer-events: none;
	position: absolute;
	z-index: ${Z_INDEX.BLUR_MODAL};
	opacity: 0;
	bottom: 0;
	top: 54px;
	width: 100%;
	background: ${props => props.theme.colors.black};
	${props => props.isVisible && isBlurred}
`;

const mapStateToProps = state => ({
	blurBackgroundIsVisible: getBlurBackgroundIsVisible(state),
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(BlurBackground);
