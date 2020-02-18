import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import styled, { withTheme } from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import isNan from 'lodash/isNaN';

import { getTransactionPrice, GWEI_UNIT } from '../../utils/networkUtils';
import { formatCurrency, bytesFormatter, bigNumberFormatter } from '../../utils/formatters';

import { HeadingSmall, DataMedium, DataSmall } from '../Typography';
import { ButtonFilter, ButtonPrimary } from '../Button';
import { TradeInput } from '../Input';
import {
	getSynthPair,
	getExchangeRates,
	getWalletInfo,
	getGasInfo,
	getExchangeFeeRate,
	getEthRate,
	getTransactions,
} from '../../ducks';
import { toggleGweiPopup } from '../../ducks/ui';
import snxJSConnector from '../../utils/snxJSConnector';
import errorMessages from '../../utils/errorMessages';
import { setGasLimit, createTransaction, updateTransaction } from '../../ducks/transaction';
import { Z_INDEX } from '../../constants/ui';

const TradeBox = ({
	theme: { colors },
	synthPair,
	rates,
	walletInfo: { balances, currentWallet, walletType },
	setGasLimit,
	toggleGweiPopup,
	gasInfo: { gasLimit, gasPrice },
	exchangeFeeRate,
	ethRate,
	createTransaction,
	updateTransaction,
	transactions,
}) => {
	const [baseAmount, setBaseAmount] = useState('');
	const [quoteAmount, setQuoteAmount] = useState('');
	const [feeRate, setFeeRate] = useState(exchangeFeeRate);
	const [tradeAllBalance, setTradeAllBalance] = useState(false);
	const [{ base, quote }, setPair] = useState(synthPair);
	// const [nounce, setNounce] = useState(undefined);
	const [error, setError] = useState(null);
	const synthsBalances = (balances && balances.synths && balances.synths.balances) || {};

	useEffect(() => {
		setPair(synthPair);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [synthPair.base.name, synthPair.quote.name]);

	const FROZEN_SYNTHS = ['sLTC', 'sXTZ', 'sBNB', 'sMKR', 'iLTC', 'iXTZ', 'iBNB', 'iMKR'];

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
				price: base.name === 'sUSD' ? rates[quote.name][base.name] : rates[base.name][quote.name],
				amount: formatCurrency(baseAmount),
				priceUSD: base.name === 'sUSD' ? rates[quote.name]['sUSD'] : rates[base.name]['sUSD'],
				totalUSD: formatCurrency(baseAmount * rates[base.name]['sUSD']),
				status: 'Waiting',
			});

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
				if (!snxJSConnector.initialized) return;
				const isKovan = snxJSConnector.snxJS.contractSettings.networkId === '42';
				const feeRateForExchangeFunction = isKovan
					? snxJSConnector.snxJS.Exchanger.feeRateForExchange
					: snxJSConnector.snxJS.Synthetix.feeRateForExchange;

				const feeRateForExchange = await feeRateForExchangeFunction(
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
	}, [base.name, quote.name, snxJSConnector.initialized]);

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
				if (FROZEN_SYNTHS.includes(base.name)) throw new Error('This synth cannot be bought');
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
				setError(e.message);
			}
		};
		getGasEstimate();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [quoteAmount, baseAmount]);

	// useEffect(() => {
	// 	const getTransactionCount = async () => {
	// 		if (!currentWallet) return;
	// 		try {
	// 			const transactionCount = await snxJSConnector.provider.getTransactionCount(currentWallet);
	// 			setNounce(transactionCount + 1);
	// 			console.log('NOUNCE', nounce);
	// 		} catch (e) {
	// 			console.log(e);
	// 		}
	// 	};
	// 	getTransactionCount();
	// }, [transactions.length, currentWallet]);

	const baseBalance = (synthsBalances && synthsBalances[base.name]) || 0;
	const quoteBalance = (synthsBalances && synthsBalances[quote.name]) || 0;
	return (
		<Container>
			<Header>
				<HeadingSmall>{`${synthPair.base.name}/${synthPair.quote.name}`}</HeadingSmall>
			</Header>
			<Body>
				<InputBlock>
					<InputInfo>
						<DataMedium color={colors.fontSecondary} fontFamily={'apercu-medium'}>
							Sell:
						</DataMedium>
						<Balance>
							Balance: {quoteBalance ? formatCurrency(quoteBalance.balance) : 0} {quote.name}
						</Balance>
					</InputInfo>
					<TradeInput
						synth={quote.name}
						amount={quoteAmount}
						onChange={(_, value) => {
							const convertedRate = rates ? value * rates[quote.name][base.name] : 0;
							setBaseAmount(isNan(convertedRate) ? 0 : convertedRate);
							setQuoteAmount(value);
						}}
					/>
					<InputPopup isVisible={error}>
						<DataMedium>{error}</DataMedium>
					</InputPopup>
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
							Buy:
						</DataMedium>
						<Balance>
							Balance: {baseBalance ? formatCurrency(baseBalance.balance) : 0} {base.name}
						</Balance>
					</InputInfo>
					<TradeInput
						synth={base.name}
						amount={baseAmount}
						onChange={(_, value) => {
							const convertedRate = rates ? value * rates[base.name][quote.name] : 0;
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
									const convertedRate = rates ? amount * rates[quote.name][base.name] : 0;
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
						<NetworkData>Price</NetworkData>
						<NetworkData>
							1 {base.name} = {rates ? formatCurrency(rates[base.name][quote.name]) : 0}{' '}
							{quote.name}
						</NetworkData>
					</NetworkDataRow>
					<NetworkDataRow>
						<NetworkData>USD Value</NetworkData>
						<NetworkData>
							${rates ? formatCurrency(baseAmount * rates[base.name]['sUSD']) : 0}
						</NetworkData>
					</NetworkDataRow>
					<NetworkDataRow>
						<NetworkData>Fee</NetworkData>
						<NetworkData>{`${
							baseAmount && feeRate ? formatCurrency((baseAmount * feeRate) / 100, 4) : 0
						} ${base.name} ${feeRate ? `(${feeRate}%)` : ''}`}</NetworkData>
					</NetworkDataRow>
					<NetworkDataRow>
						<NetworkData>Gas limit</NetworkData>
						<NetworkData>
							{formatCurrency(gasLimit, 0) || 0} ($
							{formatCurrency(getTransactionPrice(gasPrice, gasLimit, ethRate))})
						</NetworkData>
					</NetworkDataRow>
					<NetworkDataRow>
						<NetworkData>Gas Price (gwei)</NetworkData>
						<NetworkData>
							{gasPrice || 0}
							<ButtonEdit onClick={() => toggleGweiPopup(true)}>
								<DataSmall color={colors.hyperLink}>Edit</DataSmall>
							</ButtonEdit>
						</NetworkData>
					</NetworkDataRow>
				</NetworkInfo>
				<ButtonPrimary disabled={!baseAmount || !currentWallet || error} onClick={onConfirmTrade}>
					Confirm Trade
				</ButtonPrimary>
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

const InputPopup = styled.div`
	position: absolute;
	transition: opacity 0.2s ease-out;
	pointer-events: none;
	bottom: 0;
	left: 0;
	width: 100%;
	background-color: ${props => props.theme.colors.red};
	padding: 8px 10px;
	border-radius: 1px;
	transform: translateY(calc(100% + 6px));
	z-index: ${Z_INDEX.TOOLTIP};
	opacity: ${props => (props.isVisible ? 1 : 0)};
	height: ${props => (props.isVisible ? 'auto' : 0)};
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
		rates: getExchangeRates(state),
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
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(TradeBox));
