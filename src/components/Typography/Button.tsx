import { css } from 'styled-components';

export const buttonCSS = css`
	font-family: ${(props) => props.theme.fonts.regular};
	letter-spacing: 0.5px;
`;

export const buttonLargeCSS = css`
	${buttonCSS};
	font-family: ${(props) => props.theme.fonts.medium};
	font-size: 14px;
	text-transform: uppercase;
`;
