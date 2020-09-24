import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import snxJSConnector from 'utils/snxJSConnector';
import { GWEI_UNIT } from 'utils/networkUtils';
import { normalizeGasLimit } from 'utils/transactions';
import { getCurrencyKeyBalance } from 'utils/balances';

import { EMPTY_VALUE } from 'constants/placeholder';

import { ButtonPrimary } from 'components/Button';
import Card from 'components/Card';
import NumericInputWithCurrency from 'components/Input/NumericInputWithCurrency';
import { DataSmall, HeadingSmall } from 'components/Typography';
import { getGasInfo } from 'ducks/transaction';
import { getWalletInfo } from 'ducks/wallet/walletDetails';
import { getWalletBalancesMap } from 'ducks/wallet/walletBalances';
import { createLoan, LOAN_STATUS } from 'ducks/loans/myLoans';
import { getEthRate } from 'ducks/rates';

import LoanWarningModal from '../LoanWarningModal';

import {
	FormInputRow,
	FormInputLabel,
	FormInputLabelSmall,
	CurrencyKey,
	FlexDivRow,
} from 'shared/commonStyles';

import NetworkInfo from 'components/NetworkInfo/NetworkInfo';

import { TxErrorMessage } from '../commonStyles';
import SelectCRatio from 'pages/shared/components/SelectCRatio';
import { getContract } from 'ducks/loans/contractInfo';

export const C_RATIO = {
	SAFE: '200',
	MEDIUM: '165',
	HIGH: '155',
};

export const CreateLoanCardsUSD = ({
	gasInfo,
	ethRate,
	walletInfo: { currentWallet },
	walletBalance,
	createLoan,
	collateralPair,
	contract,
}) => {
	const { t } = useTranslation();

	const [collateralAmount, setCollateralAmount] = useState('');
	const [loanAmount, setLoanAmount] = useState('');

	const [gasLimit, setLocalGasLimit] = useState(gasInfo.gasLimit);
	const [collateralAmountErrorMessage, setCollateralAmountErrorMessage] = useState(null);
	const [txErrorMessage, setTxErrorMessage] = useState(null);
	const [isLoanConfirmationModalOpen, setIsLoanConfirmationModalOpen] = useState(false);
	const [cRatio, setCRatio] = useState(C_RATIO.SAFE);

	const { collateralCurrencyKey, loanCurrencyKey, minLoanSize } = collateralPair;

	const onLoanModalConfirmation = () => {
		setIsLoanConfirmationModalOpen(false);
		handleSubmit();
	};

	const handleSubmit = async () => {
		const { utils, signer } = snxJSConnector;

		setTxErrorMessage(null);

		try {
			const loan = utils.parseEther(loanAmount.toString());
			const collateral = utils.parseEther(collateralAmount.toString());

			const ContractWithSigner = contract.connect(signer);

			const gasEstimate = await ContractWithSigner.estimate.openLoan(loan, { value: collateral });

			const updatedGasEstimate = normalizeGasLimit(Number(gasEstimate));

			setLocalGasLimit(updatedGasEstimate);

			const tx = await ContractWithSigner.openLoan(loan, {
				value: collateral,
				gasLimit: updatedGasEstimate,
				gasPrice: gasInfo.gasPrice * GWEI_UNIT,
			});

			createLoan({
				loan: {
					collateralAmount: Number(collateralAmount),
					loanAmount: Number(loanAmount),
					timeCreated: Date.now(),
					timeClosed: 0,
					feesPayable: 0,
					currentInterest: 0,
					status: LOAN_STATUS.WAITING,
					loanID: null,
					transactionHash: tx.hash,
				},
			});
			setCollateralAmount('');
			setLoanAmount('');
		} catch (e) {
			setTxErrorMessage(t('common.errors.unknown-error-try-again'));
		}
	};

	const collateralCurrencyBalance = getCurrencyKeyBalance(walletBalance, collateralCurrencyKey);
	const loanCurrencyBalance = getCurrencyKeyBalance(walletBalance, loanCurrencyKey);

	useEffect(() => {
		setLoanAmount('');
		setCollateralAmount('');
	}, [cRatio]);

	useEffect(() => {
		setCollateralAmountErrorMessage(null);
		if (collateralAmount !== '') {
			if (currentWallet && collateralAmount > collateralCurrencyBalance) {
				setCollateralAmountErrorMessage(t('common.errors.amount-exceeds-balance'));
			} else if (collateralAmount < minLoanSize) {
				setCollateralAmountErrorMessage(
					t('loans.loan-card.errors.min-loan-size', {
						currencyKey: collateralCurrencyKey,
						minLoanSize: minLoanSize,
					})
				);
			}
		}
	}, [
		collateralAmount,
		collateralCurrencyBalance,
		t,
		currentWallet,
		collateralCurrencyKey,
		loanCurrencyKey,
		minLoanSize,
	]);

	const hasError = !!collateralAmountErrorMessage;

	return (
		<Card>
			<Card.Header>
				<HeadingSmall>{t('loans.loan-card.create-loan.title')}</HeadingSmall>
			</Card.Header>
			<Card.Body>
				<FormInputRow>
					<NumericInputWithCurrency
						currencyKey={collateralCurrencyKey}
						value={`${collateralAmount}`}
						label={
							<>
								<FormInputLabel>
									<Trans
										i18nKey="loans.loan-card.create-loan.currency-locked"
										values={{ currencyKey: collateralCurrencyKey }}
										components={[<CurrencyKey />]}
									/>
								</FormInputLabel>
								<FormInputLabelSmall>
									{t('common.wallet.balance-currency', {
										balance: currentWallet ? collateralCurrencyBalance : EMPTY_VALUE,
									})}
								</FormInputLabelSmall>
							</>
						}
						onChange={(_, val) => {
							setCollateralAmount(val);
							setLoanAmount(val * (100 / parseFloat(cRatio)) * ethRate);
						}}
						errorMessage={collateralAmountErrorMessage}
					/>
				</FormInputRow>
				<FormInputRow>
					<NumericInputWithCurrency
						currencyKey={loanCurrencyKey}
						value={loanAmount}
						label={
							<>
								<FormInputLabel>
									<Trans
										i18nKey="loans.loan-card.create-loan.currency-borrowed"
										values={{ currencyKey: loanCurrencyKey }}
										components={[<CurrencyKey />]}
									/>
								</FormInputLabel>
								<FormInputLabelSmall>
									{t('common.wallet.balance-currency', {
										balance: currentWallet ? loanCurrencyBalance : EMPTY_VALUE,
									})}
								</FormInputLabelSmall>
							</>
						}
						onChange={(_, val) => {
							setLoanAmount(val);
							setCollateralAmount(val / (100 / parseFloat(cRatio)) / ethRate);
						}}
					/>
				</FormInputRow>
				<NetworkDataRow>
					<NetworkData>{t('trade.trade-card.network-info.c-ratio')}</NetworkData>
					<NetworkData>
						<SelectCRatio setCRatio={setCRatio} cRatio={cRatio} />
					</NetworkData>
				</NetworkDataRow>
				<StyledDivider />
				<NetworkInfo gasPrice={gasInfo.gasPrice} gasLimit={gasLimit} ethRate={ethRate} />
				<ButtonPrimary
					disabled={!collateralAmount || !loanAmount || !currentWallet || hasError}
					onClick={() => setIsLoanConfirmationModalOpen(true)}
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
			<LoanWarningModal
				isOpen={isLoanConfirmationModalOpen}
				onClose={() => setIsLoanConfirmationModalOpen(false)}
				onConfirm={() => onLoanModalConfirmation()}
			/>
		</Card>
	);
};

const NetworkData = styled(DataSmall)`
	color: ${(props) => props.theme.colors.fontTertiary};
`;

const NetworkDataRow = styled(FlexDivRow)`
	display: flex;
	align-items: center;
`;

const StyledDivider = styled.hr`
	border-color: ${(props) => props.theme.colors.accentL1};
`;

CreateLoanCardsUSD.propTypes = {
	gasInfo: PropTypes.object,
	ethRate: PropTypes.number,
	walletInfo: PropTypes.object,
	collateralPair: PropTypes.object,
	walletBalance: PropTypes.object,
};

const mapStateToProps = (state) => ({
	gasInfo: getGasInfo(state),
	ethRate: getEthRate(state),
	walletInfo: getWalletInfo(state),
	walletBalance: getWalletBalancesMap(state),
	contract: getContract(state),
});

const mapDispatchToProps = {
	createLoan,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateLoanCardsUSD);
