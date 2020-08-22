import React, { FC } from 'react';
import { ConnectedProps, connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { FlexDivRow, GridDivRow } from 'shared/commonStyles';

import { formatCurrencyWithSign } from 'utils/formatters';
import { getTransactionPrice } from 'utils/networkUtils';

import { getEthRate, getRatesExchangeRates } from 'ducks/rates';
import { getGasInfo } from 'ducks/transaction';
import { RootState } from 'ducks/types';

import { USD_SIGN } from 'constants/currency';

import { formDataCSS } from 'components/Typography/Form';

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
};

const NetworkFees: FC<NetworkFeesProps> = ({ className, gasInfo, ethRate, gasLimit }) => {
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

export default connector(NetworkFees);
