import styled from 'styled-components';
import { color, typography } from 'styled-system';

export const DataLarge = styled.span`
	font-size: 18px;
	text-transform: uppercase;
	color: ${props => props.theme.colors.fontPrimary};
`;

export const DataMedium = styled.span`
	font-size: 14px;
	color: ${props => props.theme.colors.fontPrimary};
	font-family: 'apercu-regular';
	text-transform: uppercase;
	${typography};
	${color};
`;

export const DataSmall = styled.span`
	font-size: 12px;
	text-transform: uppercase;
	letter-spacing: 0.5px;
	font-family: 'apercu-medium';
	color: ${props => props.theme.colors.fontPrimary};
	${color};
	${typography};
`;
