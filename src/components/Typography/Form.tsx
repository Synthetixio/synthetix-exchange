import { css } from 'styled-components';

export const formLabelCSS = css`
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

export const formInputSmallCSS = css`
	font-size: 12px;
`;

export const formInputLargeCSS = css`
	font-size: 14px;
	line-height: 1.3;
`;

export const formDataCSS = css`
	font-size: 12px;
`;
