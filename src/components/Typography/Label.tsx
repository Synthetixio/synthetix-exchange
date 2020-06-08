import styled, { css } from 'styled-components';

export const labelCSS = css`
	font-family: ${(props) => props.theme.fonts.medium};
	letter-spacing: 0.2px;
`;

export const labelLargeCSS = css`
	${labelCSS};
	font-size: 16px;
`;

export const labelMediumCSS = css`
	${labelCSS};
	font-size: 14px;
`;

export const labelSmallCSS = css`
	${labelCSS}
	font-size: 12px;
`;

export const LabelLarge = styled.span`
	${labelLargeCSS}
`;

export const LabelMedium = styled.span`
	${labelMediumCSS}
`;

export const LabelSmall = styled.span`
	${labelSmallCSS}
`;
