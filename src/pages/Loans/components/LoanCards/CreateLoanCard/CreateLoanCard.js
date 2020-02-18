import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import snxJSConnector from '../../../../../utils/snxJSConnector';
import { GWEI_UNIT } from '../../../../../utils/networkUtils';
import { getCurrencyKeyBalance } from '../../../../../utils/balances';

import { ButtonPrimary } from '../../../../../components/Button';
import Card from '../../../../../components/Card';
import { TradeInput } from '../../../../../components/Input';
import { HeadingSmall } from '../../../../../components/Typography';
import { getGasInfo, getEthRate, getWalletInfo } from '../../../../../ducks';
import { createLoan } from '../../../../../ducks/loans';
import { toggleGweiPopup } from '../../../../../ducks/ui';

import {
	FormInputRow,
	FormInputLabel,
	FormInputLabelSmall,
	CurrencyKey,
} from '../../../../../shared/commonStyles';

import { COLLATERAL_PAIR } from '../../../constants';

import NetworkInfo from '../NetworkInfo';

const {
	ISSUANCE_RATIO,
	COLLATERAL_CURRENCY_KEY,
	BORROWED_CURRENCY_KEY,
	MIN_LOAN_SIZE,
} = COLLATERAL_PAIR;

import { TxErrorMessage } from '../commonStyles';

export const CreateLoanCard = ({
	toggleGweiPopup,
	gasInfo,
	ethRate,
	walletInfo: { balances, currentWallet },
	createLoan,
}) => {
	const { t } = useTranslation();

	const [collateralAmount, setCollateralAmount] = useState('');
	const [borrowedAmount, setBorrowedAmount] = useState('');

	const [gasLimit, setLocalGasLimit] = useState(gasInfo.gasLimit);
	const [collateralAmountErrorMessage, setCollateralAmountErrorMessage] = useState(null);
	const [txErrorMessage, setTxErrorMessage] = useState(null);

	const handleSubmit = async () => {
		const {
			snxJS: { EtherCollateral },
			utils,
		} = snxJSConnector;

		setTxErrorMessage(null);

		try {
			const openLoanArgs = {
				value: utils.parseEther(collateralAmount),
				gasPrice: gasInfo.gasPrice * GWEI_UNIT,
				gasLimit,
			};

			const gasEstimate = await EtherCollateral.contract.estimate.openLoan(openLoanArgs);
			const updatedGasEstimate = Number(gasEstimate);
			setLocalGasLimit(updatedGasEstimate);

			const tx = await EtherCollateral.openLoan({ ...openLoanArgs, gasLimit: updatedGasEstimate });

			console.log(tx);

			createLoan({
				collateralAmount,
			});
		} catch (e) {
			setTxErrorMessage(t('common.errors.unknown-error-try-again'));
		}
	};

	const showGweiPopup = () => toggleGweiPopup(true);

	const collateralCurrencyBalance = getCurrencyKeyBalance(balances, COLLATERAL_CURRENCY_KEY);
	const borrowedCurrencyBalance = getCurrencyKeyBalance(balances, BORROWED_CURRENCY_KEY);

	useEffect(() => {
		setCollateralAmountErrorMessage(null);
		if (collateralAmount != '') {
			if (currentWallet && collateralAmount > collateralCurrencyBalance) {
				setCollateralAmountErrorMessage(t('common.errors.amount-exceeds-balance'));
			} else if (collateralAmount < MIN_LOAN_SIZE) {
				setCollateralAmountErrorMessage(
					t('loans.loan-card.errors.min-loan-size', {
						currencyKey: COLLATERAL_CURRENCY_KEY,
						minLoanSize: MIN_LOAN_SIZE,
					})
				);
			}
		}
	}, [collateralAmount, collateralCurrencyBalance, t, currentWallet]);

	const hasError = !!collateralAmountErrorMessage;

	return (
		<Card>
			<Card.Header>
				<HeadingSmall>{t('loans.loan-card.create-loan.title')}</HeadingSmall>
			</Card.Header>
			<Card.Body>
				<FormInputRow>
					<TradeInput
						synth={COLLATERAL_CURRENCY_KEY}
						amount={`${collateralAmount}`}
						label={
							<>
								<FormInputLabel>
									<Trans
										i18nKey="loans.loan-card.create-loan.currency-locked"
										values={{ currencyKey: COLLATERAL_CURRENCY_KEY }}
										components={[<CurrencyKey />]}
									/>
								</FormInputLabel>
								<FormInputLabelSmall>
									{t('common.wallet.balance-currency', { balance: collateralCurrencyBalance })}
								</FormInputLabelSmall>
							</>
						}
						onChange={(_, val) => {
							setCollateralAmount(val);
							setBorrowedAmount(val / ISSUANCE_RATIO);
						}}
						errorMessage={collateralAmountErrorMessage}
					/>
				</FormInputRow>
				<FormInputRow>
					<TradeInput
						synth={BORROWED_CURRENCY_KEY}
						amount={borrowedAmount}
						label={
							<>
								<FormInputLabel>
									<Trans
										i18nKey="loans.loan-card.create-loan.currency-borrowed"
										values={{ currencyKey: BORROWED_CURRENCY_KEY }}
										components={[<CurrencyKey />]}
									/>
								</FormInputLabel>
								<FormInputLabelSmall>
									{t('common.wallet.balance-currency', { balance: borrowedCurrencyBalance })}
								</FormInputLabelSmall>
							</>
						}
						onChange={(_, val) => {
							setBorrowedAmount(val);
							setCollateralAmount(val * ISSUANCE_RATIO);
						}}
					/>
				</FormInputRow>
				<NetworkInfo
					gasPrice={gasInfo.gasPrice}
					gasLimit={gasLimit}
					ethRate={ethRate}
					onEditButtonClick={showGweiPopup}
				/>
				<ButtonPrimary
					onClick={handleSubmit}
					disabled={!collateralAmount || !borrowedAmount || !currentWallet || hasError}
				>
					{t('common.actions.submit')}
				</ButtonPrimary>
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
			</Card.Body>
		</Card>
	);
};

CreateLoanCard.propTypes = {
	toggleGweiPopup: PropTypes.func.isRequired,
	gasInfo: PropTypes.object,
	ethRate: PropTypes.number,
	walletInfo: PropTypes.object,
};

const mapStateToProps = state => ({
	gasInfo: getGasInfo(state),
	ethRate: getEthRate(state),
	walletInfo: getWalletInfo(state),
});

const mapDispatchToProps = {
	toggleGweiPopup,
	createLoan,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateLoanCard);
