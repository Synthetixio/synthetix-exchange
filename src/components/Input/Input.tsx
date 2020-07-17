import styled, { css } from 'styled-components';

export const inputCSS = css`
	width: 100%;
	min-width: 0;
	font-family: ${(props) => props.theme.fonts.regular};
	background-color: ${(props) => props.theme.colors.surfaceL3};
	border: 1px solid ${(props) => props.theme.colors.accentL2};
	height: 42px;
	padding: 0 10px;
	font-size: 14px;
	color: ${(props) => props.theme.colors.fontPrimary};
	::placeholder {
		color: ${(props) => props.theme.colors.fontTertiary};
	}
	outline: none;
`;

export const Input = styled.input`
	${inputCSS};
`;

export default Input;
