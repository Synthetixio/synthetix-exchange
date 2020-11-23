import React, { FC } from 'react';
import styled from 'styled-components';

import { formatCurrencyPair } from '../../../utils/formatters';

import CurrencyIcon from '../CurrencyIcon';

import { Container } from '../commonStyles';
import { CurrencyKey } from 'constants/currency';

type CurrencyPairProps = {
	baseCurrencyKey: CurrencyKey;
	baseCurrencyAsset?: string;
	quoteCurrencyKey: CurrencyKey;
	showIcon?: boolean;
	iconProps?: any;
	maxLeverage?: number;
};

export const CurrencyPair: FC<CurrencyPairProps> = ({
	baseCurrencyKey,
	baseCurrencyAsset,
	quoteCurrencyKey,
	showIcon = true,
	iconProps = {},
	maxLeverage,
	...rest
}) => (
	<Container showIcon={showIcon} {...rest}>
		{showIcon && (
			<CurrencyIconContainer>
				<CurrencyIcon currencyKey={baseCurrencyKey} {...iconProps} />
				{maxLeverage && <Badge>{maxLeverage}x</Badge>}
			</CurrencyIconContainer>
		)}
		{formatCurrencyPair(baseCurrencyAsset || baseCurrencyKey, quoteCurrencyKey)}
	</Container>
);

const CurrencyIconContainer = styled.span`
	position: relative;
`;

const Badge = styled.span`
	position: absolute;
	bottom: 0;
	right: 0;
	bottom: 2px;
	right: -5px;

	width: 16px;
	height: 16px;
	background: ${(props) => props.theme.colors.icons};
	color: ${(props) => props.theme.colors.white};
	border-radius: 100%;
	font-size: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
`;

export default CurrencyPair;
