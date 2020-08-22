import React from 'react';
import styled from 'styled-components';

const Dropdown = ({ header, body }) => {
	return (
		<Container>
			<Header>{header}</Header>
			<Body>{body}</Body>
		</Container>
	);
};

const Container = styled.div``;
const Header = styled.div``;
const Body = styled.div``;

export default Dropdown;
