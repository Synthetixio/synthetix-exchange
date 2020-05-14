import React, { FC, memo } from 'react';
import { connect } from 'react-redux';

import { getBlurBackgroundIsVisible } from 'ducks/ui';
import styled, { keyframes, css } from 'styled-components';
import { Z_INDEX } from 'constants/ui';
import { RootState } from 'ducks/types';

type StateProps = {
	blurBackgroundIsVisible: boolean;
};

type BlurBackgroundProps = StateProps;

const BlurBackground: FC<BlurBackgroundProps> = memo(({ blurBackgroundIsVisible }) => (
	<Blur isVisible={blurBackgroundIsVisible} />
));

const keyf = keyframes`
from {
	backdrop-filter: blur(0px);
	opacity: 0;
}
to {
	backdrop-filter: blur(5px);
	opacity: 0.6
}
`;

const isBlurred = css`
	animation: ${keyf} 0.1s linear forwards;
`;

const Blur = styled.div<{ isVisible: boolean }>`
	backdrop-filter: blur(0px);
	pointer-events: none;
	position: absolute;
	z-index: ${Z_INDEX.BLUR_MODAL};
	opacity: 0;
	bottom: 0;
	top: 54px;
	width: 100%;
	background: ${(props) => props.theme.colors.surfaceL1};
	${(props) => props.isVisible && isBlurred}
`;

const mapStateToProps = (state: RootState): StateProps => ({
	blurBackgroundIsVisible: getBlurBackgroundIsVisible(state),
});

export default connect<StateProps, {}, {}, RootState>(mapStateToProps)(BlurBackground);
