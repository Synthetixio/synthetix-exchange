import React, { FC, useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import { useTranslation } from 'react-i18next';

import { getCurrentWalletAddress } from 'ducks/wallet/walletDetails';
import { getSynthPair } from 'ducks/synths';
import {
	fetchWalletBalancesRequest,
	getSynthsWalletBalances,
	getWalletBalancesMap,
} from 'ducks/wallet/walletBalances';
import { getEthRate, getRatesExchangeRates } from 'ducks/rates';
import { getGasInfo } from 'ducks/transaction';

import { RootState } from 'ducks/types';
import { EMPTY_VALUE } from 'constants/placeholder';
import { formatCurrency } from 'utils/formatters';
import TxErrorMessage from 'components/TxErrorMessage';

import {
	FormInputLabel,
	FormInputLabelSmall,
	FlexDiv,
	FlexDivRow,
	TextButton,
} from 'shared/commonStyles';

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
import snxJSConnector from 'utils/snxJSConnector';
import { GWEI_UNIT } from 'utils/networkUtils';
import { normalizeGasLimit } from 'utils/transactions';
import { ethers } from 'ethers';
import { getExchangeRatesForCurrencies } from 'utils/rates';
import { BigNumberish, formatEther } from 'ethers/utils';

const INPUT_DEFAULT_VALUE = '';
const INPUT_DEFAULT_LEVERAGE = 1;

const mapStateToProps = (state: RootState) => ({
	currentWalletAddress: getCurrentWalletAddress(state),
	gasInfo: getGasInfo(state),
	ethRate: getEthRate(state),
	exchangeRates: getRatesExchangeRates(state),
	synthPair: getSynthPair(state),
	synthsWalletBalances: getSynthsWalletBalances(state),
	walletBalancesMap: getWalletBalancesMap(state),
});

const mapDispatchToProps = {
	fetchWalletBalancesRequest,
};

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
	currentWalletAddress,
	synthsWalletBalances,
	gasInfo,
	ethRate,
	exchangeRates,
	futureMarket,
	futureMarketDetails,
	walletBalancesMap,
	refetchMarketAndPosition,
	fetchWalletBalancesRequest,
	positionDetails,
}) => {
	const { t } = useTranslation();
	const { base, quote } = synthPair;
	const [amount, setAmount] = useState(INPUT_DEFAULT_VALUE);
	const [margin, setMargin] = useState(INPUT_DEFAULT_VALUE);
	const [leverage, setLeverage] = useState(INPUT_DEFAULT_LEVERAGE);
	const [isLong, setIsLong] = useState(true);
	const [gasLimit, setGasLimit] = useState(gasInfo.gasLimit);
	const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [isClosingPosition, setIsClosingPosition] = useState<boolean>(false);
	const [isCancellingOrder, setIsCancellingOrder] = useState<boolean>(false);
	const [orderFee, setOrderFee] = useState<number>(0);

	const sUSDBalance = getCurrencyKeyBalance(walletBalancesMap, SYNTHS_MAP.sUSD) || 0;
	// const assetPriceInUSD = futureMarket?.price ?? 0;
	const assetPriceInUSD = getExchangeRatesForCurrencies(exchangeRates, quote.name, base.name);

	const amountNum = Number(amount);
	const marginNum = Number(margin);

	const isValidLeverage =
		futureMarketDetails != null
			? leverage >= 1 && leverage <= futureMarketDetails.limits.maxLeverage
			: false;

	const insufficientBalance = margin > sUSDBalance;

	const isSubmissionDisabled =
		!isValidLeverage || !marginNum || marginNum <= 0 || isSubmitting || insufficientBalance;

	const getFuturesMarketContract = () => {
		const { snxJS } = snxJSConnector as any;

		return snxJS[`FuturesMarket${base.asset.toUpperCase()}`];
	};

	useEffect(() => {
		setAmount(INPUT_DEFAULT_VALUE);
		setMargin(INPUT_DEFAULT_VALUE);
		setLeverage(INPUT_DEFAULT_LEVERAGE);
	}, [synthPair.base, synthPair.quote]);

	useEffect(() => {
		const calcOrderFee = async () => {
			const FuturesMarketContract = getFuturesMarketContract();
			try {
				const {
					utils: { parseEther },
				} = snxJSConnector as any;

				const fee = (await FuturesMarketContract.contract.orderFee(
					currentWalletAddress,
					parseEther(!isLong ? (Number(margin) * -1).toString() : margin),
					parseEther(leverage.toString())
				)) as BigNumberish;

				setOrderFee(Number(formatEther(fee)));
			} catch (e) {
				console.log(e);
			}
		};
		if (margin && leverage && currentWalletAddress) {
			calcOrderFee();
		}
		// eslint-disable-next-line
	}, [amount, margin, leverage, currentWalletAddress, isLong]);

	const setMaxSUSDBalance = () => {
		setMargin(`${sUSDBalance}`);
		setAmount(`${sUSDBalance / assetPriceInUSD}`);
	};

	const handleCancelOrder = async () => {
		try {
			setIsCancellingOrder(true);

			const FuturesMarketContract = getFuturesMarketContract();

			const gasEstimate = await FuturesMarketContract.contract.estimate.cancelOrder();
			const updatedGasEstimate = normalizeGasLimit(Number(gasEstimate));

			setGasLimit(updatedGasEstimate);

			const tx = (await FuturesMarketContract.cancelOrder({
				gasPrice: gasInfo.gasPrice * GWEI_UNIT,
				gasLimit: updatedGasEstimate,
			})) as ethers.ContractTransaction;

			const txResult = await tx.wait();
			if (txResult && txResult.transactionHash) {
				refetchMarketAndPosition();
			}
		} catch (e) {
			console.log(e);
		} finally {
			setIsCancellingOrder(false);
		}
	};

	const handleSubmitOrder = async () => {
		try {
			const {
				utils: { parseEther },
			} = snxJSConnector as any;

			setTxErrorMessage(null);
			setIsSubmitting(true);

			const FuturesMarketContract = getFuturesMarketContract();
			const params = [
				parseEther(!isLong ? (Number(margin) * -1).toString() : margin),
				parseEther(leverage.toString()),
			];

			const gasEstimate = await FuturesMarketContract.contract.estimate.submitOrder(...params);
			const updatedGasEstimate = normalizeGasLimit(Number(gasEstimate));

			setGasLimit(updatedGasEstimate);

			const tx = (await FuturesMarketContract.submitOrder(...params, {
				gasPrice: gasInfo.gasPrice * GWEI_UNIT,
				gasLimit: updatedGasEstimate,
			})) as ethers.ContractTransaction;

			const txResult = await tx.wait();
			if (txResult && txResult.transactionHash) {
				fetchWalletBalancesRequest();
				refetchMarketAndPosition();
			}
		} catch (e) {
			console.log(e);
			setTxErrorMessage(t('common.errors.unknown-error-try-again'));
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleClosePosition = async () => {
		try {
			setTxErrorMessage(null);
			setIsClosingPosition(true);

			const FuturesMarketContract = getFuturesMarketContract();

			const gasEstimate = await FuturesMarketContract.contract.estimate.closePosition();
			const updatedGasEstimate = normalizeGasLimit(Number(gasEstimate));

			setGasLimit(updatedGasEstimate);

			const tx = await FuturesMarketContract.closePosition({
				gasPrice: gasInfo.gasPrice * GWEI_UNIT,
				gasLimit: updatedGasEstimate,
			});

			const txResult = await tx.wait();
			if (txResult && txResult.transactionHash) {
				fetchWalletBalancesRequest();
				refetchMarketAndPosition();
			}
		} catch (e) {
			console.log(e);
			setTxErrorMessage(t('common.errors.unknown-error-try-again'));
		} finally {
			setIsClosingPosition(false);
		}
	};

	useEffect(() => {
		const FuturesMarketContract = getFuturesMarketContract();

		const setEventListeners = () => {
			FuturesMarketContract.contract.on(
				'OrderSubmitted',
				(address: string, _margin: number, _leverage: number, _fee: number, _roundId: number) => {
					if (address === currentWalletAddress) {
						refetchMarketAndPosition();
					}
				}
			);
			FuturesMarketContract.contract.on(
				'OrderConfirmed',
				(
					address: string,
					_margin: number,
					_size: number,
					_fee: number,
					_entryPrice: number,
					_entryIndex: number
				) => {
					if (address === currentWalletAddress) {
						refetchMarketAndPosition();
					}
				}
			);
			FuturesMarketContract.contract.on('OrderCancelled', (address: string) => {
				if (address === currentWalletAddress) {
					refetchMarketAndPosition();
				}
			});
		};
		setEventListeners();

		return () => {
			FuturesMarketContract.contract.removeAllListeners('OrderSubmitted');
			FuturesMarketContract.contract.removeAllListeners('OrderConfirmed');
			FuturesMarketContract.contract.removeAllListeners('OrderCancelled');
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<StyledCard>
			<StyledCardHeader>
				submit/modify position{' '}
				{positionDetails != null && positionDetails.hasOrderOrPosition ? (
					<>
						{positionDetails.hasOpenOrder && (
							<>
								<HeaderLabel>pending</HeaderLabel>
								<CancelOrderButton onClick={handleCancelOrder}>
									{isCancellingOrder ? 'cancelling...' : 'cancel'}
								</CancelOrderButton>
							</>
						)}
						{positionDetails.hasConfirmedOrder && <HeaderLabel>confirmed</HeaderLabel>}
					</>
				) : null}{' '}
			</StyledCardHeader>
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
										positionDetails != null && positionDetails.hasConfirmedOrder
											? `${formatCurrency(positionDetails.notionalValue)} ${SYNTHS_MAP.sUSD}`
											: `- ${SYNTHS_MAP.sUSD}`,
								},
								{
									label: t('futures.futures-order-card.order-info.pnl'),
									value:
										positionDetails != null && positionDetails.hasConfirmedOrder
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
							errorMessage={insufficientBalance && 'Amount exceeds balance'}
						/>
						<OrderInfoBlock
							orderData={[
								{
									label: t('futures.futures-order-card.order-info.order-price'),
									value:
										positionDetails != null && positionDetails.hasConfirmedOrder
											? `${formatCurrency(positionDetails.position.entryPrice)} ${SYNTHS_MAP.sUSD}`
											: `- ${SYNTHS_MAP.sUSD}`,
								},
								{
									label: t('futures.futures-order-card.order-info.liquidation-price'),
									value:
										positionDetails != null && positionDetails.hasConfirmedOrder
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
							errorMessage={
								!isValidLeverage &&
								futureMarketDetails &&
								`Leverage should be between 1-${futureMarketDetails.limits.maxLeverage}`
							}
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
										positionDetails != null && positionDetails.hasConfirmedOrder
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
							orderFee={orderFee}
						/>
						<Button
							size="sm"
							palette="primary"
							disabled={isSubmissionDisabled}
							onClick={handleSubmitOrder}
						>
							{isSubmitting ? 'submitting...' : t('common.actions.submit')}
						</Button>
						<CloseButton
							size="sm"
							palette="primary"
							disabled={positionDetails != null ? !positionDetails.hasPosition : true}
							onClick={handleClosePosition}
						>
							{isClosingPosition ? 'closing...' : t('common.actions.close')}
						</CloseButton>
						{txErrorMessage && (
							<TxErrorMessage onDismiss={() => setTxErrorMessage(null)}>
								{txErrorMessage}
							</TxErrorMessage>
						)}
					</OrderInfoColumn>
				</FlexDivRow>
			</StyledCardBody>
		</StyledCard>
	);
};

const HeaderLabel = styled.span`
	color: ${(props) => props.theme.colors.fontSecondary};
	font-size: 10px;
	text-transform: uppercase;
	border-radius: 100px;
	background: ${(props) => props.theme.colors.accentL2};
	margin-left: 8px;
	text-align: center;
	font-family: ${(props) => props.theme.fonts.medium};
	height: 20px;
	padding: 5px 10px;
`;

const CancelOrderButton = styled(TextButton)`
	color: ${(props) => props.theme.colors.red};
	font-family: ${(props) => props.theme.fonts.medium};
	font-size: 12px;
	margin-left: 16px;
	text-transform: uppercase;
`;

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
