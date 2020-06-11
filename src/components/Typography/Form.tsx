import { css } from 'styled-components';

import { baseTypographyCSS } from './Base';

export const formLabelCSS = css`
	${baseTypographyCSS};
	font-family: ${(props) => props.theme.fonts.medium};
	text-transform: uppercase;
`;

export const formLabelSmallCSS = css`
	${formLabelCSS};
	font-size: 12px;
`;

export const formLabelLargeCSS = css`
	${formLabelCSS};
	font-size: 14px;
`;

export const formInputCSS = css`
	${baseTypographyCSS};
`;

export const formInputSmallCSS = css`
	${formInputCSS};
	font-size: 12px;
`;

export const formInputLargeCSS = css`
	${formInputCSS};
	font-size: 14px;
	line-height: 1.3;
`;

export const formDataCSS = css`
	${baseTypographyCSS};
	font-size: 12px;
`;
