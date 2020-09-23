import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { GWEI_UNIT } from 'utils/networkUtils';
import { normalizeGasLimit } from 'utils/transactions';

import { getGasInfo } from 'ducks/transaction';
import { getWalletInfo } from 'ducks/wallet/walletDetails';
import { updateLoan, LOAN_STATUS } from 'ducks/loans/myLoans';
import { getEthRate } from 'ducks/rates';

import { ButtonPrimary } from 'components/Button';
import Card from 'components/Card';
import { HeadingSmall } from 'components/Typography';

import { InfoBox, InfoBoxLabel, InfoBoxValue, CurrencyKey } from 'shared/commonStyles';

import NetworkInfo from 'components/NetworkInfo';

import { TxErrorMessage } from '../commonStyles';
import { getContract, getContractType } from 'ducks/loans/contractInfo';

export const CloseLoanCard = ({
	gasInfo,
	ethRate,
	isInteractive = true,
	selectedLoan,
	walletInfo: { currentWallet },
	updateLoan,
	collateralPair,
	onLoanClosed,
	contract,
	contractType,
}) => {
	const { t } = useTranslation();

	const [gasLimit, setLocalGasLimit] = useState(gasInfo.gasLimit);
	const [txErrorMessage, setTxErrorMessage] = useState(null);

	let collateralAmount = null;
	let loanAmount = null;
	let loanID = null;
	let loanType = 'sETH';

	if (selectedLoan != null) {
		collateralAmount = selectedLoan.collateralAmount;
		loanAmount = selectedLoan.loanAmount;
		loanID = selectedLoan.loanID;
		loanType = selectedLoan.loanType;
	}

	const { collateralCurrencyKey } = collateralPair;

	const handleSubmit = async () => {
		setTxErrorMessage(null);

		try {
			const loanIDStr = loanID.toString();

			const gasEstimate = await contract.estimate.closeLoan(loanIDStr);
			const updatedGasEstimate = normalizeGasLimit(Number(gasEstimate));
			setLocalGasLimit(updatedGasEstimate);

			await contract.closeLoan(loanIDStr, {
				gasPrice: gasInfo.gasPrice * GWEI_UNIT,
				gasLimit: updatedGasEstimate,
			});

			updateLoan({
				loanID,
				loanInfo: {
					status: LOAN_STATUS.CLOSING,
				},
			});

			onLoanClosed();
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
				</LoanInfoContainer>
				<NetworkInfo gasPrice={gasInfo.gasPrice} gasLimit={gasLimit} ethRate={ethRate} />
				<ButtonPrimary onClick={handleSubmit} disabled={!selectedLoan || !currentWallet}>
					{t('common.actions.confirm')}
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

const mapStateToProps = (state) => ({
	gasInfo: getGasInfo(state),
	ethRate: getEthRate(state),
	walletInfo: getWalletInfo(state),
	contract: getContract(state),
	contractType: getContractType(state),
});

const mapDispatchToProps = {
	updateLoan,
};

export default connect(mapStateToProps, mapDispatchToProps)(CloseLoanCard);
