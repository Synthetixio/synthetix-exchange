import React, { FC } from 'react';
import styled from 'styled-components';

import { formatCurrencyWithSign } from 'utils/formatters';
import { EMPTY_VALUE } from 'constants/placeholder';

type CurrencyColProps = {
	sign?: string;
	value: number | null;
	decimals?: number;
};
export const CurrencyCol: FC<CurrencyColProps> = ({ sign = '', value, decimals }) => (
	<span>{value == null ? EMPTY_VALUE : formatCurrencyWithSign(sign, value, decimals)}</span>
);

export const RightAlignedCell = styled.div`
	display: flex;
	width: inherit;
	justify-content: flex-end;
`;
