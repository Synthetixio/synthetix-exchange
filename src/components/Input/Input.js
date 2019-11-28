import styled from 'styled-components';
import { color } from 'styled-system';

const Input = styled.input`
	width: 100%;
	font-family: 'apercu-regular';
	background-color: ${props => props.theme.colors.surfaceL3};
	border: 1px solid ${props => props.theme.colors.accentLight};
	height: 42px;
	padding: ${props => (props.padding ? props.padding : '0 10px')};
	font-size: 14px;
	color: ${props => props.theme.colors.fontTertiary};
	::placeholder {
		opacity: 0.5;
		color: ${props => props.theme.colors.fontTertiary};
	}
	${color}
`;

export default Input;
