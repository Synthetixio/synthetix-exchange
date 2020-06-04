import React, { memo, FC } from 'react';
import styled, { keyframes } from 'styled-components';

import spinnerBig from 'assets/images/spinner-big.png';
import spinnerSmall from 'assets/images/spinner-small.png';

import { absoluteCenteredCSS } from 'shared/commonStyles';

type ImageSize = 'lg' | 'sm';

type SpinnerProps = {
	size?: ImageSize;
	className?: string;
	centered?: boolean;
};

const Spinner: FC<SpinnerProps> = memo(({ size = 'lg', className, centered = false, ...rest }) => (
	<Container className={className} centered={centered} {...rest}>
		{size === 'sm' ? (
			<Img src={spinnerSmall} alt="spinner" width="20" height="20" />
		) : (
			<Img src={spinnerBig} alt="spinner" />
		)}
	</Container>
));

const Container = styled.div<{ centered: boolean }>`
	${(props) => props.centered && absoluteCenteredCSS}
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
`;

export default Spinner;
