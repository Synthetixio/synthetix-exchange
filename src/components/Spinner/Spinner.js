import React from 'react';
import styled, { keyframes, css } from 'styled-components';

import spinnerBig from '../../assets/images/spinner-big.png';
import spinnerSmall from '../../assets/images/spinner-small.png';

import { absoluteCenteredCSS } from '../../shared/commonStyles';

const Spinner = ({ size = 'lg', className, fullscreen = false, ...rest }) => (
	<Container className={className} fullscreen={fullscreen} {...rest}>
		<Img src={size === 'sm' ? spinnerSmall : spinnerBig} alt="spinner" size={size} />
	</Container>
);

const Container = styled.div`
	${(props) => props.fullscreen && absoluteCenteredCSS}
`;

const imageRotation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
`;

const Img = styled.img`
	animation: ${imageRotation} 2s infinite linear;
	${(props) =>
		props.size === 'sm' &&
		css`
			width: 20px;
			height: 20px;
		`}
`;

export default Spinner;
