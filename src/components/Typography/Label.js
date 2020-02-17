import styled, { css } from 'styled-components';
import { color } from 'styled-system';

export const labelCSS = css`
	${color};
	font-family: 'apercu-medium', sans-serif;
	color: ${props => props.color || props.theme.colors.fontPrimary};
`;

export const labelMediumCSS = css`
	${labelCSS};
	font-size: 14px;
`;

export const labelSmallCSS = css`
	${labelCSS}
	font-size: 12px;
`;

export const LabelMedium = styled.span`
	${labelMediumCSS}
`;

export const LabelSmall = styled.span`
	${labelSmallCSS}
`;
