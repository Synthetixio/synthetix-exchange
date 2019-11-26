import React from 'react';
import styled from 'styled-components';

const SearchInput = () => {
	return (
		<Container>
			<Icon src="/images/search.svg" />
			<Input placeholder="SEARCH"></Input>
		</Container>
	);
};

const Container = styled.div`
	width: 100%;
	position: relative;
`;
const Input = styled.input`
	width: 100%;
	font-family: 'apercu-regular';
	background-color: ${props => props.theme.colors.surfaceL3};
	border: 1px solid ${props => props.theme.colors.accentLight};
	height: 32px;
	padding: 0 10px 0 25px;
	font-size: 16px;
	color: ${props => props.theme.colors.fontTertiary};
	::placeholder {
		opacity: 0.5;
		color: ${props => props.theme.colors.fontTertiary};
	}
`;
const Icon = styled.img`
	width: 12px;
	height: 12px;
	position: absolute;
	top: 50%;
	left: 10px;
	transform: translateY(-50%);
`;

export default SearchInput;
