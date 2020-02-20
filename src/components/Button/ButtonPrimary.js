import styled, { css } from 'styled-components';
import { width } from 'styled-system';

const smallButtonCSS = css`
	height: 32px;
	font-size: 14px;
	padding: 0 12px;
	width: auto;
	line-height: 34px;
`;

const ButtonPrimary = styled.button`
	border-radius: 1px;
	height: 48px;
	width: 100%;
	font-size: 16px;
	letter-spacing: 0.5px;
	font-family: ${props => props.theme.fonts.medium};
	color: ${props => props.theme.colors.white};
	cursor: pointer;
	padding: 0 6px;
	background-color: ${props => props.theme.colors.buttonDefault};
	&:disabled {
		opacity: 0.5;
		cursor: default;
	}
	&:hover {
		&:not(:disabled) {
			background-color: ${props => props.theme.colors.buttonHover};
		}
	}
	border: none;
	text-transform: uppercase;
	line-height: 44px;
	white-space: nowrap;
	${width};
	${props => props.size === 'sm' && smallButtonCSS}
`;

export const ButtonPrimarySmall = styled(ButtonPrimary)`
	${smallButtonCSS}
`;

export default ButtonPrimary;
