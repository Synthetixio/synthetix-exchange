import React from 'react';
import styled, { keyframes } from 'styled-components';

const Spinner = ({ small }) => {
	return (
		<Container>
			<Img src={small ? 'images/spinner-small.png' : 'images/spinner.png'} alt="spinner" />
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

export default Spinner;
