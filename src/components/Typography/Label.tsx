import styled, { css } from 'styled-components';

export const labelCSS = css`
	font-family: ${(props) => props.theme.fonts.medium};
`;

export const labelSmallCSS = css`
	${labelCSS}
	font-size: 12px;
`;

export const labelMediumCSS = css`
	${labelCSS};
	font-size: 14px;
	text-transform: uppercase;
`;

export const labelLargeCSS = css`
	${labelCSS};
	font-size: 16px;
	text-transform: uppercase;
`;

export const LabelMedium = styled.span`
	${labelMediumCSS}
`;

export const LabelSmall = styled.span`
	${labelSmallCSS}
`;
