import styled from 'styled-components';
import { color } from 'styled-system';

const Input = styled.input<{ padding?: string }>`
	width: 100%;
	font-family: 'apercu-regular', sans-serif;
	background-color: ${(props) => props.theme.colors.surfaceL3};
	border: 1px solid ${(props) => props.theme.colors.accentL2};
	height: 42px;
	padding: ${(props) => (props.padding ? props.padding : '0 10px')};
	font-size: 14px;
	color: ${(props) => props.theme.colors.fontTertiary};
	::placeholder {
		opacity: 0.5;
		color: ${(props) => props.theme.colors.fontTertiary};
		text-transform: capitalize;
	}
	${color}
`;

export default Input;
