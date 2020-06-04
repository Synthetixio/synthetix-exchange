import { css } from 'styled-components';

const bodyCSS = css`
	font-family: ${(props) => props.theme.fonts.regular};
	letter-spacing: 0.2px;
`;

export const bodyMediumCSS = css`
	${bodyCSS};
	font-size: 16px;
	line-height: 20px;
`;

export const bodyLargeCSS = css`
	${bodyCSS};
	font-size: 18px;
`;
