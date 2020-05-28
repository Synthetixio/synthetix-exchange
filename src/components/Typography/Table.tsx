import { css } from 'styled-components';

const tableBaseCSS = css`
	font-family: ${(props) => props.theme.fonts.regular};
	font-weight: 400;
	letter-spacing: 0.2px;
`;

const tableBaseSmallCSS = css`
	${tableBaseCSS};
	font-size: 12px;
`;

export const tableHeaderSmallCSS = css`
	${tableBaseSmallCSS};
	font-family: ${(props) => props.theme.fonts.medium};
	text-transform: uppercase;
`;

export const tableDataSmallCSS = css`
	${tableBaseSmallCSS};
`;
