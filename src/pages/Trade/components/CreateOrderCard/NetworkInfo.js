import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Tooltip from '@material-ui/core/Tooltip';

import { formatCurrency } from 'utils/formatters';
import { getTransactionPrice } from 'utils/networkUtils';

import { LinkTextSmall } from 'shared/commonStyles';
import { FlexDivRow } from 'shared/commonStyles';
import { media } from 'shared/media';

import GasMenu from 'pages/shared/components/GasMenu';

import DropdownPanel from 'components/DropdownPanel';
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

	const [gasDropdownIsOpen, setGasDropdownIsOpen] = useState(false);
	const setDropdownIsOpen = (isOpen) => {
		if (!isOpen && !gasDropdownIsOpen) {
			return;
		}
		setGasDropdownIsOpen(isOpen);
	};

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
					<Tooltip title={getTooltipBody()} placement="bottom" arrow={true}>
						<QuestionMarkIcon>
							<QuestionMarkStyled />
						</QuestionMarkIcon>
					</Tooltip>
				</NetworkDataLabelFlex>
				<NetworkData>${formatCurrency(exchangeFee + networkFee)}</NetworkData>
			</NetworkDataRow>
			<NetworkDataRow>
				<NetworkData>{t('common.gas-price-gwei')}</NetworkData>
				<NetworkData>
					<StyledDropdownPanel
						height="auto"
						isOpen={gasDropdownIsOpen}
						handleClose={() => setDropdownIsOpen(false)}
						width="150px"
						onHeaderClick={() => setDropdownIsOpen(!gasDropdownIsOpen)}
						header={
							<GasEditFields>
								<>{formatCurrency(gasPrice) || 0}</>
								<LinkTextSmall>{t('common.actions.edit')}</LinkTextSmall>
							</GasEditFields>
						}
						body={<GasMenu setDropdownIsOpen={setDropdownIsOpen} />}
					/>
				</NetworkData>
			</NetworkDataRow>
		</Container>
	);
};

TransactionInfo.propTypes = {
	gasPrice: PropTypes.number,
	gasLimit: PropTypes.number,
	ethRate: PropTypes.number,
};

const StyledDropdownPanel = styled(DropdownPanel)`
	${media.medium`
		width: auto;
	`}
	.body {
		border-width: 1px 1px 1px 1px;
		margin-top: 20px;
	}
`;

const GasEditFields = styled.div`
	display: flex;
	width: 75px;
	float: right;
	justify-content: space-between;
	cursor: pointer;
`;

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

const QuestionMarkIcon = styled.div`
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 50%;
	width: 12px;
	height: 12px;
	background-color: ${(props) => props.theme.colors.accentL1};
	margin-left: 4px;
`;

const QuestionMarkStyled = styled(QuestionMark)`
	height: 8px;
`;

const Container = styled.div`
	margin: 18px 0;
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
`;

export default TransactionInfo;
