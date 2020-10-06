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
import { getNetworkId, getWalletInfo } from 'ducks/wallet/walletDetails';
import { getWalletBalancesMap } from 'ducks/wallet/walletBalances';
import { createLoan, LOAN_STATUS, fetchLoans } from 'ducks/loans/myLoans';
import { getEthRate } from 'ducks/rates';

import LoanWarningModal from '../LoanWarningModal';

import {
	FormInputRow,
	FormInputLabel,
	FormInputLabelSmall,
	CurrencyKey,
} from 'shared/commonStyles';

import NetworkInfo from 'components/NetworkInfo/NetworkInfo';

import { TxErrorMessage } from '../commonStyles';
import { getEtherscanTxLink } from 'utils/explorers';

export const CreateLoanCard = ({
	gasInfo,
	networkId,
	fetchLoans,
	ethRate,
	walletInfo: { currentWallet },
	walletBalance,
	createLoan,
	collateralPair,
	notify,
}) => {
	const { t } = useTranslation();

	const [collateralAmount, setCollateralAmount] = useState('');
	const [loanAmount, setLoanAmount] = useState('');

	const [gasLimit, setLocalGasLimit] = useState(gasInfo.gasLimit);
	const [collateralAmountErrorMessage, setCollateralAmountErrorMessage] = useState(null);
	const [txErrorMessage, setTxErrorMessage] = useState(null);
	const [isLoanConfirmationModalOpen, setIsLoanConfirmationModalOpen] = useState(false);
	const [transactionHash, setTransactionHash] = useState(null);

	const { collateralCurrencyKey, loanCurrencyKey, issuanceRatio, minLoanSize } = collateralPair;

	const onLoanModalConfirmation = () => {
		setIsLoanConfirmationModalOpen(false);
		handleSubmit();
	};

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
			const updatedGasEstimate = normalizeGasLimit(Number(gasEstimate));

			setLocalGasLimit(updatedGasEstimate);

			const tx = await EtherCollateral.openLoan({
				...openLoanArgs,
				gasLimit: updatedGasEstimate,
			});

			if (notify) {
				const { emitter } = notify.hash(tx.hash);
				emitter.on('txConfirmed', () => {
					createLoan({
						loan: {
							collateralAmount: Number(collateralAmount),
							loanAmount: Number(loanAmount),
							timeCreated: Date.now(),
							timeClosed: 0,
							feesPayable: 0,
							currentInterest: 0,
							status: LOAN_STATUS.OPEN,
							loanID: null,
							transactionHash: tx.hash,
						},
					});
					setTransactionHash(tx.hash);
					setCollateralAmount('');
					setLoanAmount('');
					fetchLoans();
				});
			}
		} catch (e) {
			setTxErrorMessage(t('common.errors.unknown-error-try-again'));
		}
	};

	const collateralCurrencyBalance = getCurrencyKeyBalance(walletBalance, collateralCurrencyKey);
	const loanCurrencyBalance = getCurrencyKeyBalance(walletBalance, loanCurrencyKey);

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
							setLoanAmount(val * issuanceRatio);
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
							setCollateralAmount(val / issuanceRatio);
						}}
					/>
				</FormInputRow>
				<NetworkInfo gasPrice={gasInfo.gasPrice} gasLimit={gasLimit} ethRate={ethRate} />
				<ButtonPrimary
					disabled={!collateralAmount || !loanAmount || !currentWallet || hasError}
					onClick={() => setIsLoanConfirmationModalOpen(true)}
				>
					{t('common.actions.submit')}
				</ButtonPrimary>

				{transactionHash && (
					<TxErrorMessage
						onDismiss={() => setTransactionHash(null)}
						size="sm"
						type="success"
						floating={true}
					>
						<StyledLink
							as="a"
							target="_blank"
							href={getEtherscanTxLink(networkId, transactionHash)}
						>
							VIEW TRANSACTION RECEIPT
						</StyledLink>
					</TxErrorMessage>
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
			</Card.Body>
			<LoanWarningModal
				isOpen={isLoanConfirmationModalOpen}
				onClose={() => setIsLoanConfirmationModalOpen(false)}
				onConfirm={() => onLoanModalConfirmation()}
			/>
		</Card>
	);
};

CreateLoanCard.propTypes = {
	gasInfo: PropTypes.object,
	ethRate: PropTypes.number,
	walletInfo: PropTypes.object,
	collateralPair: PropTypes.object,
	walletBalance: PropTypes.object,
};

const StyledLink = styled(DataSmall)`
	text-decoration: none;
	color: ${(props) => props.theme.colors.fontPrimary};
`;

const mapStateToProps = (state) => ({
	gasInfo: getGasInfo(state),
	ethRate: getEthRate(state),
	walletInfo: getWalletInfo(state),
	walletBalance: getWalletBalancesMap(state),
	networkId: getNetworkId(state),
});

const mapDispatchToProps = {
	createLoan,
	fetchLoans,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateLoanCard);
