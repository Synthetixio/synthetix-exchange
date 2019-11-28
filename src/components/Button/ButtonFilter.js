import React from 'react';
import styled from 'styled-components';

import { DataSmall } from '../Typography';

const ButtonFilter = ({ children, onClick, height }) => {
	return (
		<Button height={height}>
			<ButtonLabel onClick={onClick}>{children}</ButtonLabel>
		</Button>
	);
};

const Button = styled.button`
	border-radius: 1px;
	height: ${props => (props.height ? props.height : '32px')};
	cursor: pointer;
	padding: 0 6px;
	background-color: ${props => props.theme.colors.accentDark};
	&:hover {
		background-color: ${props => props.theme.colors.accentLight};
		& > * {
			color: ${props => props.theme.colors.fontSecondary};
		}
	}
	border: none;
`;

const ButtonLabel = styled(DataSmall)`
	text-transform: none;
	color: ${props => props.theme.colors.fontTertiary};
	font-family: 'apercu-medium';
`;

export default ButtonFilter;
