import styled, { css } from 'styled-components';

const bodyCSS = css`
	font-family: ${props => props.theme.fonts.regular};
`;

export const bodyMediumCSS = css`
	${bodyCSS};
	font-size: 16px;
	color: ${props => props.theme.colors.fontPrimary};
`;

export const bodyMediumSecondaryCSS = css`
	${bodyMediumCSS};
	color: ${props => props.theme.colors.fontSecondary};
`;

export const bodyLargeCSS = css`
	${bodyCSS};
	font-size: 18px;
	color: ${props => props.theme.colors.fontPrimary};
`;

export const bodyLargeSecondaryCSS = css`
	${bodyLargeCSS};
	color: ${props => props.theme.colors.fontSecondary};
`;

export const BodyMedium = styled.span`
	${bodyMediumCSS};
`;

export const BodyMediumSecondary = styled.span`
	${bodyMediumSecondaryCSS};
`;

export const BodyLarge = styled.span`
	${bodyLargeCSS};
`;

export const BodyLargeSecondary = styled.span`
	${bodyLargeSecondaryCSS};
`;
