import React from 'react';
import styled, { keyframes } from 'styled-components';

const Spinner = ({ size = 'big' }) => {
	return (
		<Container>
			{size === 'tiny' ? (
				<TinyImg src={`images/spinner-small.png`} alt="spinner" />
			) : (
				<Img src={`images/spinner-${size}.png`} alt="spinner" />
			)}
		</Container>
	);
};

const imageRotation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
`;

const Container = styled.div`
	padding: 30x 0;
`;

const Img = styled.img`
	animation: ${imageRotation} 2s infinite linear;
`;

const TinyImg = styled(Img)`
	width: 20px;
	height: 20px;
`;

export default Spinner;
