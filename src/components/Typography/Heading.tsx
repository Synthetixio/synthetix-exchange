import styled, { css } from 'styled-components';
import { typography } from 'styled-system';

import { baseTypographyCSS } from './Base';

const headingCSS = css`
	${baseTypographyCSS};
	font-family: ${(props) => props.theme.fonts.regular};
	color: ${(props) => props.theme.colors.fontPrimary};
`;

export const headingH3CSS = css`
	${headingCSS};
	font-family: ${(props) => props.theme.fonts.medium};
	font-size: 32px;
`;

export const headingH4CSS = css`
	${headingCSS};
	font-family: ${(props) => props.theme.fonts.medium};
	font-size: 24px;
`;

export const headingH5CSS = css`
	${headingCSS};
	font-family: ${(props) => props.theme.fonts.medium};
	font-size: 20px;
`;

export const headingH6CSS = css`
	${headingCSS};
	font-family: ${(props) => props.theme.fonts.medium};
	font-size: 16px;
`;

export const headingLargeCSS = css`
	${headingCSS};
	font-family: ${(props) => props.theme.fonts.bold};
	font-size: 56px;
	line-height: 56px;
	letter-spacing: 0.2px;
`;

export const headingMediumCSS = css`
	${headingCSS};
	line-height: 32px;
	font-size: 32px;
	letter-spacing: 0.2px;
`;

export const headingSmallCSS = css`
	${headingCSS};
	line-height: 14px;
	font-size: 14px;
	letter-spacing: 0.5px;
`;

export const HeadingLarge = styled.h1`
	${headingLargeCSS};
	margin: 0;
	${typography}
`;

export const HeadingMedium = styled.h2`
	${headingMediumCSS};
	margin: 0;
	${typography}
`;

export const HeadingSmall = styled.h3`
	${headingSmallCSS};
	margin: 0;
	${typography}
`;

export const subtitleSmallCSS = css`
	font-family: ${(props) => props.theme.fonts.regular};
	font-weight: 400;
	font-size: 20px;
	letter-spacing: 0.2px;
`;

export const subtitleLargeCSS = css`
	font-family: ${(props) => props.theme.fonts.regular};
	font-weight: 400;
	font-size: 24px;
	letter-spacing: 0.2px;
`;
