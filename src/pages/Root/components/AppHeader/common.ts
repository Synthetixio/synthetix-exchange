import styled from 'styled-components';
import { labelSmallCSS } from 'components/Typography/Label';

export const BetaLabel = styled.span`
	border-radius: 100px;
	${labelSmallCSS};
	text-transform: uppercase;
	color: ${(props) => props.theme.colors.fontTertiary};
	background-color: ${(props) => props.theme.colors.accentL1};
	padding: 3px 6px 1px 6px;
	margin-left: 6px;
`;
