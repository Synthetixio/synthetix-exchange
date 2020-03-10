import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import styled, { withTheme } from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import isNan from 'lodash/isNaN';
import { useTranslation } from 'react-i18next';

import { getTransactionPrice, GWEI_UNIT } from '../../utils/networkUtils';
import {
	formatCurrency,
	bytesFormatter,
	bigNumberFormatter,
	secondsToTime,
} from '../../utils/formatters';

import { SYNTHS_MAP } from '../../constants/currency';

import { HeadingSmall, DataMedium, DataSmall } from '../Typography';
import { ButtonFilter, ButtonPrimary } from '../Button';
import { TradeInput } from '../Input';
import {
	getSynthPair,
	getWalletInfo,
	getGasInfo,
	getExchangeFeeRate,
	getTransactions,
} from '../../ducks';
import { getRatesExchangeRates } from '../../ducks/rates';
import { toggleGweiPopup } from '../../ducks/ui';
import { fetchWalletBalances } from '../../ducks/wallet';
import { getEthRate } from '../../ducks/rates';
import snxJSConnector from '../../utils/snxJSConnector';
import errorMessages from '../../utils/errorMessages';
import { getExchangeRatesForCurrencies } from '../../utils/rates';
import { setGasLimit, createTransaction, updateTransaction } from '../../ducks/transaction';
import { EXCHANGE_EVENTS } from '../../constants/events';

const TradeBox = ({
	theme: { colors },
	synthPair,
	exchangeRates,
	walletInfo: { balances, currentWallet, walletType },
	setGasLimit,
	toggleGweiPopup,
	gasInfo: { gasLimit, gasPrice },
	exchangeFeeRate,
	ethRate,
	createTransaction,
	updateTransaction,
	transactions,
	fetchWalletBalances,
}) => {
	const { t } = useTranslation();
	const [baseAmount, setBaseAmount] = useState('');
	const [quoteAmount, setQuoteAmount] = useState('');
	const [feeRate, setFeeRate] = useState(exchangeFeeRate);
	const [tradeAllBalance, setTradeAllBalance] = useState(false);
	const [{ base, quote }, setPair] = useState(synthPair);
	const [waitingPeriod, setWaitingPeriod] = useState(null);
	const [error, setError] = useState(null);
	const synthsBalances = (balances && balances.synths && balances.synths.balances) || {};

	useEffect(() => {
		setPair(synthPair);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [synthPair.base.name, synthPair.quote.name]);

	const onConfirmTrade = async () => {
		const {
			snxJS: { Synthetix },
			utils,
		} = snxJSConnector;
		const id = transactions.length;
		try {
			createTransaction({
				// nounce,
				id,
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
				status: 'Waiting',
			});

			if (await snxJSConnector.snxJS.Synthetix.isWaitingPeriod(bytesFormatter(quote.name))) {
				setBaseAmount('');
				setQuoteAmount('');
				getMaxSecsLeftInWaitingPeriod();
				throw new Error(`Waiting period for ${quote.name} is still ongoing`);
			}

			const amountToExchange = tradeAllBalance
				? synthsBalances[quote.name].balanceBN
				: utils.parseEther(quoteAmount.toString());
			const transaction = await Synthetix.exchange(
				bytesFormatter(quote.name),
				amountToExchange,
				bytesFormatter(base.name),
				{
					gasPrice: gasPrice * GWEI_UNIT,
					gasLimit,
					// nounce,
				}
			);
			updateTransaction({ status: 'Pending', ...transaction }, id);
		} catch (e) {
			const error = errorMessages(e, walletType);
			updateTransaction(
				{
					status: error.type === 'cancelled' ? 'Cancelled' : 'Failed',
					error: error.message,
				},
				id
			);
		}
	};

	useEffect(() => {
		const getFeeRateForExchange = async () => {
			try {
				const feeRateForExchange = await snxJSConnector.snxJS.Exchanger.feeRateForExchange(
					bytesFormatter(quote.name),
					bytesFormatter(base.name)
				);
				setFeeRate(100 * bigNumberFormatter(feeRateForExchange));
			} catch (e) {
				setFeeRate(exchangeFeeRate);
				console.log(e);
			}
		};
		setBaseAmount('');
		setQuoteAmount('');
		getFeeRateForExchange();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [base.name, quote.name]);

	useEffect(() => {
		const getGasEstimate = async () => {
			if (!quoteAmount || !baseAmount) {
				setError(null);
				return;
			}
			if (!currentWallet) return;
			try {
				const {
					snxJS: { Synthetix },
					utils,
				} = snxJSConnector;
				setError(null);
				const amountToExchange = tradeAllBalance
					? synthsBalances[quote.name].balanceBN
					: utils.parseEther(quoteAmount.toString());
				const gasEstimate = await Synthetix.contract.estimate.exchange(
					bytesFormatter(quote.name),
					amountToExchange,
					bytesFormatter(base.name)
				);
				setGasLimit(Number(gasEstimate));
			} catch (e) {
				console.log(e);
				getMaxSecsLeftInWaitingPeriod();
				setError(e.message);
			}
		};
		getGasEstimate();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [quoteAmount, baseAmount, base]);

	const getMaxSecsLeftInWaitingPeriod = useCallback(async () => {
		try {
			if (!currentWallet) return;
			const maxSecsLeftInWaitingPeriod = await snxJSConnector.snxJS.Exchanger.maxSecsLeftInWaitingPeriod(
				currentWallet,
				bytesFormatter(quote.name)
			);
			const waitingPeriodInSecs = Number(maxSecsLeftInWaitingPeriod);
			setWaitingPeriod(waitingPeriodInSecs);
			if (waitingPeriodInSecs) {
				setError(
					`There is a waiting period after completing a trade. Please wait approximately ${secondsToTime(
						waitingPeriodInSecs
					)} minutes before attempting to exchange ${quote.name}`
				);
			} else setError(null);
		} catch (e) {
			console.log(e);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [quote.name, currentWallet]);

	useEffect(() => {
		getMaxSecsLeftInWaitingPeriod();
	}, [getMaxSecsLeftInWaitingPeriod]);

	useEffect(() => {
		const {
			snxJS: { Synthetix },
		} = snxJSConnector;
		Synthetix.contract.on(EXCHANGE_EVENTS.SYNTH_EXCHANGE, fetchWalletBalances);

		return () => {
			Synthetix.contract.removeAllListeners(EXCHANGE_EVENTS.SYNTH_EXCHANGE);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const baseBalance = (synthsBalances && synthsBalances[base.name]) || 0;
	const quoteBalance = (synthsBalances && synthsBalances[quote.name]) || 0;

	const rate = getExchangeRatesForCurrencies(exchangeRates, quote.name, base.name);
	const inverseRate = getExchangeRatesForCurrencies(exchangeRates, base.name, quote.name);

	return (
		<Container>
			<Header>
				<HeadingSmall>{`${synthPair.base.name}/${synthPair.quote.name}`}</HeadingSmall>
			</Header>
			<Body>
				<InputBlock>
					<InputInfo>
						<DataMedium color={colors.fontSecondary} fontFamily={'apercu-medium'}>
							{t('trade.tradebox.Sell')}:
						</DataMedium>
						<Balance>
							{t('trade.tradebox.Balance')}:
							{quoteBalance ? formatCurrency(quoteBalance.balance) : 0} {quote.name}
						</Balance>
					</InputInfo>
					<TradeInput
						synth={quote.name}
						amount={quoteAmount}
						onChange={(_, value) => {
							setTradeAllBalance(false);
							const convertedRate = value * rate;
							setBaseAmount(isNan(convertedRate) ? 0 : convertedRate);
							setQuoteAmount(value);
						}}
						errorMessage={error}
					/>
				</InputBlock>
				<ButtonFilterRow>
					<ButtonFilter
						height={'22px'}
						style={{ background: 'transparent' }}
						onClick={() => setPair({ quote: base, base: quote })}
					>
						<ButtonIcon src={'/images/reverse-arrow.svg'}></ButtonIcon>
					</ButtonFilter>
				</ButtonFilterRow>
				<InputBlock>
					<InputInfo>
						<DataMedium color={colors.fontSecondary} fontFamily={'apercu-medium'}>
							{t('trade.tradebox.Buy')}:
						</DataMedium>
						<Balance>
							{t('trade.tradebox.Balance')}:{baseBalance ? formatCurrency(baseBalance.balance) : 0}
							{base.name}
						</Balance>
					</InputInfo>
					<TradeInput
						synth={base.name}
						amount={baseAmount}
						onChange={(_, value) => {
							setTradeAllBalance(false);
							const convertedRate = value * inverseRate;
							setQuoteAmount(isNan(convertedRate) ? 0 : convertedRate);
							setBaseAmount(value);
						}}
					/>
				</InputBlock>
				<ButtonRow>
					{[25, 50, 75, 100].map((fraction, i) => {
						return (
							<ButtonAmount
								disabled={isEmpty(synthsBalances) || !synthsBalances[quote.name]}
								key={i}
								onClick={() => {
									const balance = synthsBalances[quote.name].balance;
									const amount = fraction === 100 ? balance : (balance * Number(fraction)) / 100;
									setTradeAllBalance(fraction === 100);
									setQuoteAmount(amount);
									const convertedRate = amount * rate;
									setBaseAmount(convertedRate);
								}}
							>
								<DataSmall color={colors.fontTertiary}>{fraction}%</DataSmall>
							</ButtonAmount>
						);
					})}
				</ButtonRow>
				<NetworkInfo>
					<NetworkDataRow>
						<NetworkData>{t('trade.tradebox.Price')}</NetworkData>
						<NetworkData>
							1 {base.name} = {formatCurrency(inverseRate)} {quote.name}
						</NetworkData>
					</NetworkDataRow>
					<NetworkDataRow>
						<NetworkData>{t('trade.tradebox.USD-Value')}</NetworkData>
						<NetworkData>
							$
							{formatCurrency(
								baseAmount *
									getExchangeRatesForCurrencies(exchangeRates, base.name, SYNTHS_MAP.sUSD)
							)}
						</NetworkData>
					</NetworkDataRow>
					<NetworkDataRow>
						<NetworkData>{t('trade.tradebox.Fee')}</NetworkData>
						<NetworkData>{`${
							baseAmount && feeRate ? formatCurrency((baseAmount * feeRate) / 100, 4) : 0
						} ${base.name} ${feeRate ? `(${feeRate}%)` : ''}`}</NetworkData>
					</NetworkDataRow>
					<NetworkDataRow>
						<NetworkData>{t('trade.tradebox.Gas-limit')}</NetworkData>
						<NetworkData>
							{formatCurrency(gasLimit, 0) || 0} ($
							{formatCurrency(getTransactionPrice(gasPrice, gasLimit, ethRate))})
						</NetworkData>
					</NetworkDataRow>
					<NetworkDataRow>
						<NetworkData>{t('trade.tradebox.Gas-Price')}(gwei)</NetworkData>
						<NetworkData>
							{gasPrice || 0}
							<ButtonEdit onClick={() => toggleGweiPopup(true)}>
								<DataSmall color={colors.hyperLink}>Edit</DataSmall>
							</ButtonEdit>
						</NetworkData>
					</NetworkDataRow>
				</NetworkInfo>
				{waitingPeriod ? (
					<ButtonPrimary onClick={() => getMaxSecsLeftInWaitingPeriod()}>Retry</ButtonPrimary>
				) : (
					<ButtonPrimary disabled={!baseAmount || !currentWallet || error} onClick={onConfirmTrade}>
						{t('trade.tradebox.Confirm-Trade')}
					</ButtonPrimary>
				)}
			</Body>
		</Container>
	);
};

const Container = styled.div`
	width: 100%;
	height: 100%;
	background-color: ${props => props.theme.colors.surfaceL2};
`;

const Header = styled.div`
	background-color: ${props => props.theme.colors.surfaceL3};
	width: 100%;
	height: 40px;
	display: flex;
	align-items: center;
	padding: 0 18px;
	justify-content: flex-start;
	& > button {
		margin-left: 12px;
	}
`;

const ButtonIcon = styled.img`
	width: 16px;
	height: 12px;
`;

const Body = styled.div`
	padding: 0 12px 18px 12px;
`;

const InputBlock = styled.div`
	width: 100%;
	/* margin-top: 6px; */
	&:first-child {
		margin-top: 16px;
	}
	position: relative;
`;

const InputInfo = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 6px;
`;

const Balance = styled(DataSmall)`
	text-transform: none;
	color: ${props => props.theme.colors.fontTertiary};
	font-family: 'apercu-light', sans-serif;
`;

const ButtonRow = styled.div`
	display: flex;
	margin: 18px 0;
	& > :first-child {
		margin-left: 0;
	}
	& > :last-child {
		margin-right: 0;
	}
`;

const ButtonFilterRow = styled.div`
	display: flex;
	margin-top: 6px;
	justify-content: center;
`;

const ButtonAmount = styled.button`
	&:disabled {
		pointer-events: none;
		opacity: 0.5;
	}
	border-radius: 1px;
	cursor: pointer;
	flex: 1;
	margin: 0 8px;
	border: none;
	background-color: ${props => props.theme.colors.accentLight};
	height: 24px;
`;

const NetworkInfo = styled.div`
	margin: 18px 0;
`;

const NetworkDataRow = styled.div`
	display: flex;
	justify-content: space-between;
	margin-bottom: 8px;
`;

const NetworkData = styled(DataSmall)`
	color: ${props => props.theme.colors.fontTertiary};
`;

const ButtonEdit = styled.button`
	border: none;
	background: transparent;
	padding: 0;
	margin-left: 10px;
	cursor: pointer;
`;

const mapStateToProps = state => {
	return {
		synthPair: getSynthPair(state),
		exchangeRates: getRatesExchangeRates(state),
		walletInfo: getWalletInfo(state),
		gasInfo: getGasInfo(state),
		exchangeFeeRate: getExchangeFeeRate(state),
		ethRate: getEthRate(state),
		transactions: getTransactions(state),
	};
};

const mapDispatchToProps = {
	setGasLimit,
	toggleGweiPopup,
	createTransaction,
	updateTransaction,
	fetchWalletBalances,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(TradeBox));
