import React, { FC, memo } from 'react';
import { ConnectedProps, connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { TextButton, FlexDivRow, GridDivRow } from 'shared/commonStyles';

import { formatCurrencyWithSign } from 'utils/formatters';
import { getTransactionPrice } from 'utils/networkUtils';

import { toggleGweiPopup } from 'ducks/ui';
import { getEthRate, getRatesExchangeRates } from 'ducks/rates';
import { getGasInfo } from 'ducks/transaction';
import { RootState } from 'ducks/types';

import { USD_SIGN } from 'constants/currency';

import { formDataCSS } from 'components/Typography/Form';

const mapStateToProps = (state: RootState) => ({
	exchangeRates: getRatesExchangeRates(state),
	gasInfo: getGasInfo(state),
	ethRate: getEthRate(state),
});

const mapDispatchToProps = {
	toggleGweiPopup,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type NetworkFeesProps = PropsFromRedux & {
	className?: string;
	gasLimit: number | null;
};

const NetworkFees: FC<NetworkFeesProps> = memo(
	({ className, toggleGweiPopup, gasInfo, ethRate, gasLimit }) => {
		const { t } = useTranslation();

		const { gasPrice } = gasInfo;

		return (
			<Container className={className}>
				<FlexDivRow>
					<div>{t('common.network-fee-gas')}</div>
					<div>
						{formatCurrencyWithSign(USD_SIGN, getTransactionPrice(gasPrice, gasLimit, ethRate))}
					</div>
				</FlexDivRow>
				<FlexDivRow>
					<div>{t('common.gas-price-gwei')}</div>
					<div>
						{gasPrice || 0}
						<ButtonEdit onClick={() => toggleGweiPopup(true)}>
							{t('common.actions.edit')}
						</ButtonEdit>
					</div>
				</FlexDivRow>
			</Container>
		);
	}
);

export const Container = styled(GridDivRow)`
	${formDataCSS};
	color: ${(props) => props.theme.colors.fontTertiary};
	text-transform: uppercase;
	grid-gap: 8px;
	padding-bottom: 16px;
`;

export const ButtonEdit = styled(TextButton)`
	${formDataCSS};
	margin-left: 10px;
	color: ${(props) => props.theme.colors.hyperlink};
	text-transform: uppercase;
`;

export default connector(NetworkFees);
