import { css } from 'styled-components';

const tableHeaderCSS = css`
	font-family: ${(props) => props.theme.fonts.medium};
	text-transform: uppercase;
`;

export const tableHeaderSmallCSS = css`
	${tableHeaderCSS};
	font-size: 12px;
`;

export const tableHeaderLargeCSS = css`
	${tableHeaderCSS};
	font-size: 14px;
`;

export const tableDataSmallCSS = css`
	font-size: 12px;
`;

export const tableDataLargeCSS = css`
	font-size: 14px;
	line-height: 1.3;
`;
