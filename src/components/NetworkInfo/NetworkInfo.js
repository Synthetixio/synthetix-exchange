import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Tooltip from '@material-ui/core/Tooltip';

import { formatCurrency } from 'utils/formatters';
import { getTransactionPrice } from 'utils/networkUtils';

import { FlexDivRow, QuestionMarkIcon } from 'shared/commonStyles';

import SelectGasMenu from 'pages/shared/components/SelectGasMenu';

import { DataSmall } from 'components/Typography';

import { ReactComponent as QuestionMark } from 'assets/images/question-mark.svg';
import { formatPercentage } from 'utils/formatters';

export const TransactionInfo = ({
	gasPrice,
	gasLimit,
	ethRate = 0,
	usdRate = 0,
	amount = 0,
	exchangeFeeRate = 0,
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
				<NetworkDataLabelFlex>
					{t('trade.trade-card.network-info.fee')}
					<Tooltip title={getTooltipBody()} placement="bottom" arrow={true}>
						<QuestionMarkIcon>
							<QuestionMark />
						</QuestionMarkIcon>
					</Tooltip>
				</NetworkDataLabelFlex>
				<NetworkData>${formatCurrency(exchangeFee + networkFee)}</NetworkData>
			</NetworkDataRow>
			<NetworkDataRow>
				<NetworkData>$ Value:</NetworkData>
				<NetworkData>${formatCurrency(usdValue) || 0}</NetworkData>
			</NetworkDataRow>
			<NetworkDataRow>
				<NetworkData>Gas (GWEI)</NetworkData>
				<NetworkDataGasMenu>
					<SelectGasMenu gasPrice={gasPrice} />
				</NetworkDataGasMenu>
			</NetworkDataRow>
		</Container>
	);
};

TransactionInfo.propTypes = {
	gasPrice: PropTypes.number,
	gasLimit: PropTypes.number,
	ethRate: PropTypes.number,
};

const TooltipContent = styled.div`
	width: 200px;
	padding: 2px;
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

const Container = styled.div`
	padding-bottom: 25px;
`;

const NetworkData = styled(DataSmall)`
	color: ${(props) => props.theme.colors.fontTertiary};
`;

const NetworkDataLabelFlex = styled(NetworkData)`
	display: flex;
	align-items: baseline;
`;

const NetworkDataRow = styled(FlexDivRow)`
	display: flex;
	align-items: center;
	margin-bottom: 8px;
	position: relative;
`;

const NetworkDataGasMenu = styled(NetworkData)`
	position: absolute;
	right: 0;
`;

export default TransactionInfo;
