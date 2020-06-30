import React, { FC, memo } from 'react';
import styled from 'styled-components';

import CurrencyIcon from '../CurrencyIcon';

import { Container } from '../commonStyles';

import { CurrencyKey } from 'constants/currency';

type CurrencyNameProps = {
	currencyKey: CurrencyKey;
	name?: string;
	showIcon?: boolean;
	iconProps?: object;
	currencyDesc?: string | null;
};

export const CurrencyName: FC<CurrencyNameProps> = memo(
	({ currencyKey, name, currencyDesc = null, showIcon = false, iconProps = {}, ...rest }) => (
		<Container showIcon={showIcon} {...rest}>
			{showIcon && <CurrencyIcon currencyKey={currencyKey} {...iconProps} />}
			{name || currencyKey}
			{currencyDesc && <Desc className="currency-desc">{currencyDesc}</Desc>}
		</Container>
	)
);

const Desc = styled.span`
	padding-left: 5px;
	color: ${({ theme }) => theme.colors.fontTertiary};
`;

export default CurrencyName;
