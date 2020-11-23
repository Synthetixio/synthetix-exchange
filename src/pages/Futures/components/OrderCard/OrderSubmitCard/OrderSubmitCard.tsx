import React, { FC, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import styled, { css } from 'styled-components';

import { getSynthPair } from 'ducks/synths';
import {
	getGasInfo,
	createTransaction,
	updateTransaction,
	getTransactions,
} from 'ducks/transaction';
import { getRatesExchangeRates, getEthRate } from 'ducks/rates';
import { RootState } from 'ducks/types';

import Card from 'components/Card';
import Currency from 'components/Currency';
import NetworkInfo from 'components/NetworkInfo';
import { LabelSmall } from 'components/Typography';
import { ButtonPrimary } from 'components/Button';

import { getExchangeRatesForCurrencies } from 'utils/rates';
import { SYNTHS_MAP } from 'constants/currency';
import { FlexDiv } from 'shared/commonStyles';
import { MarketSummaryMap } from 'pages/Futures/types';

const mapStateToProps = (state: RootState) => ({
	synthPair: getSynthPair(state),
	gasInfo: getGasInfo(state),
	ethRate: getEthRate(state),
	exchangeRates: getRatesExchangeRates(state),
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type OrderSubmitCardProps = PropsFromRedux & {
	futureMarkets: MarketSummaryMap | null;
};

const OrderSubmitCard: FC<OrderSubmitCardProps> = ({
	synthPair,
	gasInfo,
	ethRate,
	exchangeRates,
	futureMarkets,
}) => {
	const { t } = useTranslation();
	const { base, quote } = synthPair;

	const [gasLimit, setGasLimit] = useState(gasInfo.gasLimit);
	return (
		<Card>
			<StyledCardHeader>
				<Currency.Pair
					baseCurrencyKey={base.name}
					quoteCurrencyKey={quote.name}
					showIcon={true}
					iconProps={{
						badge: futureMarkets != null ? `${futureMarkets[base.name].maxLeverage}x` : undefined,
					}}
				/>
				<StyledLabelSmall>
					{t('futures.futures-order-card.order-submit-card.heading.futures')}
				</StyledLabelSmall>
			</StyledCardHeader>
			<StyledCardBody>
				<NetworkInfo
					gasPrice={gasInfo.gasPrice}
					gasLimit={gasLimit}
					ethRate={0}
					usdRate={getExchangeRatesForCurrencies(exchangeRates, base.name, SYNTHS_MAP.sUSD)}
				/>
				<StyledFlexDiv>
					<StyledButton>{t('common.actions.submit')}</StyledButton>
					<StyledButton isCloseButton={true}>{t('common.actions.close')}</StyledButton>
				</StyledFlexDiv>
			</StyledCardBody>
		</Card>
	);
};

const StyledCardHeader = styled(Card.Header)`
	justify-content: space-between;
	align-items: center;
	background: ${(props) => props.theme.colors.accentL1};
`;

const StyledCardBody = styled(Card.Body)`
	padding-top: 0;
	background: ${(props) => props.theme.colors.surfaceL3};
`;

const StyledLabelSmall = styled(LabelSmall)`
	color: ${(props) => props.theme.colors.fontSecondary};
	margin-top: 2px;
`;

const StyledFlexDiv = styled(FlexDiv)`
	justify-content: center;
	margin-top: 16px;
`;

const StyledButton = styled(ButtonPrimary)<{ isCloseButton?: boolean }>`
	height: 40px;
	line-height: 40px;
	&:first-child {
		margin-right: 18px;
	}
	${(props) =>
		props.isCloseButton &&
		css`
			background: ${(props) => props.theme.colors.red};
			&:hover {
				background: #ef717f !important;
			}
		`}
`;

export default connector(OrderSubmitCard);
