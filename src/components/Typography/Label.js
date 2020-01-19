import styled from 'styled-components';
import { color } from 'styled-system';

export const LabelMedium = styled.span`
	${color}
	font-size: 14px;
	font-family: 'apercu-medium', sans-serif;
	color: ${props => (props.color ? props.color : props.theme.colors.fontPrimary)};
`;

export const LabelSmall = styled.span`
	${color}
	font-size: 12px;
	font-family: 'apercu-medium', sans-serif;
	color: ${props => (props.color ? props.color : props.theme.colors.fontPrimary)};
`;
