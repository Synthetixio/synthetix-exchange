import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useMediaQuery } from 'react-responsive';

import { formatCurrency } from 'src/utils/formatters';
import { getTransactionPrice } from 'src/utils/networkUtils';

import { FlexDivRow } from 'src/shared/commonStyles';

import { DataSmall } from 'src/components/Typography';
import { ReactComponent as QuestionMark } from 'src/assets/images/question-mark.svg';
import Tooltip from './Tooltip';
import { formatPercentage } from 'src/utils/formatters';

import { mediumMediaQuery } from 'src/shared/media';

import { TooltipContent, TooltipContentRow, TooltipLabel } from './common';

export const TransactionInfo = ({
	gasPrice,
	gasLimit,
	ethRate = 0,
	usdRate = 0,
	amount = 0,
	exchangeFeeRate = 0,
	lastPrice,
}) => {
	const { t } = useTranslation();
	const usdValue = amount * usdRate;
	const exchangeFee = ((amount * exchangeFeeRate) / 100) * usdRate;
	const networkFee = getTransactionPrice(gasPrice, gasLimit, ethRate);

	const isTabletOrMobile = useMediaQuery({ query: mediumMediaQuery });

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
					<Tooltip title={getTooltipBody()}>
						<QuestionMarkIcon>
							<QuestionMarkStyled />
						</QuestionMarkIcon>
					</Tooltip>
				</NetworkDataLabelFlex>
				<NetworkData>${formatCurrency(exchangeFee + networkFee)}</NetworkData>
			</NetworkDataRow>
			{isTabletOrMobile && (
				<NetworkDataRow>
					<NetworkData>Price</NetworkData>
					<NetworkData>{lastPrice}</NetworkData>
				</NetworkDataRow>
			)}
		</Container>
	);
};

TransactionInfo.propTypes = {
	gasPrice: PropTypes.number,
	gasLimit: PropTypes.number,
	ethRate: PropTypes.number,
	onEditButtonClick: PropTypes.func.isRequired,
};

const QuestionMarkIcon = styled.div`
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 50%;
	width: 12px;
	height: 12px;
	background: ${props => props.theme.colors.accentL1};
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

export default TransactionInfo;
