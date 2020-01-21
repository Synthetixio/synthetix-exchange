import styled from 'styled-components';
import { color } from 'styled-system';

import { DataSmall } from '../Typography';

export const Table = styled.table`
	width: 100%;
	height: ${props => (props.height ? props.height : '100%')};
	display: flex;
	flex-direction: column;
	background-color: ${props => props.theme.colors.surfaceL2};
`;

export const Thead = styled.thead`
	background-color: ${props => props.theme.colors.surfaceL3};
`;

export const Tbody = styled.tbody`
	overflow: auto;
	min-height: 0;
`;

export const Tr = styled.tr`
	display: flex;
`;

export const Th = styled.th`
	display: flex;
	flex-direction: column;
	flex-basis: 100%;
	justify-content: center;
	height: 42px;
	line-height: 12px;
	text-align: right;
	align-items: flex-end;
	&:first-child {
		text-align: left;
		align-items: flex-start;
	}
	padding: 0 18px;
	@media screen and (max-width: 1440px) {
		padding: 6px 8px;
	}
`;

export const Td = styled.td`
	display: flex;
	flex-direction: column;
	/* white-space: nowrap; */
	flex-basis: 100%;
	text-align: right;
	&:first-child {
		text-align: left;
	}
	padding: 6px 18px;
	@media screen and (max-width: 1440px) {
		padding: 6px 8px;
	}
`;

export const DataLabel = styled(DataSmall)`
	text-transform: none;
	color: ${props => props.theme.colors.fontPrimary};
	font-family: 'apercu-regular', sans-serif;
	${color};
`;
