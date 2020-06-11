import styled from 'styled-components';

export const Input = styled.input<{ padding?: string }>`
	width: 100%;
	font-family: ${(props) => props.theme.fonts.regular};
	background-color: ${(props) => props.theme.colors.surfaceL3};
	border: 1px solid ${(props) => props.theme.colors.accentL2};
	height: 42px;
	padding: 0 10px;
	font-size: 14px;
	color: ${(props) => props.theme.colors.fontPrimary};
	::placeholder {
		opacity: 0.5;
		color: ${(props) => props.theme.colors.fontTertiary};
	}
	outline: none;
`;

export const TextInput = styled(Input).attrs({ type: 'text' })``;
export const NumericInput = styled(Input).attrs({ type: 'number' })``;
export const DateInput = styled(Input).attrs({ type: 'date' })`
	&::placeholder {
		text-transform: uppercase;
	}
`;

export default Input;
