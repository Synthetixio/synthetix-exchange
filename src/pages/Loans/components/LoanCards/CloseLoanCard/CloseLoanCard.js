import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { GWEI_UNIT } from 'utils/networkUtils';
import { normalizeGasLimit } from 'utils/transactions';

import { getGasInfo } from 'ducks/transaction';
import { getNetworkId, getWalletInfo } from 'ducks/wallet/walletDetails';
import { getWalletBalancesMap } from 'ducks/wallet/walletBalances';
import { updateLoan, LOAN_STATUS, fetchLoans } from 'ducks/loans/myLoans';
import { getEthRate } from 'ducks/rates';

import { ButtonPrimary } from 'components/Button';
import Card from 'components/Card';
import { HeadingSmall, DataSmall } from 'components/Typography';

import { InfoBox, InfoBoxLabel, InfoBoxValue, CurrencyKey } from 'shared/commonStyles';

import NetworkInfo from 'components/NetworkInfo';

import { TxErrorMessage } from '../commonStyles';
import { getContract, getContractType } from 'ducks/loans/contractInfo';
import { getEtherscanTxLink } from 'utils/explorers';

export const CloseLoanCard = ({
	gasInfo,
	networkId,
	ethRate,
	fetchLoans,
	isInteractive = true,
	selectedLoan,
	walletInfo: { currentWallet },
	updateLoan,
	collateralPair,
	contract,
	contractType,
	notify,
}) => {
	const { t } = useTranslation();

	const [gasLimit, setLocalGasLimit] = useState(gasInfo.gasLimit);
	const [txErrorMessage, setTxErrorMessage] = useState(null);
	const [transactionHash, setTransactionHash] = useState(null);

	let collateralAmount = null;
	let loanAmount = null;
	let currentInterest = null;
	let loanID = null;
	let loanType = contractType;
	let minimumAmountToClose = null;

	if (selectedLoan != null) {
		collateralAmount = selectedLoan.collateralAmount;
		loanAmount = selectedLoan.loanAmount;
		currentInterest = selectedLoan.currentInterest;
		loanID = selectedLoan.loanID;
		loanType = selectedLoan.loanType;
		minimumAmountToClose = loanAmount + currentInterest;
	}

	const { collateralCurrencyKey } = collateralPair;

	const handleSubmit = async () => {
		setTxErrorMessage(null);

		try {
			const loanIDStr = loanID.toString();

			const gasEstimate = await contract.estimate.closeLoan(loanIDStr);
			const updatedGasEstimate = normalizeGasLimit(Number(gasEstimate));
			setLocalGasLimit(updatedGasEstimate);

			const tx = await contract.closeLoan(loanIDStr, {
				gasPrice: gasInfo.gasPrice * GWEI_UNIT,
				gasLimit: updatedGasEstimate,
			});

			if (notify) {
				const { emitter } = notify.hash(tx.hash);
				emitter.on('txConfirmed', () => {
					updateLoan({
						loanID,
						loanType,
						loanInfo: {
							status: LOAN_STATUS.CLOSED,
						},
					});
					setTransactionHash(tx.hash);
					fetchLoans();
					return {
						onclick: () => window.open(getEtherscanTxLink(networkId, tx.hash), '_blank'),
					};
				});
			}
		} catch (e) {
			setTxErrorMessage(t('common.errors.unknown-error-try-again'));
		}
	};

	return (
		<StyledCard isInteractive={isInteractive}>
			<Card.Header>
				<HeadingSmall>{t('loans.loan-card.close-loan.title')}</HeadingSmall>
			</Card.Header>
			<Card.Body>
				<LoanInfoContainer>
					<InfoBox>
						<InfoBoxLabel>
							<Trans
								i18nKey="loans.loan-card.close-loan.currency-unlocked"
								values={{ currencyKey: collateralCurrencyKey }}
								components={[<CurrencyKey />]}
							/>
						</InfoBoxLabel>
						<InfoBoxValue>
							{t('common.wallet.balance-currency', { balance: collateralAmount })}
						</InfoBoxValue>
					</InfoBox>
					<InfoBox>
						<InfoBoxLabel>
							<Trans
								i18nKey="loans.loan-card.close-loan.currency-burned"
								values={{
									currencyKey: selectedLoan
										? loanType === 'sETH'
											? 'sETH'
											: 'sUSD'
										: contractType,
								}}
								components={[<CurrencyKey />]}
							/>
						</InfoBoxLabel>
						<InfoBoxValue>
							{t('common.wallet.balance-currency', { balance: loanAmount })}
						</InfoBoxValue>
					</InfoBox>
					{loanType === 'sUSD' && (
						<InfoBox>
							<InfoBoxLabel>
								<Trans
									i18nKey="loans.loan-card.close-loan.min-susd"
									components={[<CurrencyKey />]}
								/>
							</InfoBoxLabel>
							<InfoBoxValue>
								{t('common.wallet.balance-currency', { balance: minimumAmountToClose ?? 0 })}
							</InfoBoxValue>
						</InfoBox>
					)}
				</LoanInfoContainer>
				<NetworkInfo gasPrice={gasInfo.gasPrice} gasLimit={gasLimit} ethRate={ethRate} />
				<ButtonPrimary onClick={handleSubmit} disabled={!selectedLoan || !currentWallet}>
					{t('common.actions.confirm')}
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
		</StyledCard>
	);
};

CloseLoanCard.propTypes = {
	gasInfo: PropTypes.object,
	ethRate: PropTypes.number,
	isInteractive: PropTypes.bool,
	selectedLoan: PropTypes.object,
	walletInfo: PropTypes.object,
	onLoanClosed: PropTypes.func,
	updateLoan: PropTypes.func,
	collateralPair: PropTypes.object,
};

const StyledCard = styled(Card)`
	${(props) =>
		!props.isInteractive &&
		css`
			opacity: 0.3;
			pointer-events: none;
		`}
`;

const LoanInfoContainer = styled.div`
	display: grid;
	grid-row-gap: 15px;
`;

const StyledLink = styled(DataSmall)`
	text-decoration: none;
	color: ${(props) => props.theme.colors.fontPrimary};
`;

const mapStateToProps = (state) => ({
	gasInfo: getGasInfo(state),
	ethRate: getEthRate(state),
	walletInfo: getWalletInfo(state),
	contract: getContract(state),
	contractType: getContractType(state),
	walletBalance: getWalletBalancesMap(state),
	networkId: getNetworkId(state),
});

const mapDispatchToProps = {
	updateLoan,
	fetchLoans,
};

export default connect(mapStateToProps, mapDispatchToProps)(CloseLoanCard);
