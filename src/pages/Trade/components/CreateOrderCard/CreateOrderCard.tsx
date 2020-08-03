import React, { FC, useState, useEffect, useCallback, useMemo } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import styled from 'styled-components';
import get from 'lodash/get';
import { useTranslation } from 'react-i18next';

import snxJSConnector from 'utils/snxJSConnector';

import { ReactComponent as ReverseArrow } from 'assets/images/reverse-arrow.svg';

import Card from 'components/Card';
import NumericInputWithCurrency from 'components/Input/NumericInputWithCurrency';

import { getWalletInfo, getIsWalletConnected } from 'ducks/wallet/walletDetails';
import { getWalletBalancesMap } from 'ducks/wallet/walletBalances';
import { getSynthPair, getAvailableSynthsMap } from 'ducks/synths';
import { getRatesExchangeRates, getEthRate } from 'ducks/rates';
import { RootState } from 'ducks/types';

import {
	getGasInfo,
	createTransaction,
	updateTransaction,
	getTransactions,
} from 'ducks/transaction';

import { EMPTY_VALUE } from 'constants/placeholder';
import { BALANCE_FRACTIONS } from 'constants/order';
import { SYNTHS_MAP, CATEGORY_MAP } from 'constants/currency';
import { TRANSACTION_STATUS, OrderType } from 'constants/transaction';

import { getExchangeRatesForCurrencies } from 'utils/rates';
import { normalizeGasLimit } from 'utils/transactions';
import { GWEI_UNIT } from 'utils/networkUtils';
import errorMessages from 'utils/errorMessages';
import {
	formatCurrency,
	bytesFormatter,
	bigNumberFormatter,
	secondsToTime,
	getAddress,
	parseBytes32String,
} from 'utils/formatters';

import { Button } from 'components/Button';
import DismissableMessage from 'components/DismissableMessage';
import {
	FormInputRow,
	FormInputLabel,
	FormInputLabelSmall,
	resetButtonCSS,
	FlexDivCentered,
} from 'shared/commonStyles';

import NetworkInfo from 'components/NetworkInfo';
import { INPUT_SIZES } from 'components/Input/constants';
import { getCurrencyKeyBalance, getCurrencyKeyUSDBalanceBN } from 'utils/balances';
import { APPROVAL_EVENTS, LIMIT_ORDERS_EVENTS } from 'constants/events';
import { DELEGATE_ACTIONS } from 'constants/delegateActions';
import { BigNumberish } from 'ethers/utils';

const INPUT_DEFAULT_VALUE = '';

const mapStateToProps = (state: RootState) => ({
	synthPair: getSynthPair(state),
	walletInfo: getWalletInfo(state),
	walletBalancesMap: getWalletBalancesMap(state),
	exchangeRates: getRatesExchangeRates(state),
	gasInfo: getGasInfo(state),
	ethRate: getEthRate(state),
	transactions: getTransactions(state),
	synthsMap: getAvailableSynthsMap(state),
	isWalletConnected: getIsWalletConnected(state),
});

const mapDispatchToProps = {
	createTransaction,
	updateTransaction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type CreateOrderCardProps = PropsFromRedux;

const LIMIT_ORDERS_EXECUTION_FEE = 0;
const LIMIT_ORDERS_GAS_LIMIT = 1000000;

const CreateOrderCard: FC<CreateOrderCardProps> = ({
	synthPair,
	walletInfo: { currentWallet, walletType },
	walletBalancesMap,
	exchangeRates,
	gasInfo,
	ethRate,
	createTransaction,
	updateTransaction,
	transactions,
	synthsMap,
	isWalletConnected,
}) => {
	const { t } = useTranslation();
	const [orderType, setOrderType] = useState<OrderType>('limit');
	const [baseAmount, setBaseAmount] = useState<string>(INPUT_DEFAULT_VALUE);
	const [quoteAmount, setQuoteAmount] = useState<string>(INPUT_DEFAULT_VALUE);
	const [limitPrice, setLimitPrice] = useState<string>(INPUT_DEFAULT_VALUE);
	const [feeRate, setFeeRate] = useState<number>(0);
	const [{ base, quote }, setPair] = useState(
		synthPair.reversed ? { base: synthPair.quote, quote: synthPair.base } : synthPair
	);
	const [tradeAllBalance, setTradeAllBalance] = useState<boolean>(false);
	const [gasLimit, setGasLimit] = useState(gasInfo.gasLimit);
	const [hasSetGasLimit, setHasSetGasLimit] = useState(false);
	const [inputError, setInputError] = useState<string | null>(null);
	const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
	const [feeReclamationError, setFeeReclamationError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [hasMarketClosed, setHasMarketClosed] = useState<boolean>(false);
	const [hasDelegation, setDelegation] = useState<boolean>(false);
	const [isDelegating, setIsDelegating] = useState<boolean>(false);

	const resetInputAmounts = () => {
		setBaseAmount(INPUT_DEFAULT_VALUE);
		setQuoteAmount(INPUT_DEFAULT_VALUE);
		setLimitPrice(INPUT_DEFAULT_VALUE);
	};

	const isLimitOrder = orderType === 'limit';
	const isMarketOrder = orderType === 'market';

	const handleSwapCurrencies = () => {
		setPair({ quote: base, base: quote });
		resetInputAmounts();
	};

	const limitOrdersWeiDeposit = useMemo(() => {
		if (isLimitOrder) {
			const gwei = gasInfo.gasSpeed.fast;

			return (LIMIT_ORDERS_GAS_LIMIT * gwei) / 1e9;
		}

		return 0;
	}, [isLimitOrder, gasInfo]);

	useEffect(() => {
		if (synthPair.reversed) {
			setPair({ base: synthPair.quote, quote: synthPair.base });
		} else {
			setPair(synthPair);
		}
		resetInputAmounts();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [synthPair.base.name, synthPair.quote.name, synthPair.reversed]);

	useEffect(() => {
		const getFeeRateForExchange = async () => {
			try {
				const {
					snxJS: { Exchanger },
				} = snxJSConnector;
				const feeRateForExchange = await Exchanger.feeRateForExchange(
					bytesFormatter(quote.name),
					bytesFormatter(base.name)
				);
				setFeeRate(100 * bigNumberFormatter(feeRateForExchange));
			} catch (e) {
				console.log(e);
			}
		};
		getFeeRateForExchange();
	}, [base.name, quote.name]);

	useEffect(() => {
		const {
			snxJS: { SystemStatus },
		} = snxJSConnector;
		const getIsSuspended = async () => {
			try {
				const [baseResult, quoteResult] = await Promise.all([
					SystemStatus.synthSuspension(bytesFormatter(synthPair.base.name)),
					SystemStatus.synthSuspension(bytesFormatter(synthPair.quote.name)),
				]);
				setHasMarketClosed(baseResult.suspended || quoteResult.suspended);
			} catch (e) {
				console.log(e);
			}
		};
		if ([base.category, quote.category].includes(CATEGORY_MAP.equities)) {
			getIsSuspended();
		} else {
			setHasMarketClosed(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [base.name, quote.name]);

	const baseBalance = getCurrencyKeyBalance(walletBalancesMap, base.name) || 0;

	const quoteBalance = getCurrencyKeyBalance(walletBalancesMap, quote.name) || 0;
	const quoteBalanceBN = getCurrencyKeyUSDBalanceBN(walletBalancesMap, quote.name) || 0;

	const rate = useMemo(() => getExchangeRatesForCurrencies(exchangeRates, quote.name, base.name), [
		quote.name,
		base.name,
		exchangeRates,
	]);
	const inverseRate = 1 / rate;

	const buttonDisabled =
		!baseAmount ||
		!currentWallet ||
		inputError != null ||
		isSubmitting ||
		feeReclamationError != null;

	const isEmptyQuoteBalance = !quoteBalance;

	useEffect(() => {
		setInputError(null);
		if (!quoteAmount || !baseAmount) return;
		if (currentWallet && quoteAmount > quoteBalance) {
			setInputError(t('common.errors.amount-exceeds-balance'));
		}
	}, [t, quoteAmount, baseAmount, currentWallet, baseBalance, quoteBalance]);

	const getMaxSecsLeftInWaitingPeriod = useCallback(async () => {
		if (!currentWallet) return;
		const {
			snxJS: { Exchanger },
		} = snxJSConnector;
		try {
			const maxSecsLeftInWaitingPeriod = await Exchanger.maxSecsLeftInWaitingPeriod(
				currentWallet,
				bytesFormatter(quote.name)
			);
			const waitingPeriodInSecs = Number(maxSecsLeftInWaitingPeriod);
			if (waitingPeriodInSecs) {
				setFeeReclamationError(
					t('common.errors.fee-reclamation', {
						waitingPeriod: secondsToTime(waitingPeriodInSecs),
						currency: quote.name,
					})
				);
			} else setFeeReclamationError(null);
		} catch (e) {
			console.log(e);
			setFeeReclamationError(null);
		}
	}, [t, quote.name, currentWallet]);

	useEffect(() => {
		getMaxSecsLeftInWaitingPeriod();
	}, [getMaxSecsLeftInWaitingPeriod]);

	useEffect(() => {
		const getGasEstimate = async () => {
			const {
				snxJS: { Synthetix },
				utils,
			} = snxJSConnector;

			if (!quoteAmount || !quoteBalance || hasSetGasLimit) return;
			const amountToExchange = tradeAllBalance
				? quoteBalanceBN
				: utils.parseEther(quoteAmount.toString());

			const gasEstimate = await Synthetix.contract.estimate.exchange(
				bytesFormatter(quote.name),
				amountToExchange,
				bytesFormatter(base.name)
			);
			const rectifiedGasLimit = normalizeGasLimit(Number(gasEstimate));
			setGasLimit(rectifiedGasLimit);
			setHasSetGasLimit(true);
		};
		getGasEstimate();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [quoteAmount]);

	const setMaxBalance = () => {
		if (!isEmptyQuoteBalance) {
			setTradeAllBalance(true);
			setBaseAmount(`${Number(quoteBalance) * rate}`);
			setQuoteAmount(quoteBalance);
		}
	};

	useEffect(() => {
		resetInputAmounts();
		if (isLimitOrder) {
			setLimitPrice(`${inverseRate}`);
		}
	}, [isLimitOrder, inverseRate]);

	useEffect(() => {
		const {
			snxJS: { DelegateApprovals },
			limitOrdersContract,
		} = snxJSConnector as any;

		const getDelegation = async () => {
			const canExchange = await DelegateApprovals.canExchangeFor(
				currentWallet,
				limitOrdersContract.address
			);
			setDelegation(!!Number(canExchange));
		};

		const registerDelegationListener = () => {
			DelegateApprovals.contract.on(
				APPROVAL_EVENTS.APPROVAL,
				(authorizer: string, delegate: string, action: string) => {
					if (
						authorizer === currentWallet &&
						delegate === getAddress(limitOrdersContract.address) &&
						parseBytes32String(action) === DELEGATE_ACTIONS.EXCHANGE_FOR_ADDRESS
					) {
						setDelegation(true);
						setIsDelegating(false);
					}
				}
			);
		};
		const registerLimitOrdersEvents = () => {
			limitOrdersContract.on(
				LIMIT_ORDERS_EVENTS.ORDER,
				(
					orderId: BigNumberish,
					submitter: string,
					sourceCurrencyKey: string,
					sourceAmount: BigNumberish,
					destinationCurrencyKey: string,
					minDestinationAmount: BigNumberish,
					executionFee: BigNumberish,
					weiDeposit: BigNumberish,
					txInfo: any
				) => {
					if (submitter === currentWallet) {
						updateTransaction({ orderId: Number(orderId) }, null, txInfo.transactionHash);
					}
				}
			);
		};
		if (isWalletConnected) {
			getDelegation();
			registerDelegationListener();
			registerLimitOrdersEvents();
		}
		return () => {
			DelegateApprovals.contract.removeAllListeners(APPROVAL_EVENTS.APPROVAL);

			limitOrdersContract.removeAllListeners(LIMIT_ORDERS_EVENTS.ORDER);
		};
	}, [currentWallet, isWalletConnected, quote.name, updateTransaction]);

	const handleDelegation = async () => {
		const {
			snxJS: { DelegateApprovals },
			limitOrdersContract,
		} = snxJSConnector as any;
		// @ts-ignore

		try {
			setIsDelegating(true);
			const gasEstimate = await DelegateApprovals.contract.estimate.approveExchangeOnBehalf(
				limitOrdersContract.address
			);
			await DelegateApprovals.approveExchangeOnBehalf(limitOrdersContract.address, {
				gasLimit: normalizeGasLimit(Number(gasEstimate)),
				gasPrice: gasInfo.gasPrice * GWEI_UNIT,
			});
		} catch (e) {
			console.log(e);
			setIsDelegating(false);
		}
	};

	const handleSubmit = async () => {
		const {
			limitOrdersContract,
			snxJS: { Synthetix },
			utils,
		} = snxJSConnector;
		const limitOrdersContractWithSigner = limitOrdersContract.connect(snxJSConnector.signer);

		const transactionId = transactions.length;
		setTxErrorMessage(null);
		setIsSubmitting(true);

		try {
			const baseExchangeRateInUSD = get(exchangeRates, [base.name], 0);
			const quoteExchangeRateInUSD = get(exchangeRates, [quote.name], 0);

			const isBaseCurrencySUSD = base.name === SYNTHS_MAP.sUSD;

			const baseAmountNum = Number(baseAmount);
			const limitPriceNum = Number(limitPrice);

			const txProps = {
				id: transactionId,
				timestamp: Date.now(),
				base: base.name,
				quote: quote.name,
				fromAmount: quoteAmount,
				toAmount: baseAmount,
				orderType,
				status: TRANSACTION_STATUS.WAITING,
			};

			let tx = null;

			const amountToExchange = tradeAllBalance
				? quoteBalanceBN
				: utils.parseEther(quoteAmount.toString());

			if (orderType === 'market') {
				const gasEstimate = await Synthetix.contract.estimate.exchange(
					bytesFormatter(quote.name),
					amountToExchange,
					bytesFormatter(base.name)
				);
				const rectifiedGasLimit = normalizeGasLimit(Number(gasEstimate));

				setGasLimit(rectifiedGasLimit);

				createTransaction({
					...txProps,
					priceUSD: isBaseCurrencySUSD ? quoteExchangeRateInUSD : baseExchangeRateInUSD,
					totalUSD: baseAmountNum * baseExchangeRateInUSD,
				});

				tx = await Synthetix.exchange(
					bytesFormatter(quote.name),
					amountToExchange,
					bytesFormatter(base.name),
					{
						gasPrice: gasInfo.gasPrice * GWEI_UNIT,
						gasLimit: rectifiedGasLimit,
					}
				);
			} else {
				const executionFee = utils.parseEther(`${LIMIT_ORDERS_EXECUTION_FEE}`);
				const weiDeposit = utils.parseEther(limitOrdersWeiDeposit.toString());

				const gasEstimate = await limitOrdersContractWithSigner.estimate.newOrder(
					bytesFormatter(quote.name),
					utils.parseEther(quoteAmount),
					bytesFormatter(base.name),
					utils.parseEther(baseAmount),
					executionFee,
					{
						value: weiDeposit,
					}
				);

				const priceUSD = isBaseCurrencySUSD
					? (1 / limitPriceNum) * baseExchangeRateInUSD
					: limitPriceNum * quoteExchangeRateInUSD;

				createTransaction({
					...txProps,
					priceUSD,
					// temp orderId - ensures its unique (will be)
					orderId: Date.now(),
					totalUSD: baseAmountNum * (isBaseCurrencySUSD ? baseExchangeRateInUSD : priceUSD),
				});

				tx = await limitOrdersContractWithSigner.newOrder(
					bytesFormatter(quote.name),
					utils.parseEther(quoteAmount),
					bytesFormatter(base.name),
					utils.parseEther(baseAmount),
					executionFee,
					{
						value: weiDeposit,
						gasPrice: gasInfo.gasPrice * GWEI_UNIT,
						gasLimit: normalizeGasLimit(Number(gasEstimate)),
					}
				);
			}
			if (tx) {
				updateTransaction({ status: TRANSACTION_STATUS.PENDING, ...tx }, transactionId);
			}
			setIsSubmitting(false);
		} catch (e) {
			console.log(e);
			const error = errorMessages(e, walletType);
			updateTransaction(
				{
					status:
						error.type === 'cancelled' ? TRANSACTION_STATUS.CANCELLED : TRANSACTION_STATUS.FAILED,
					error: error.message,
				},
				transactionId
			);
			setTxErrorMessage(t('common.errors.unknown-error-try-again'));
			setIsSubmitting(false);
		}
	};
	return (
		<Card>
			<StyledCardHeader>
				<TabButton isActive={isMarketOrder} onClick={() => setOrderType('market')}>
					{t('trade.trade-card.tabs.market')}
				</TabButton>
				<TabButton isActive={isLimitOrder} onClick={() => setOrderType('limit')}>
					{t('trade.trade-card.tabs.limit')}
				</TabButton>
			</StyledCardHeader>
			<StyledCardBody isLimitOrder={isLimitOrder}>
				<FormInputRow>
					<StyledNumericInputWithCurrency
						currencyKey={quote.name}
						value={`${quoteAmount}`}
						label={
							<>
								<FormInputLabel>{t('trade.trade-card.sell-input-label')}:</FormInputLabel>
								<StyledFormInputLabelSmall
									isInteractive={!isEmptyQuoteBalance}
									onClick={setMaxBalance}
								>
									{t('common.wallet.balance-currency', {
										balance: quoteBalance
											? formatCurrency(quoteBalance)
											: walletBalancesMap != null
											? 0
											: EMPTY_VALUE,
									})}
								</StyledFormInputLabelSmall>
							</>
						}
						onChange={(_, value) => {
							setTradeAllBalance(false);
							setQuoteAmount(value);
							setBaseAmount(`${Number(value) * (isMarketOrder ? rate : 1 / Number(limitPrice))}`);
						}}
						errorMessage={inputError}
					/>
				</FormInputRow>
				{isMarketOrder && (
					<BalanceFractionRow>
						<Button palette="secondary" size="xs" onClick={handleSwapCurrencies}>
							<ReverseArrow />
						</Button>
						{BALANCE_FRACTIONS.map((fraction, id) => (
							<Button
								palette="secondary"
								size="xs"
								disabled={isEmptyQuoteBalance}
								key={`button-fraction-${id}`}
								onClick={() => {
									const balance = quoteBalance;
									const isWholeBalance = fraction === 100;
									const amount = isWholeBalance ? balance : (balance * fraction) / 100;
									setTradeAllBalance(isWholeBalance);
									setQuoteAmount(amount);
									setBaseAmount(`${Number(amount) * Number(rate)}`);
								}}
							>
								{fraction}%
							</Button>
						))}
					</BalanceFractionRow>
				)}
				{isLimitOrder && (
					<>
						<FormInputRow>
							<StyledNumericInputWithCurrency
								currencyKey={quote.name}
								value={`${limitPrice}`}
								label={<FormInputLabel>{t('common.price-label')}</FormInputLabel>}
								onChange={(_, value) => {
									setLimitPrice(value);
									if (baseAmount) {
										setBaseAmount(`${Number(quoteAmount) * (1 / Number(value))}`);
									}
								}}
							/>
						</FormInputRow>
					</>
				)}
				<FormInputRow>
					<StyledNumericInputWithCurrency
						currencyKey={base.name}
						value={`${baseAmount}`}
						label={
							<>
								<FlexDivCentered>
									<FormInputLabel>{t('trade.trade-card.buy-input-label')}:</FormInputLabel>
									{isLimitOrder && (
										<ReverseArrowButton onClick={handleSwapCurrencies}>
											<ReverseArrow />
										</ReverseArrowButton>
									)}
								</FlexDivCentered>
								<StyledFormInputLabelSmall
									isInteractive={!isEmptyQuoteBalance}
									onClick={setMaxBalance}
								>
									{t('common.wallet.balance-currency', {
										balance: baseBalance
											? formatCurrency(baseBalance)
											: walletBalancesMap != null
											? 0
											: EMPTY_VALUE,
									})}
								</StyledFormInputLabelSmall>
							</>
						}
						onChange={(_, value) => {
							setTradeAllBalance(false);
							setBaseAmount(value);
							setQuoteAmount(
								`${Number(value) * (isMarketOrder ? inverseRate : Number(limitPrice))}`
							);
						}}
					/>
				</FormInputRow>
				<NetworkInfoContainer>
					<StyledNetworkInfo
						gasPrice={gasInfo.gasPrice}
						gasLimit={gasLimit}
						ethRate={ethRate}
						exchangeFeeRate={feeRate}
						amount={Number(baseAmount)}
						usdRate={getExchangeRatesForCurrencies(exchangeRates, base.name, SYNTHS_MAP.sUSD)}
						additionalFees={
							isLimitOrder
								? [
										{
											label: t('trade.trade-card.network-info-tooltip.execution-fee'),
											fee: LIMIT_ORDERS_EXECUTION_FEE,
										},
										{
											label: t('trade.trade-card.network-info-tooltip.ether-deposit'),
											fee: limitOrdersWeiDeposit,
										},
								  ]
								: undefined
						}
					/>
				</NetworkInfoContainer>

				{hasMarketClosed ? (
					<ActionButton disabled={true}>
						{t('common.systemStatus.suspended-synths.reasons.market-closed')}
					</ActionButton>
				) : feeReclamationError ? (
					<ActionButton onClick={() => getMaxSecsLeftInWaitingPeriod()}>
						{t('trade.trade-card.retry-button')}
					</ActionButton>
				) : synthsMap[base.name].isFrozen ? (
					<ActionButton disabled={true}>{t('trade.trade-card.frozen-synth')}</ActionButton>
				) : isLimitOrder ? (
					hasDelegation ? (
						<ActionButton disabled={buttonDisabled} onClick={handleSubmit}>
							{t('trade.trade-card.confirm-trade-button')}
						</ActionButton>
					) : (
						<ActionButton disabled={isDelegating || !isWalletConnected} onClick={handleDelegation}>
							{!isDelegating
								? t('common.enable-wallet-access.label')
								: t('common.enable-wallet-access.progress-label')}
						</ActionButton>
					)
				) : (
					<ActionButton disabled={buttonDisabled} onClick={handleSubmit}>
						{t('trade.trade-card.confirm-trade-button')}
					</ActionButton>
				)}
				{txErrorMessage && (
					<TxErrorMessage
						onDismiss={() => setTxErrorMessage(null)}
						type="error"
						size="sm"
						floating={true}
					>
						{txErrorMessage}
					</TxErrorMessage>
				)}
				{feeReclamationError && (
					<TxErrorMessage
						onDismiss={() => setFeeReclamationError(null)}
						type="error"
						size="sm"
						floating={true}
					>
						{feeReclamationError}
					</TxErrorMessage>
				)}
			</StyledCardBody>
		</Card>
	);
};

const ActionButton = styled(Button).attrs({
	size: 'md',
	palette: 'primary',
})`
	width: 100%;
`;

const StyledCardHeader = styled(Card.Header)`
	padding: 0;
	> * + * {
		margin-left: 0;
	}
	display: grid;
	grid-template-columns: 1fr 1fr;
	padding: 4px;
	grid-gap: 4px;
`;

const NetworkInfoContainer = styled.div`
	padding-bottom: 20px;
`;

const StyledCardBody = styled(Card.Body)<{ isLimitOrder: boolean }>`
	padding: 12px 12px 16px 12px;
	${(props) =>
		props.isLimitOrder &&
		`
			${FormInputRow} {
				margin-bottom: 10px;
			}
			${NetworkInfoContainer} {
				padding-bottom: 0;
			}
		`}
`;

const StyledNumericInputWithCurrency = styled(NumericInputWithCurrency)`
	.input {
		height: ${INPUT_SIZES.sm};
	}
`;

export const TabButton = styled(Button).attrs({ size: 'sm', palette: 'tab' })``;

const BalanceFractionRow = styled.div`
	display: grid;
	grid-column-gap: 8px;
	grid-auto-flow: column;
	margin-bottom: 16px;
`;

const StyledFormInputLabelSmall = styled(FormInputLabelSmall)<{ isInteractive: boolean }>`
	cursor: ${(props) => (props.isInteractive ? 'pointer' : 'default')};
`;

export const TxErrorMessage = styled(DismissableMessage)`
	margin-top: 8px;
`;

const ReverseArrowButton = styled.button`
	${resetButtonCSS};
	color: ${(props) => props.theme.colors.buttonHover};
	padding-left: 49px;
	svg {
		width: 12px;
	}
`;

// TODO: This is a hacky solution to the label that breaks into 2 lines because the dropdown is not a portal yet...
const StyledNetworkInfo = styled(NetworkInfo)`
	.gas-menu-label {
		white-space: nowrap;
	}
	.gas-menu-dropdown-container {
		position: relative;
		right: 12px;
	}
`;

export default connector(CreateOrderCard);
