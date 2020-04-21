import React from 'react';
import styled from 'styled-components';

import { formatCurrencyWithSign } from 'utils/formatters';
import { EMPTY_VALUE } from 'constants/placeholder';

export const NullableCell = ({ cellProps, children }) =>
	cellProps.cell.value == null ? <span>{EMPTY_VALUE}</span> : children;

export const CurrencyCol = ({ currencyKey, synthsMap, cellProps }) => {
	const sign = synthsMap[currencyKey] && synthsMap[currencyKey].sign;

	if (cellProps.cell.value == null || !sign) {
		return <span>{EMPTY_VALUE}</span>;
	}

	return (
		<NullableCell cellProps={cellProps}>
			<span>{formatCurrencyWithSign(sign, cellProps.cell.value)}</span>
		</NullableCell>
	);
};

export const RightAlignedCell = styled.div`
	display: flex;
	width: inherit;
	justify-content: flex-end;
`;
