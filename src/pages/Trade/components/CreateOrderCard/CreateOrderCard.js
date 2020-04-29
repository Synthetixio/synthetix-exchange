import React, { useState, useEffect, useContext, useCallback } from 'react';
import { connect } from 'react-redux';
import styled, { ThemeContext } from 'styled-components';
import { useTranslation } from 'react-i18next';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import { ReactComponent as CloseIcon } from 'src/assets/images/close.svg';
import { ReactComponent as ArrowLinkIcon } from 'src/assets/images/l2/link-arrow.svg';

import snxJSConnector from 'src/utils/snxJSConnector';

import Card from 'src/components/Card';
import { TradeInput } from 'src/components/Input';
import Link from 'src/components/Link';

import { getWalletInfo } from 'src/ducks/wallet/walletDetails';
import { getSynthsWalletBalances } from 'src/ducks/wallet/walletBalances';
import { getSynthPair } from 'src/ducks/synths';
import { getRatesExchangeRates, getEthRate } from 'src/ducks/rates';
import { getAvailableSynthsMap } from 'src/ducks/synths';
import { fetchWalletBalancesRequest } from 'src/ducks/wallet/walletBalances';

import {
	getExchangeFeeRate,
	getGasInfo,
	createTransaction,
	updateTransaction,
	getTransactions,
} from 'src/ducks/transaction';
import {
	toggleGweiPopup,
	setOvmTradeTooltipVisible,
	getOvmTradeTooltipVisible,
	getSeenTradeTooltipVisible,
} from 'src/ducks/ui';

import { EMPTY_VALUE } from 'src/constants/placeholder';
import { BALANCE_FRACTIONS } from 'src/constants/order';
import { SYNTHS_MAP } from 'src/constants/currency';
import { TRANSACTION_STATUS } from 'src/constants/transaction';

import { getExchangeRatesForCurrencies } from 'src/utils/rates';
import { normalizeGasLimit } from 'src/utils/transactions';
import { GWEI_UNIT } from 'src/utils/networkUtils';
import errorMessages from 'src/utils/errorMessages';
import {
	formatCurrency,
	bytesFormatter,
	bigNumberFormatter,
	secondsToTime,
	formatCurrencyWithSign,
} from 'src/utils/formatters';

import { HeadingSmall, DataSmall } from 'src/components/Typography';
import { ButtonFilter, ButtonPrimary } from 'src/components/Button';
import DismissableMessage from 'src/components/DismissableMessage';
import { FormInputRow, FormInputLabel, FormInputLabelSmall } from 'src/shared/commonStyles';

import { ReactComponent as ReverseArrow } from 'src/assets/images/reverse-arrow.svg';
import NetworkInfo from './NetworkInfo';
import Tooltip from './Tooltip';
import { TooltipContent, TooltipContentRow, TooltipLabel } from './common';

import { media } from 'src/shared/media';

const INPUT_DEFAULT_VALUE = '';

const CONFIRM_TRADE_BUTTON_RATE_LIMIT_MS = 400;

const CreateOrderCard = ({
	synthPair,
	walletInfo: { currentWallet, walletType },
	synthsWalletBalances,
	exchangeRates,
	exchangeFeeRate,
	gasInfo,
	ethRate,
	toggleGweiPopup,
	createTransaction,
	updateTransaction,
	transactions,
	synthsMap,
	ovmTradeTooltipVisible,
	setOvmTradeTooltipVisible,
	fetchWalletBalancesRequest,
	seenTradeTooltipVisible,
}) => {
	const { t } = useTranslation();
	const { colors } = useContext(ThemeContext);
	const [baseAmount, setBaseAmount] = useState(INPUT_DEFAULT_VALUE);
	const [quoteAmount, setQuoteAmount] = useState(INPUT_DEFAULT_VALUE);
	const [feeRate, setFeeRate] = useState(exchangeFeeRate);
	const [{ base, quote }, setPair] = useState(synthPair);
	const [tradeAllBalance, setTradeAllBalance] = useState(false);
	const [gasLimit, setGasLimit] = useState(gasInfo.gasLimit);
	const [inputError, setInputError] = useState(null);
	const [txErrorMessage, setTxErrorMessage] = useState(null);
	const [feeReclamationError, setFeeReclamationError] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [confirmTradeButtonRateLimited, setConfirmTradeButtonRateLimited] = useState(false);

	const resetInputAmounts = () => {
		setBaseAmount(INPUT_DEFAULT_VALUE);
		setQuoteAmount(INPUT_DEFAULT_VALUE);
	};

	const showGweiPopup = () => toggleGweiPopup(true);

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
				setFeeRate(exchangeFeeRate);
				console.log(e);
			}
		};
		setPair(synthPair);
		resetInputAmounts();
		getFeeRateForExchange();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [synthPair.base.name, synthPair.quote.name]);

	const baseBalance =
		(synthsWalletBalances && synthsWalletBalances.find(synth => synth.name === base.name)) || 0;
	const quoteBalance =
		(synthsWalletBalances && synthsWalletBalances.find(synth => synth.name === quote.name)) || 0;

	const rate = getExchangeRatesForCurrencies(exchangeRates, quote.name, base.name);
	const inverseRate = getExchangeRatesForCurrencies(exchangeRates, base.name, quote.name);

	const buttonDisabled =
		!baseAmount ||
		!currentWallet ||
		inputError ||
		isSubmitting ||
		feeReclamationError ||
		baseAmount > quoteBalance ||
		confirmTradeButtonRateLimited;

	useEffect(() => {
		setInputError(null);
		if (!quoteAmount || !baseAmount) return;
		if (currentWallet && quoteAmount > quoteBalance.balance) {
			setInputError(t('common.errors.amount-exceeds-balance'));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [quoteAmount, baseAmount, currentWallet, baseBalance, quoteBalance]);

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [quote.name, currentWallet, quoteAmount]);

	useEffect(() => {
		getMaxSecsLeftInWaitingPeriod();
	}, [getMaxSecsLeftInWaitingPeriod]);

	const handleSubmit = async () => {
		const {
			snxJS: { Synthetix },
			utils,
		} = snxJSConnector;
		const transactionId = transactions.length;
		setOvmTradeTooltipVisible(false);
		setTxErrorMessage(null);
		setIsSubmitting(true);
		try {
			const amountToExchange = tradeAllBalance
				? quoteBalance.balanceBN
				: utils.parseEther(quoteAmount.toString());

			const gasEstimate = await Synthetix.contract.estimate.exchange(
				bytesFormatter(quote.name),
				amountToExchange,
				bytesFormatter(base.name)
			);
			const rectifiedGasLimit = normalizeGasLimit(Number(gasEstimate));

			setGasLimit(rectifiedGasLimit);

			createTransaction({
				id: transactionId,
				date: new Date(),
				base: base.name,
				quote: quote.name,
				fromAmount: quoteAmount,
				toAmount: baseAmount,
				price:
					base.name === SYNTHS_MAP.sUSD
						? getExchangeRatesForCurrencies(exchangeRates, quote.name, base.name)
						: getExchangeRatesForCurrencies(exchangeRates, base.name, quote.name),
				amount: formatCurrency(baseAmount),
				priceUSD:
					base.name === SYNTHS_MAP.sUSD
						? getExchangeRatesForCurrencies(exchangeRates, quote.name, SYNTHS_MAP.sUSD)
						: getExchangeRatesForCurrencies(exchangeRates, base.name, SYNTHS_MAP.sUSD),
				totalUSD: formatCurrency(
					baseAmount * getExchangeRatesForCurrencies(exchangeRates, base.name, SYNTHS_MAP.sUSD)
				),
				status: TRANSACTION_STATUS.WAITING,
				confirmTxTime: null,
			});

			const gasPrice = gasInfo.gasPrice * GWEI_UNIT;
			const now = Date.now();

			const tx = await Synthetix.exchange(
				bytesFormatter(quote.name),
				amountToExchange,
				bytesFormatter(base.name),
				{
					gasPrice,
					gasLimit: rectifiedGasLimit,
				}
			);

			const confirmTxTime = Date.now() - now;

			if (tx && tx.hash) {
				updateTransaction(
					{ status: TRANSACTION_STATUS.CONFIRMED, ...tx, confirmTxTime },
					transactionId
				);
				fetchWalletBalancesRequest();
				if (!seenTradeTooltipVisible) {
					setOvmTradeTooltipVisible(true);
				}
			} else {
				updateTransaction(
					{
						status: TRANSACTION_STATUS.FAILED,
						error: 'Transaction failed',
					},
					transactionId
				);
			}

			setIsSubmitting(false);

			// rate limit
			setConfirmTradeButtonRateLimited(true);
			setTimeout(() => {
				setConfirmTradeButtonRateLimited(false);
			}, CONFIRM_TRADE_BUTTON_RATE_LIMIT_MS);
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
			setConfirmTradeButtonRateLimited(false);
		}
	};

	const getOVMTradeTooltipBody = () => (
		<TooltipContent>
			<CloseIcon
				onClick={() => setOvmTradeTooltipVisible(false)}
				style={{
					position: 'absolute',
					top: '15px',
					right: '15px',
					color: '#908FDA',
					cursor: 'pointer',
				}}
			/>
			<TooltipContentRow style={{ justifyContent: 'center', marginTop: '4px' }}>
				<TooltipLabel>
					Trade confirmed in {get(transactions, [transactions.length - 1, 'confirmTxTime'])}ms.
				</TooltipLabel>
			</TooltipContentRow>
			<TooltipContentRow style={{ justifyContent: 'center', marginTop: '4px' }}>
				<TooltipLabel>Yes, the OVM is that fast!</TooltipLabel>
			</TooltipContentRow>
			<TooltipContentRow style={{ justifyContent: 'center', marginTop: '10px' }}>
				<TooltipLabel>
					<Link isExternal={true} to="https://optimism.io/ovm/" style={{ color: '#00E2DF' }}>
						Click here to learn more <ArrowLinkIcon />
					</Link>
				</TooltipLabel>
			</TooltipContentRow>
		</TooltipContent>
	);

	return (
		<Card>
			<Card.Header>
				<HeaderContainer>
					<HeadingSmall>{t('trade.trade-card.title')}</HeadingSmall>
					<ButtonFilter
						onClick={() => {
							setPair({ quote: base, base: quote });
							resetInputAmounts();
						}}
						height={'22px'}
					>
						<ButtonFilterInner>
							{t('trade.trade-card.reverse-button')}
							<ReverseArrowStyled />
						</ButtonFilterInner>
					</ButtonFilter>
				</HeaderContainer>
			</Card.Header>
			<Card.Body>
				<FormInputRow>
					<TradeInput
						synth={quote.name}
						amount={`${quoteAmount}`}
						label={
							<>
								<FormInputLabel>{t('trade.trade-card.sell-input-label')}:</FormInputLabel>
								<FormInputLabelSmall>
									{t('common.wallet.balance-currency', {
										balance: quoteBalance
											? formatCurrency(quoteBalance.balance)
											: !isEmpty(synthsWalletBalances)
											? 0
											: EMPTY_VALUE,
									})}
								</FormInputLabelSmall>
							</>
						}
						onChange={(_, value) => {
							setTradeAllBalance(false);
							setBaseAmount(value * rate);
							setQuoteAmount(value);
						}}
						errorMessage={inputError}
					></TradeInput>
				</FormInputRow>
				<FormInputRow>
					<TradeInput
						synth={base.name}
						amount={`${baseAmount}`}
						label={
							<>
								<FormInputLabel>{t('trade.trade-card.buy-input-label')}:</FormInputLabel>
								<FormInputLabelSmall>
									{t('common.wallet.balance-currency', {
										balance: baseBalance
											? formatCurrency(baseBalance.balance)
											: !isEmpty(synthsWalletBalances)
											? 0
											: EMPTY_VALUE,
									})}
								</FormInputLabelSmall>
							</>
						}
						onChange={(_, value) => {
							setTradeAllBalance(false);
							setQuoteAmount(value * inverseRate);
							setBaseAmount(value);
						}}
					></TradeInput>
				</FormInputRow>
				<BalanceFractionRow>
					{BALANCE_FRACTIONS.map((fraction, id) => (
						<ButtonAmount
							disabled={!quoteBalance || !quoteBalance.balance}
							key={`button-fraction-${id}`}
							onClick={() => {
								const balance = quoteBalance.balance;
								const isWholeBalance = fraction === 100;
								const amount = isWholeBalance ? balance : (balance * fraction) / 100;
								setTradeAllBalance(isWholeBalance);
								setQuoteAmount(amount);
								setBaseAmount(amount * rate);
							}}
						>
							<DataSmall color={colors.fontTertiary}>{fraction}%</DataSmall>
						</ButtonAmount>
					))}
				</BalanceFractionRow>
				<NetworkInfo
					gasPrice={gasInfo.gasPrice}
					gasLimit={gasLimit}
					ethRate={ethRate}
					exchangeFeeRate={feeRate}
					onEditButtonClick={showGweiPopup}
					amount={baseAmount}
					usdRate={getExchangeRatesForCurrencies(exchangeRates, base.name, SYNTHS_MAP.sUSD)}
					lastPrice={formatCurrencyWithSign(
						synthsMap[quote.name] && synthsMap[quote.name].sign,
						getExchangeRatesForCurrencies(exchangeRates, base.name, quote.name)
					)}
				/>
				{feeReclamationError ? (
					<ButtonPrimary onClick={() => getMaxSecsLeftInWaitingPeriod()}>
						{t('trade.trade-card.retry-button')}
					</ButtonPrimary>
				) : (
					<Tooltip
						key="ovm-trade-tooltip"
						title={getOVMTradeTooltipBody()}
						open={ovmTradeTooltipVisible}
						interactive={true}
						tooltipPadding="20px"
					>
						{synthsMap[quote.name].isFrozen ? (
							<ButtonPrimary disabled={true}>Synth is Frozen</ButtonPrimary>
						) : (
							<ButtonPrimary disabled={buttonDisabled} onClick={handleSubmit}>
								{t('trade.trade-card.confirm-trade-button')}
							</ButtonPrimary>
						)}
					</Tooltip>
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
			</Card.Body>
		</Card>
	);
};

const BalanceFractionRow = styled.div`
	display: grid;
	grid-column-gap: 13px;
	grid-auto-flow: column;
`;

const ButtonAmount = styled.button`
	&:disabled {
		pointer-events: none;
		opacity: 0.5;
	}
	border-radius: 1px;
	cursor: pointer;
	flex: 1;
	border: none;
	background: ${props => props.theme.colors.accentL2};
	height: 24px;
	${media.medium`
		height: 40px;
		span {
			font-size: 14px;
		}
	`}
	${media.small`
		height: 40px;
		span {
			font-size: 14px;
		}
	`}
`;

const HeaderContainer = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const ButtonFilterInner = styled.div`
	display: flex;
	align-items: center;
`;

const ReverseArrowStyled = styled(ReverseArrow)`
	height: 10px;
	margin-left: 8px;
`;

export const TxErrorMessage = styled(DismissableMessage)`
	margin-top: 8px;
`;

const mapStateToProps = state => ({
	synthPair: getSynthPair(state),
	walletInfo: getWalletInfo(state),
	synthsWalletBalances: getSynthsWalletBalances(state),
	exchangeRates: getRatesExchangeRates(state),
	exchangeFeeRate: getExchangeFeeRate(state),
	gasInfo: getGasInfo(state),
	ethRate: getEthRate(state),
	transactions: getTransactions(state),
	synthsMap: getAvailableSynthsMap(state),
	ovmTradeTooltipVisible: getOvmTradeTooltipVisible(state),
	seenTradeTooltipVisible: getSeenTradeTooltipVisible(state),
});

const mapDispatchToProps = {
	toggleGweiPopup,
	createTransaction,
	updateTransaction,
	setOvmTradeTooltipVisible,
	fetchWalletBalancesRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateOrderCard);
