import styled from 'styled-components';

import { DataSmall } from '../Typography';

export const Table = styled.table`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	background-color: ${props => props.theme.colors.surfaceL2};
`;

export const Thead = styled.thead`
	background-color: ${props => props.theme.colors.surfaceL3};
`;

export const Tbody = styled.tbody`
	overflow: auto;
`;

export const Tr = styled.tr``;

export const Th = styled.th`
	height: 42px;
	line-height: 12px;
	text-align: left;
	padding: 0 18px;
	&:last-child {
		text-align: right;
	}
`;

export const Td = styled.td`
	text-align: left;
	padding: 6px 18px;
	&:last-child {
		text-align: right;
	}
`;

export const DataLabel = styled(DataSmall)`
	text-transform: none;
	color: ${props => props.theme.colors.fontPrimary};
	font-family: 'apercu-regular';
`;
