import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { formatCurrency } from '../../../../utils/formatters';
import { getTransactionPrice } from '../../../../utils/networkUtils';

import { ButtonPrimary } from '../../../../components/Button';
import Card from '../../../../components/Card';
import { TradeInput } from '../../../../components/Input';
import { DataSmall, HeadingSmall } from '../../../../components/Typography';
import { getGasInfo, getEthRate, getWalletInfo } from '../../../../ducks';
import {
	TextButton,
	FlexDivRow,
	FormInputRow,
	FormInputLabel,
	FormInputLabelSmall,
	LinkTextSmall,
} from '../../../../shared/commonStyles';

import { toggleGweiPopup } from '../../../../ducks/ui';
import { getCurrencyKeyBalance } from '../../../../utils/balances';

import { COLLATERAL_PAIR, LOAN_TYPES } from '../../constants';

const { ISSUANCE_RATIO, LOCKED_CURRENCY_KEY, BORROWED_CURRENCY_KEY } = COLLATERAL_PAIR;

const BASE_CURRENCY = LOCKED_CURRENCY_KEY;
const QUOTE_CURRENCY = BORROWED_CURRENCY_KEY;

export const LoanCard = ({
	type,
	toggleGweiPopup,
	gasInfo: { gasLimit, gasPrice },
	ethRate,
	walletInfo: { balances, currentWallet },
	isInteractive = true,
	selectedLoan,
}) => {
	const { t } = useTranslation();
	const isCreateLoan = type === LOAN_TYPES.CREATE;

	const [baseAmount, setBaseAmount] = useState(
		selectedLoan != null ? selectedLoan.collateralValue : ''
	);
	const [quoteAmount, setQuoteAmount] = useState(
		selectedLoan != null ? selectedLoan.amountBorrowed : ''
	);

	useEffect(() => {
		if (selectedLoan != null) {
			setBaseAmount(selectedLoan.collateralValue);
			setQuoteAmount(selectedLoan.amountBorrowed);
		}
	}, [selectedLoan]);

	const showGweiPopup = () => toggleGweiPopup(true);

	const baseCurrencyBalance = getCurrencyKeyBalance(balances, BASE_CURRENCY);
	const quoteCurrencyBalance = getCurrencyKeyBalance(balances, QUOTE_CURRENCY);

	return (
		<StyledCard isInteractive={isInteractive}>
			<Card.Header>
				<HeadingSmall>
					{isCreateLoan
						? t('loans.loan-card.create-loan.title')
						: t('loans.loan-card.close-loan.title')}
				</HeadingSmall>
			</Card.Header>
			<Card.Body>
				<FormInputRow>
					<TradeInput
						synth={BASE_CURRENCY}
						amount={`${baseAmount}`}
						label={
							<>
								<FormInputLabel>
									{isCreateLoan
										? t('loans.loan-card.create-loan.currency-locked', {
												currency: BASE_CURRENCY,
										  })
										: t('loans.loan-card.close-loan.currency-unlocked', {
												currency: BASE_CURRENCY,
										  })}
								</FormInputLabel>
								<FormInputLabelSmall>
									{t('common.wallet.balance-currency', { balance: baseCurrencyBalance })}
								</FormInputLabelSmall>
							</>
						}
						onChange={(_, val) => {
							setBaseAmount(val);
							setQuoteAmount(val / ISSUANCE_RATIO);
						}}
					/>
				</FormInputRow>
				<FormInputRow>
					<TradeInput
						synth={QUOTE_CURRENCY}
						amount={quoteAmount}
						label={
							<>
								<FormInputLabel>
									{isCreateLoan
										? t('loans.loan-card.create-loan.currency-borrowed', {
												currency: QUOTE_CURRENCY,
										  })
										: t('loans.loan-card.close-loan.currency-burned', {
												currency: QUOTE_CURRENCY,
										  })}
								</FormInputLabel>
								<FormInputLabelSmall>
									{t('common.wallet.balance-currency', { balance: quoteCurrencyBalance })}
								</FormInputLabelSmall>
							</>
						}
						onChange={(_, val) => {
							setQuoteAmount(val);
							setBaseAmount(val * ISSUANCE_RATIO);
						}}
					/>
				</FormInputRow>
				<NetworkInfo>
					<NetworkDataRow>
						<NetworkData>{t('common.gas-limit')}</NetworkData>
						<NetworkData>
							{formatCurrency(gasLimit, 0) || 0} ($
							{formatCurrency(getTransactionPrice(gasPrice, gasLimit, ethRate))})
						</NetworkData>
					</NetworkDataRow>
					<NetworkDataRow>
						<NetworkData>{t('common.gas-price-gwei')}</NetworkData>
						<NetworkData>
							{gasPrice || 0}
							<ButtonEdit onClick={showGweiPopup}>
								<LinkTextSmall>{t('common.actions.edit')}</LinkTextSmall>
							</ButtonEdit>
						</NetworkData>
					</NetworkDataRow>
				</NetworkInfo>
				<ButtonPrimary onClick={() => console.log('TODO')} disabled={!baseAmount || !currentWallet}>
					{t('common.actions.submit')}
				</ButtonPrimary>
			</Card.Body>
		</StyledCard>
	);
};

LoanCard.propTypes = {
	type: PropTypes.string.isRequired,
	toggleGweiPopup: PropTypes.func.isRequired,
	gasInfo: PropTypes.object,
	ethRate: PropTypes.number,
	isInteractive: PropTypes.bool,
	selectedLoan: PropTypes.object,
};

const StyledCard = styled(Card)`
	${props =>
		!props.isInteractive &&
		css`
			opacity: 0.3;
			pointer-events: none;
		`}
`;

const NetworkInfo = styled.div`
	margin: 18px 0;
`;

const NetworkData = styled(DataSmall)`
	color: ${props => props.theme.colors.fontTertiary};
`;

const NetworkDataRow = styled(FlexDivRow)`
	margin-bottom: 8px;
`;

const ButtonEdit = styled(TextButton)`
	margin-left: 10px;
`;

const mapStateToProps = state => ({
	gasInfo: getGasInfo(state),
	ethRate: getEthRate(state),
	walletInfo: getWalletInfo(state),
});

const mapDispatchToProps = {
	toggleGweiPopup,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoanCard);
