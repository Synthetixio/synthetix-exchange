import React from 'react';
import styled from 'styled-components';

import { DataSmall } from '../Typography';

const ButtonSort = ({ children, onClick }) => {
	return (
		<Button onClick={onClick}>
			<DataSmall>{children}</DataSmall>
			<SortIcon src={'/images/sort-arrows.svg'} />
		</Button>
	);
};

const Button = styled.button`
	border: none;
	outline: none;
	cursor: pointer;
	background-color: transparent;
	padding: 0;
	white-space: nowrap;
`;

const SortIcon = styled.img`
	width: 6.5px;
	height: 8px;
	margin-left: 5px;
`;

export default ButtonSort;
