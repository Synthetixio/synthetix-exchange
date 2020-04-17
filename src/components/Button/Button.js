import styled, { css } from 'styled-components';

const Button = styled.button`
	font-family: ${(props) => props.theme.fonts.medium};
	border-radius: 1px;
	border: none;
	height: 48px;
	font-size: 16px;
	letter-spacing: 0.5px;
	padding: 0 6px;
	&:disabled {
		opacity: 0.5;
		cursor: default;
	}
	text-transform: uppercase;
	white-space: nowrap;
	cursor: pointer;
	outline: none;
	padding: 0 15px;

	${(props) =>
		props.size === 'xs' &&
		css`
			height: 24px;
			font-size: 11px;
		`}

	${(props) =>
		props.size === 'sm' &&
		css`
			height: 32px;
			font-size: 14px;
		`}

	${(props) =>
		props.size === 'md' &&
		css`
			height: 40px;
			font-size: 14px;
		`}

	${(props) =>
		props.palette === 'primary' &&
		css`
			border: 1px solid #ff8fc5;
			color: ${(props) => props.theme.colors.white};
			background: ${(props) => props.theme.colors.buttonDefault};
			&:hover {
				&:not(:disabled) {
					background: ${(props) => props.theme.colors.buttonHover};
				}
			}
			${(props) =>
				props.isActive &&
				css`
					background: ${(props) => props.theme.colors.buttonHover};
				`}
		`}

	${(props) =>
		props.palette === 'secondary' &&
		css`
			color: ${(props) => props.theme.colors.fontTertiary};
			background: ${(props) => props.theme.colors.accentL1};
			&:hover {
				&:not(:disabled) {
					background: ${(props) => props.theme.colors.accentL2};
				}
			}
			${(props) =>
				props.isActive &&
				css`
					background: ${(props) => props.theme.colors.accentL2};
				`}
		`}
`;

export default Button;
