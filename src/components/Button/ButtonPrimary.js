import styled from 'styled-components';
import { width } from 'styled-system';

const ButtonPrimary = styled.button`
	border-radius: 1px;
	height: 48px;
	width: 100%;
	font-size: 16px;
	letter-spacing: 0.5px;
	font-family: 'apercu-medium';
	color: ${props => props.theme.colors.white};
	cursor: pointer;
	padding: 0 6px;
	background-color: ${props => props.theme.colors.buttonDefault};
	&:hover {
		&:not(:disabled) {
			background-color: ${props => props.theme.colors.buttonHover};
		}
	}
	border: none;
	text-transform: uppercase;
	line-height: 44px;
	&:disabled {
		opacity: 0.5;
	}
	${width}
`;

export const ButtonPrimarySmall = styled(ButtonPrimary)`
	height: 32px;
	font-size: 14px;
	padding: 0 12px;
	width: auto;
	line-height: 34px;
`;

export default ButtonPrimary;
