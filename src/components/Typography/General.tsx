import { css } from 'styled-components';

export const bodyCSS = css`
	font-size: 16px;
`;

export const captionCSS = css`
	font-family: ${(props) => props.theme.fonts.medium};
	font-size: 12px;
	text-transform: uppercase;
`;

export const chartDataCSS = css`
	font-size: 10px;
`;

export const sectionTitleCSS = css`
	font-family: ${(props) => props.theme.fonts.medium};
	font-size: 14px;
`;

export const subtitleLargeCSS = css`
	font-size: 24px;
`;

export const subtitleSmallCSS = css`
	font-size: 24px;
`;
