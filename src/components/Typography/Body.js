import styled, { css } from 'styled-components';

export const bodyMediumCSS = css`
	font-size: 16px;
	color: ${props =>
		props.isSecondary ? props.theme.colors.fontSecondary : props.theme.colors.fontPrimary};
	font-family: ${props => props.theme.fonts.regular};
`;

export const bodyMediumSecondaryCSS = css`
	${bodyMediumCSS};
	color: ${props => props.theme.colors.fontSecondary};
`;

export const BodyMedium = styled.span`
	${bodyMediumCSS};
`;

export const BodyMediumSecondary = styled.span`
	${bodyMediumSecondaryCSS};
`;
