import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { formatCurrency } from 'utils/formatters';
import { getTransactionPrice } from 'utils/networkUtils';

import { LinkTextSmall } from 'shared/commonStyles';
import { TextButton, FlexDivRow } from 'shared/commonStyles';

import { DataSmall } from 'components/Typography';
import { ReactComponent as QuestionMark } from 'assets/images/question-mark.svg';
import NetworkInfoTooltip from './NetworkInfoTooltip';
import { formatPercentage } from 'utils/formatters';

export const TransactionInfo = ({
	gasPrice,
	gasLimit,
	ethRate = 0,
	usdRate = 0,
	amount = 0,
	exchangeFeeRate = 0,
	onEditButtonClick,
}) => {
	const { t } = useTranslation();
	const usdValue = amount * usdRate;
	const exchangeFee = ((amount * exchangeFeeRate) / 100) * usdRate;
	const networkFee = getTransactionPrice(gasPrice, gasLimit, ethRate);

	const getTooltipBody = () => (
		<TooltipContent>
			<TooltipContentRow>
				<TooltipLabel>{`${t(
					'trade.trade-card.network-info-tooltip.exchange-fee'
				)} (${formatPercentage(exchangeFeeRate / 100)})`}</TooltipLabel>
				<TooltipLabel>${formatCurrency(exchangeFee)}</TooltipLabel>
			</TooltipContentRow>
			<TooltipContentRow>
				<TooltipLabel>{t('trade.trade-card.network-info-tooltip.network-fee')}</TooltipLabel>
				<TooltipLabel>${formatCurrency(networkFee)}</TooltipLabel>
			</TooltipContentRow>
		</TooltipContent>
	);

	return (
		<Container>
			<NetworkDataRow>
				<NetworkData>{t('trade.trade-card.network-info.usd-value')}</NetworkData>
				<NetworkData>${formatCurrency(usdValue) || 0}</NetworkData>
			</NetworkDataRow>
			<NetworkDataRow>
				<NetworkDataLabelFlex>
					{t('trade.trade-card.network-info.fee')}
					<NetworkInfoTooltip title={getTooltipBody()}>
						<QuestionMarkIcon>
							<QuestionMarkStyled />
						</QuestionMarkIcon>
					</NetworkInfoTooltip>
				</NetworkDataLabelFlex>
				<NetworkData>${formatCurrency(exchangeFee + networkFee)}</NetworkData>
			</NetworkDataRow>
			<NetworkDataRow>
				<NetworkData>{t('common.gas-price-gwei')}</NetworkData>
				<NetworkData>
					{gasPrice || 0}
					<ButtonEdit onClick={onEditButtonClick}>
						<LinkTextSmall>{t('common.actions.edit')}</LinkTextSmall>
					</ButtonEdit>
				</NetworkData>
			</NetworkDataRow>
		</Container>
	);
};

TransactionInfo.propTypes = {
	gasPrice: PropTypes.number,
	gasLimit: PropTypes.number,
	ethRate: PropTypes.number,
	onEditButtonClick: PropTypes.func.isRequired,
};

const TooltipContent = styled.div`
	width: 200px;
	& > * + * {
		margin-top: 8px;
	}
`;

const TooltipLabel = styled(DataSmall)`
	text-transform: none;
`;

const TooltipContentRow = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

const QuestionMarkIcon = styled.div`
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 50%;
	width: 12px;
	height: 12px;
	background-color: ${props => props.theme.colors.accentL1};
	margin-left: 4px;
`;

const QuestionMarkStyled = styled(QuestionMark)`
	height: 8px;
`;

const Container = styled.div`
	margin: 18px 0;
`;

const NetworkData = styled(DataSmall)`
	color: ${props => props.theme.colors.fontTertiary};
`;

const NetworkDataLabelFlex = styled(NetworkData)`
	display: flex;
	align-items: baseline;
`;

const NetworkDataRow = styled(FlexDivRow)`
	display: flex;
	align-items: center;
	margin-bottom: 8px;
`;

const ButtonEdit = styled(TextButton)`
	margin-left: 10px;
`;

export default TransactionInfo;
