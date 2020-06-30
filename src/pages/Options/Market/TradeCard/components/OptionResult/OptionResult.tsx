import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { USD_SIGN } from 'constants/currency';

import { Side } from 'pages/Options/types';

import { formatCurrency, formatCurrencyWithSign } from 'utils/formatters';

import { headingH6CSS } from 'components/Typography/Heading';

import SideIcon from 'pages/Options/Market/components/SideIcon';

type OptionResultProps = {
	side: Side;
	amount: number;
	totalPrice?: number;
};

const OptionResult: FC<OptionResultProps> = ({ side, amount, totalPrice, ...rest }) => {
	const { t } = useTranslation();

	return (
		<Container className={side} {...rest}>
			<StyledSideIcon side={side} />
			<Amount>{t(`options.common.amount-${side}`, { amount: formatCurrency(amount) })}</Amount>
			{totalPrice != null && (
				<Price>
					{t('options.common.price-you-paid')} {formatCurrencyWithSign(USD_SIGN, totalPrice)}
				</Price>
			)}
		</Container>
	);
};

const Container = styled.div`
	border: 1px solid ${(props) => props.theme.colors.accentL1};
	background-color: ${(props) => props.theme.colors.surfaceL3};
	padding: 16px;
	text-align: center;
`;

const StyledSideIcon = styled(SideIcon)`
	margin-bottom: 8px;
`;

const Amount = styled.div`
	color: ${(props) => props.theme.colors.fontPrimary};
	${headingH6CSS};
	text-transform: uppercase;
`;

const Price = styled.div`
	color: ${(props) => props.theme.colors.fontTertiary};
	font-size: 12px;
	text-transform: uppercase;
	white-space: nowrap;
`;

export default OptionResult;
