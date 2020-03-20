import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import styled, { ThemeContext } from 'styled-components';
import { useTranslation } from 'react-i18next';

import Card from 'src/components/Card';
import { TradeInput } from 'src/components/Input';

import { getWalletInfo } from 'src/ducks/wallet/walletDetails';
import { getSynthPair } from 'src/ducks/synths';

import { EMPTY_VALUE } from 'src/constants/placeholder';
import { BALANCE_FRACTIONS } from 'src/constants/order';

import { FormInputRow, FormInputLabel, FormInputLabelSmall } from 'src/shared/commonStyles';

const CreateOrderCard = ({ synthPair: { base, quote }, walletInfo: { currentWallet } }) => {
	const { t } = useTranslation();
	const [baseAmount, setBaseAmount] = useState('');
	const [quoteAmount, setQuoteAmount] = useState('');
	return (
		<Card>
			<Card.Header>BUY/SELL</Card.Header>
			<Card.Body>
				<FormInputRow>
					<TradeInput
						synth={quote.name}
						label={
							<>
								<FormInputLabel>Sell:</FormInputLabel>
								<FormInputLabelSmall>
									{t('common.wallet.balance-currency', {
										balance: currentWallet ? quoteAmount : EMPTY_VALUE,
									})}
								</FormInputLabelSmall>
							</>
						}
					></TradeInput>
				</FormInputRow>
				<FormInputRow>
					<TradeInput
						synth={base.name}
						label={
							<>
								<FormInputLabel>Buy:</FormInputLabel>
								<FormInputLabelSmall>
									{t('common.wallet.balance-currency', {
										balance: currentWallet ? baseAmount : EMPTY_VALUE,
									})}
								</FormInputLabelSmall>
							</>
						}
					></TradeInput>
				</FormInputRow>
				<BalanceFractionRow>
					{BALANCE_FRACTIONS.map((fraction, id) => (
						<ButtonAmount
						// disabled={isEmpty(synthsBalances) || !synthsBalances[quote.name]}
						// key={id}
						// onClick={() => {
						// 	const balance = synthsBalances[quote.name].balance;
						// 	const amount = fraction === 100 ? balance : (balance * Number(fraction)) / 100;
						// 	setTradeAllBalance(fraction === 100);
						// 	setQuoteAmount(amount);
						// 	const convertedRate = amount * rate;
						// 	setBaseAmount(convertedRate);
						// }}
						>
							{/* <DataSmall color={colors.fontTertiary}>{fraction}%</DataSmall> */}
						</ButtonAmount>
					))}
				</BalanceFractionRow>
			</Card.Body>
		</Card>
	);
};

const BalanceFractionRow = styled.div`
	display: grid;
	grid-column-gap: 8px;
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
	background-color: ${props => props.theme.colors.accentL2};
	height: 24px;
`;

const mapStateToProps = state => {
	return {
		synthPair: getSynthPair(state),
		walletInfo: getWalletInfo(state),
		// exchangeRates: getRatesExchangeRates(state),
		// gasInfo: getGasInfo(state),
		// exchangeFeeRate: getExchangeFeeRate(state),
		// ethRate: getEthRate(state),
		// transactions: getTransactions(state),
	};
};

const mapDispatchToProps = {
	// setGasLimit,
	// toggleGweiPopup,
	// createTransaction,
	// updateTransaction,
	// fetchWalletBalancesRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateOrderCard);
