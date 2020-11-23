import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';

import { getCurrencyKeyIcon } from 'utils/currency';
import { CurrencyKey } from 'constants/currency';

type CurrencyIconProps = {
	currencyKey: CurrencyKey;
	type?: 'synth' | 'asset';
	badge?: ReactNode;
};

export const CurrencyIcon: FC<CurrencyIconProps> = ({
	currencyKey,
	type = 'synth',
	badge,
	...rest
}) => {
	const currencyIcon = getCurrencyKeyIcon(currencyKey);

	if (!currencyIcon) {
		return null;
	}

	const { SynthIcon, AssetIcon } = currencyIcon;

	const Icon = type === 'synth' && SynthIcon ? SynthIcon : AssetIcon;

	const icon = <Icon width="24" height="24" {...rest} />;

	if (badge) {
		return (
			<CurrencyIconContainer>
				{icon}
				<Badge>{badge}</Badge>
			</CurrencyIconContainer>
		);
	}
	return icon;
};

export const CurrencyIconContainer = styled.span`
	position: relative;
`;

export const Badge = styled.span`
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

export default CurrencyIcon;
