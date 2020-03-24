import styled, { css } from 'styled-components';

const Button = styled.button`
	font-family: ${props => props.theme.fonts.medium};
	border-radius: 1px;
	height: 48px;
	font-size: 16px;
	letter-spacing: 0.5px;
	line-height: 44px;
	padding: 0 6px;
	&:disabled {
		opacity: 0.5;
		cursor: default;
	}
	border: none;
	text-transform: uppercase;
	white-space: nowrap;
	cursor: pointer;
	outline: none;

	${props =>
		props.size === 'xs' &&
		css`
			height: 24px;
			font-size: 11px;
			padding: 0 10px;
			line-height: 24px;
		`}

	${props =>
		props.size === 'sm' &&
		css`
			height: 32px;
			font-size: 14px;
			padding: 0 12px;
			line-height: 34px;
		`}

	${props =>
		props.palette === 'primary' &&
		css`
			color: ${props => props.theme.colors.white};
			background-color: ${props => props.theme.colors.buttonDefault};
			&:hover {
				&:not(:disabled) {
					background-color: ${props => props.theme.colors.buttonHover};
				}
			}
			${props =>
				props.isActive &&
				css`
					background-color: ${props => props.theme.colors.buttonHover};
				`}
		`}

	${props =>
		props.palette === 'secondary' &&
		css`
			color: ${props => props.theme.colors.fontTertiary};
			background-color: ${props => props.theme.colors.accentL1};
			&:hover {
				&:not(:disabled) {
					background-color: ${props => props.theme.colors.accentL2};
				}
			}
			${props =>
				props.isActive &&
				css`
					background-color: ${props => props.theme.colors.accentL2};
				`}
		`}
`;

export default Button;
