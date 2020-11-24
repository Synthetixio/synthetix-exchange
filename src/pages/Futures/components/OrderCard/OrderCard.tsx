import React, { FC, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import { useTranslation } from 'react-i18next';

import { getIsWalletConnected } from 'ducks/wallet/walletDetails';
import { getSynthPair } from 'ducks/synths';
import { getSynthsWalletBalances } from 'ducks/wallet/walletBalances';
import { getEthRate, getRatesExchangeRates } from 'ducks/rates';
import { getGasInfo } from 'ducks/transaction';

import { RootState } from 'ducks/types';
import { EMPTY_VALUE } from 'constants/placeholder';
import { formatCurrency } from 'utils/formatters';

import { FormInputLabel, FormInputLabelSmall, FlexDiv, FlexDivRow } from 'shared/commonStyles';

import Card from 'components/Card';
import NumericInputWithCurrency from 'components/Input/NumericInputWithCurrency';
import LeverageInput from './LeverageInput';
import OrderInfoBlock from '../OrderInfoBlock';

import { MarketSummary } from 'pages/Futures/types';
import { Button } from 'components/Button';
import NetworkInfo from 'components/NetworkInfo';
import { SYNTHS_MAP } from 'constants/currency';

import { getExchangeRatesForCurrencies } from 'utils/rates';
import { StyledCardBody, StyledCardHeader } from '../common';

const INPUT_DEFAULT_VALUE = '';
const INPUT_DEFAULT_LEVERAGE = 1;

const mapStateToProps = (state: RootState) => ({
	isWalletConnected: getIsWalletConnected(state),
	gasInfo: getGasInfo(state),
	ethRate: getEthRate(state),
	exchangeRates: getRatesExchangeRates(state),
	synthPair: getSynthPair(state),
	synthsWalletBalances: getSynthsWalletBalances(state),
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type OrderBookCardProps = PropsFromRedux & {
	futureMarket: MarketSummary | null;
};

const OrderBookCard: FC<OrderBookCardProps> = ({
	synthPair,
	isWalletConnected,
	synthsWalletBalances,
	gasInfo,
	ethRate,
	exchangeRates,
	futureMarket,
}) => {
	const { t } = useTranslation();
	const { base, quote } = synthPair;
	const [amount, setAmount] = useState(INPUT_DEFAULT_VALUE);
	const [margin, setMargin] = useState(INPUT_DEFAULT_VALUE);
	const [leverage, setLeverage] = useState(INPUT_DEFAULT_LEVERAGE);
	const [isLong, setIsLong] = useState(true);
	const [gasLimit, setGasLimit] = useState(gasInfo.gasLimit);

	const sUSDBalance =
		(synthsWalletBalances && synthsWalletBalances.find((synth) => synth.name === quote.name)) || 0;

	const setMaxSUSDBalance = () => {
		if (!sUSDBalance || !sUSDBalance.balance) return;
		setAmount(sUSDBalance.balance);
		setMargin(sUSDBalance.balance);
	};

	return (
		<StyledCard>
			<StyledCardHeader>submit/modify position</StyledCardHeader>
			<StyledCardBody>
				<FlexDivRow>
					<OrderInfoColumn>
						<NumericInputWithCurrency
							currencyKey={base.name}
							currencyIconProps={{
								badge: futureMarket != null ? `${futureMarket.maxLeverage}x` : undefined,
							}}
							value={`${amount}`}
							label={
								<FormInputLabel>
									{t('futures.futures-order-card.input-label.amount')}:
								</FormInputLabel>
							}
							onChange={(_, value) => {
								setAmount(value);
								setMargin(value);
							}}
							errorMessage={null}
							onMaxButtonClick={() => {
								setAmount('100');
								setMargin('100');
							}}
						/>

						<OrderInfoBlock
							orderData={[
								{
									label: t('futures.futures-order-card.order-info.notional-value'),
									value: '- sUSD',
								},
								{ label: t('futures.futures-order-card.order-info.pnl'), value: '- sUSD' },
							]}
						/>
					</OrderInfoColumn>
					<OrderInfoColumn>
						<NumericInputWithCurrency
							currencyKey={quote.name}
							value={`${amount}`}
							label={
								<>
									<FormInputLabel>
										{t('futures.futures-order-card.input-label.margin')}:
									</FormInputLabel>
									<StyledFormInputLabelSmall
										isInteractive={sUSDBalance}
										onClick={setMaxSUSDBalance}
									>
										{t('common.wallet.balance-currency', {
											balance: sUSDBalance
												? formatCurrency(sUSDBalance.balance)
												: !isEmpty(synthsWalletBalances)
												? 0
												: EMPTY_VALUE,
										})}
									</StyledFormInputLabelSmall>
								</>
							}
							onChange={(_, value) => {
								setAmount(value);
								setMargin(value);
							}}
							errorMessage={null}
						/>
						<OrderInfoBlock
							orderData={[
								{ label: t('futures.futures-order-card.order-info.order-price'), value: '- sUSD' },
								{
									label: t('futures.futures-order-card.order-info.liquidation-price'),
									value: '- sUSD',
								},
							]}
						/>
					</OrderInfoColumn>
					<OrderInfoColumn>
						<LeverageInput
							value={`${leverage}`}
							label={
								<>
									<FormInputLabel>
										{t('futures.futures-order-card.input-label.leverage')}:
									</FormInputLabel>
									<StyledFormInputLabel isInteractive={false}>{`${
										leverage > INPUT_DEFAULT_LEVERAGE ? leverage : INPUT_DEFAULT_LEVERAGE
									}x`}</StyledFormInputLabel>
								</>
							}
							onChange={(_, value) => {
								setLeverage(Number(value));
							}}
							isLong={isLong}
							onLongButtonClick={() => setIsLong(true)}
							onShortButtonClick={() => setIsLong(false)}
							errorMessage={null}
						/>
						<OrderInfoBlock
							orderData={[
								{
									label: t('futures.futures-order-card.order-info.daily-funding-rate'),
									value: '- sUSD',
								},
								{ label: t('futures.futures-order-card.order-info.net-funding'), value: '- sUSD' },
							]}
						/>
					</OrderInfoColumn>
					<OrderInfoColumn>
						<NetworkInfo
							gasPrice={gasInfo.gasPrice}
							gasLimit={gasLimit}
							ethRate={0}
							usdRate={getExchangeRatesForCurrencies(exchangeRates, base.name, SYNTHS_MAP.sUSD)}
						/>
						<Button size="sm" palette="primary">
							{t('common.actions.submit')}
						</Button>
						<CloseButton size="sm" palette="primary">
							{t('common.actions.close')}
						</CloseButton>
					</OrderInfoColumn>
				</FlexDivRow>
			</StyledCardBody>
		</StyledCard>
	);
};

const StyledCard = styled(Card)`
	display: flex;
	margin-left: 8px;
`;

const OrderInfoColumn = styled(FlexDiv)`
	flex-direction: column;
	flex: 1;
	margin-right: 16px;
	&:last-child {
		margin-right: 0;
		border-left: 1px solid ${(props) => props.theme.colors.accentL1};
		padding-left: 16px;
		margin-left: 4px;
	}
`;

const StyledFormInputLabel = styled(FormInputLabel)<{ isInteractive: boolean }>`
	cursor: ${(props) => (props.isInteractive ? 'pointer' : 'default')};
	text-transform: none;
	font-family: ${(props) => props.theme.fonts.bold};
`;

const StyledFormInputLabelSmall = styled(FormInputLabelSmall)<{ isInteractive: boolean }>`
	cursor: ${(props) => (props.isInteractive ? 'pointer' : 'default')};
`;

const CloseButton = styled(Button)`
	margin-top: 12px;
	background: ${(props) => props.theme.colors.red};
	&:hover {
		background: #ef717f !important;
	}
`;

export default connector(OrderBookCard);
