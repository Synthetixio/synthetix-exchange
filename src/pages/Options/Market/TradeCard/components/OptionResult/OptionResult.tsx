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
	price?: number;
	claimableAmount?: number;
};

const OptionResult: FC<OptionResultProps> = ({ side, amount, price, claimableAmount, ...rest }) => {
	const { t } = useTranslation();

	return (
		<Container className={side} {...rest}>
			<StyledSideIcon side={side} />
			<Amount>{t(`options.common.amount-${side}`, { amount: formatCurrency(amount) })}</Amount>
			{claimableAmount != null && (
				<Info>{t('options.common.claimable-amount', { amount: claimableAmount })}</Info>
			)}
			{price != null && (
				<Info>
					{t('options.common.final-price')} {formatCurrencyWithSign(USD_SIGN, price)}
				</Info>
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

const Info = styled.div`
	color: ${(props) => props.theme.colors.fontTertiary};
	font-size: 12px;
	text-transform: uppercase;
	white-space: nowrap;
	padding-bottom: 3px;
	&:last-child {
		padding-bottom: 0;
	}
`;

export default OptionResult;
