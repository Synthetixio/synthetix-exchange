import styled, { css } from 'styled-components';

const headingCSS = css`
	font-family: ${(props) => props.theme.fonts.medium};
`;

export const headingH1CSS = css`
	font-family: ${(props) => props.theme.fonts.bold};
	font-size: 56px;
	line-height: 1.1;
`;

export const headingH2CSS = css`
	${headingCSS};
	font-size: 48px;
	line-height: 1.3;
`;

export const headingH3CSS = css`
	${headingCSS};
	font-size: 32px;
`;

export const headingH4CSS = css`
	${headingCSS};
	font-size: 24px;
`;

export const headingH5CSS = css`
	${headingCSS};
	font-size: 20px;
`;

export const headingH6CSS = css`
	${headingCSS};
	font-size: 16px;
`;

// TODO: deprecate these

export const headingLargeCSS = css`
	${headingCSS};
	font-size: 56px;
`;

export const headingMediumCSS = css`
	${headingCSS};
	line-height: 32px;
	font-size: 32px;
`;

export const headingSmallCSS = css`
	${headingCSS};
	font-size: 14px;
`;

export const HeadingLarge = styled.div`
	${headingLargeCSS};
`;

export const HeadingMedium = styled.div`
	${headingMediumCSS};
`;

export const HeadingSmall = styled.div`
	${headingSmallCSS};
`;
