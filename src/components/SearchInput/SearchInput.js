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
	background-color: ${props => props.theme.colors.surfaceL3};
	border: 1px solid ${props => props.theme.colors.accentLight};
	height: 32px;
	padding: 10px 10px 10px 25px;
	font-size: 12px;
	color: ${props => props.theme.colors.fontTertiary};
	::placeholder {
		opacity: 0.5;
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
