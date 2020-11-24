import React, { FC, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import { useTranslation } from 'react-i18next';

import { getIsWalletConnected } from 'ducks/wallet/walletDetails';
import { getSynthPair } from 'ducks/synths';
import { getSynthsWalletBalances, getWalletBalancesMap } from 'ducks/wallet/walletBalances';
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

import { MarketDetails, MarketSummary, PositionDetails } from 'pages/Futures/types';
import { Button } from 'components/Button';
import NetworkInfo from 'components/NetworkInfo';
import { SYNTHS_MAP } from 'constants/currency';

import { StyledCardBody, StyledCardHeader } from '../common';
import { getCurrencyKeyBalance } from 'utils/balances';

const INPUT_DEFAULT_VALUE = '';
const INPUT_DEFAULT_LEVERAGE = 1;

const mapStateToProps = (state: RootState) => ({
	isWalletConnected: getIsWalletConnected(state),
	gasInfo: getGasInfo(state),
	ethRate: getEthRate(state),
	exchangeRates: getRatesExchangeRates(state),
	synthPair: getSynthPair(state),
	synthsWalletBalances: getSynthsWalletBalances(state),
	walletBalancesMap: getWalletBalancesMap(state),
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type OrderBookCardProps = PropsFromRedux & {
	futureMarket: MarketSummary | null;
	futureMarketDetails: MarketDetails | null;
	positionDetails: PositionDetails | null;
	refetchMarketAndPosition: () => void;
};

const OrderBookCard: FC<OrderBookCardProps> = ({
	synthPair,
	isWalletConnected,
	synthsWalletBalances,
	gasInfo,
	ethRate,
	exchangeRates,
	futureMarket,
	futureMarketDetails,
	walletBalancesMap,
	refetchMarketAndPosition,
	positionDetails,
}) => {
	const { t } = useTranslation();
	const { base, quote } = synthPair;
	const [amount, setAmount] = useState(INPUT_DEFAULT_VALUE);
	const [margin, setMargin] = useState(INPUT_DEFAULT_VALUE);
	const [leverage, setLeverage] = useState(INPUT_DEFAULT_LEVERAGE);
	const [isLong, setIsLong] = useState(true);
	const [gasLimit, setGasLimit] = useState(gasInfo.gasLimit);

	const sUSDBalance = getCurrencyKeyBalance(walletBalancesMap, SYNTHS_MAP.sUSD) || 0;
	const assetPriceInUSD = futureMarket?.price ?? 0;

	const amountNum = Number(amount);
	const marginNum = Number(margin);

	const setMaxSUSDBalance = () => {
		setMargin(`${sUSDBalance}`);
		setAmount(`${sUSDBalance / assetPriceInUSD}`);
	};

	const isValidLeverage =
		futureMarketDetails != null
			? leverage >= 1 && leverage <= futureMarketDetails.limits.maxLeverage
			: false;

	const isSubmissionDisabled = !isValidLeverage || !marginNum || marginNum <= 0;

	return (
		<StyledCard>
			<StyledCardHeader>submit/modify position</StyledCardHeader>
			<StyledCardBody>
				<FlexDivRow>
					<OrderInfoColumn>
						<NumericInputWithCurrency
							currencyKey={base.name}
							currencyIconProps={{
								badge:
									futureMarketDetails != null
										? `${futureMarketDetails.limits.maxLeverage}x`
										: undefined,
							}}
							value={amount}
							label={
								<FormInputLabel>
									{t('futures.futures-order-card.input-label.amount')}:
								</FormInputLabel>
							}
							onChange={(_, value) => {
								setAmount(value);
								setMargin(`${Number(value) * assetPriceInUSD}`);
							}}
							errorMessage={null}
							onMaxButtonClick={setMaxSUSDBalance}
						/>

						<OrderInfoBlock
							orderData={[
								{
									label: t('futures.futures-order-card.order-info.notional-value'),
									value:
										positionDetails != null && positionDetails.hasPosition
											? `${formatCurrency(positionDetails.notionalValue)} ${SYNTHS_MAP.sUSD}`
											: `- ${SYNTHS_MAP.sUSD}`,
								},
								{
									label: t('futures.futures-order-card.order-info.pnl'),
									value:
										positionDetails != null && positionDetails.hasPosition
											? `${formatCurrency(positionDetails.profitLoss)} ${SYNTHS_MAP.sUSD}`
											: `- ${SYNTHS_MAP.sUSD}`,
								},
							]}
						/>
					</OrderInfoColumn>
					<OrderInfoColumn>
						<NumericInputWithCurrency
							currencyKey={quote.name}
							value={margin}
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
												? formatCurrency(sUSDBalance)
												: !isEmpty(synthsWalletBalances)
												? 0
												: EMPTY_VALUE,
										})}
									</StyledFormInputLabelSmall>
								</>
							}
							onChange={(_, value) => {
								setMargin(value);
								setAmount(`${Number(value) / assetPriceInUSD}`);
							}}
							errorMessage={null}
						/>
						<OrderInfoBlock
							orderData={[
								{
									label: t('futures.futures-order-card.order-info.order-price'),
									value:
										positionDetails != null && positionDetails.hasPosition
											? `${formatCurrency(positionDetails.position.entryPrice)} ${SYNTHS_MAP.sUSD}`
											: `- ${SYNTHS_MAP.sUSD}`,
								},
								{
									label: t('futures.futures-order-card.order-info.liquidation-price'),
									value:
										positionDetails != null && positionDetails.hasPosition
											? `${formatCurrency(positionDetails.liquidationPrice)} ${SYNTHS_MAP.sUSD}`
											: `- ${SYNTHS_MAP.sUSD}`,
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
									value:
										futureMarket != null
											? `${futureMarket.currentFundingRate} bps`
											: `- ${SYNTHS_MAP.sUSD}`,
								},
								{
									label: t('futures.futures-order-card.order-info.net-funding'),
									value:
										positionDetails != null && positionDetails.hasPosition
											? `${formatCurrency(positionDetails.accruedFunding)} ${SYNTHS_MAP.sUSD}`
											: `- ${SYNTHS_MAP.sUSD}`,
								},
							]}
						/>
					</OrderInfoColumn>
					<OrderInfoColumn>
						<NetworkInfo
							gasPrice={gasInfo.gasPrice}
							gasLimit={gasLimit}
							ethRate={ethRate ?? 0}
							usdRate={assetPriceInUSD}
							amount={amountNum}
						/>
						<Button size="sm" palette="primary" disabled={isSubmissionDisabled}>
							{t('common.actions.submit')}
						</Button>
						<CloseButton
							size="sm"
							palette="primary"
							disabled={positionDetails != null ? !positionDetails.hasPosition : true}
						>
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
	flex-grow: 1;
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
	&:hover:not(:disabled) {
		background: #ef717f !important;
	}
`;

export default connector(OrderBookCard);
