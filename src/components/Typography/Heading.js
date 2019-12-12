import styled from 'styled-components';
import { typography } from 'styled-system';

export const HeadingMedium = styled.h2`
	font-family: 'apercu-regular';
	line-height: 32px;
	font-size: 32px;
	color: ${props => props.theme.colors.fontPrimary};
	letter-spacing: 1.5px;
	margin: 0;
	${typography}
`;

export const HeadingSmall = styled.h3`
	font-family: 'apercu-regular';
	line-height: 14px;
	font-size: 14px;
	color: ${props => props.theme.colors.fontPrimary};
	letter-spacing: 0.5px;
	margin: 0;
`;
