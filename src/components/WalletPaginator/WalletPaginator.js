import React from 'react';
import styled from 'styled-components';
import { Arrow } from '../Icons';
import { DataLarge } from '../Typography';

const Paginator = ({ currentIndex, disabled, onIndexChange }) => {
	return (
		<Wrapper disabled={disabled}>
			<Button
				onClick={() => {
					if (currentIndex > 0) {
						onIndexChange(currentIndex - 1);
					}
				}}
			>
				<Arrow direction="left" />
			</Button>
			<DataLarge>Page {currentIndex + 1}</DataLarge>
			<Button
				onClick={() => {
					onIndexChange(currentIndex + 1);
				}}
			>
				<Arrow direction="right" />
			</Button>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	width: 100%;
	margin: 30px 0;
	display: flex;
	justify-content: center;
	align-items: center;
	transition: opacity 0.1s ease-out;
	opacity: ${props => (props.disabled ? 0.6 : 1)};
	pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
`;

const Button = styled.button`
	margin: 0 20px;
	padding: 0;
	border: none;
	width: 24px;
	height: 24px;
	border-radius: 1px;
	background: ${props =>
		props.active ? props.theme.colors.accentL2 : props.theme.colors.accentL1};
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	transition: all 0.1s ease;
	&:hover {
		background: ${props => props.theme.colors.accentL2};
	}
`;

export default Paginator;
