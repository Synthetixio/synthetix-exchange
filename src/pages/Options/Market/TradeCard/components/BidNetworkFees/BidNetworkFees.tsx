import React, { FC } from 'react';
import { ConnectedProps, connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import Tooltip from '@material-ui/core/Tooltip';

import {
	FlexDivRow,
	GridDivRow,
	FlexDivCentered,
	FlexDiv,
	QuestionMarkIcon,
} from 'shared/commonStyles';
import { DataSmall } from 'components/Typography';

import { formatCurrencyWithSign, formatPercentage } from 'utils/formatters';
import { getTransactionPrice } from 'utils/networkUtils';

import { getEthRate, getRatesExchangeRates } from 'ducks/rates';
import { getGasInfo } from 'ducks/transaction';
import { RootState } from 'ducks/types';
import { OptionsTransaction } from 'pages/Options/types';

import { USD_SIGN } from 'constants/currency';

import { formDataCSS } from 'components/Typography/Form';
import { ReactComponent as QuestionMark } from 'assets/images/question-mark.svg';

import SelectGasMenu from 'pages/shared/components/SelectGasMenu';

const mapStateToProps = (state: RootState) => ({
	exchangeRates: getRatesExchangeRates(state),
	gasInfo: getGasInfo(state),
	ethRate: getEthRate(state),
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type NetworkFeesProps = PropsFromRedux & {
	className?: string;
	gasLimit: number | null;
	type?: OptionsTransaction['type'];
	fees: Record<string, number> | null;
	amount: string | number;
};

const NetworkFees: FC<NetworkFeesProps> = ({
	className,
	gasInfo,
	ethRate,
	gasLimit,
	fees,
	type,
	amount,
}) => {
	const { t } = useTranslation();

	const { gasPrice } = gasInfo;
	const networkFee = getTransactionPrice(gasPrice, gasLimit, ethRate);
	const bidOrRefundFee = fees
		? type === 'bid'
			? fees.creatorFee + fees.poolFee
			: fees.refundFee
		: 0;

	const totalCost = networkFee + bidOrRefundFee * Number(amount);

	const getTooltipBody = () => (
		<TooltipContent>
			<TooltipContentRow>
				<StyledFlexDiv>
					<TooltipFeeBlock>
						<TooltipLabel>{t(`options.market.trade-card.bidding.common.${type}-fee`)}</TooltipLabel>
						<TooltipLabel>{`(${formatPercentage(bidOrRefundFee, 0)})`}</TooltipLabel>
					</TooltipFeeBlock>
					<TooltipLabel>
						{formatCurrencyWithSign(USD_SIGN, bidOrRefundFee * Number(amount))}
					</TooltipLabel>
				</StyledFlexDiv>
			</TooltipContentRow>
			<TooltipContentRow>
				<TooltipLabel>{t('trade.trade-card.network-info-tooltip.network-fee')}</TooltipLabel>
				<TooltipLabel>{formatCurrencyWithSign(USD_SIGN, networkFee)}</TooltipLabel>
			</TooltipContentRow>
		</TooltipContent>
	);

	return (
		<Container className={className}>
			<FlexDivRow>
				<FlexDivCentered>
					{t(`options.market.trade-card.bidding.common.${type}-fee`)}
					<Tooltip title={getTooltipBody()} placement="bottom" arrow={true}>
						<QuestionMarkIcon>
							<QuestionMark />
						</QuestionMarkIcon>
					</Tooltip>
				</FlexDivCentered>
				<div>{formatCurrencyWithSign(USD_SIGN, totalCost)}</div>
			</FlexDivRow>
			<FlexDivRow>
				<div>{t('common.gas-price-gwei')}</div>
				<SelectGasMenu gasPrice={gasPrice} addPadding={true} />
			</FlexDivRow>
		</Container>
	);
};

export const Container = styled(GridDivRow)`
	${formDataCSS};
	color: ${(props) => props.theme.colors.fontTertiary};
	text-transform: uppercase;
	grid-gap: 8px;
	padding-bottom: 16px;
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

const StyledFlexDiv = styled(FlexDiv)`
	justify-content: space-between;
	width: 100%;
`;

const TooltipFeeBlock = styled.div`
	& > :last-child {
		margin-left: 6px;
	}
`;

export default connector(NetworkFees);
