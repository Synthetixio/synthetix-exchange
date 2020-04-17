import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import snxJSConnector from 'src/utils/snxJSConnector';
import { GWEI_UNIT } from 'src/utils/networkUtils';
import { normalizeGasLimit } from 'src/utils/transactions';

import { getGasInfo } from 'src/ducks/transaction';
import { getWalletInfo } from 'src/ducks/wallet/walletDetails';
import { toggleGweiPopup } from 'src/ducks/ui';
import { updateLoan, LOAN_STATUS } from 'src/ducks/loans/myLoans';
import { getEthRate } from 'src/ducks/rates';

import { ButtonPrimary } from 'src/components/Button';
import Card from 'src/components/Card';
import { HeadingSmall } from 'src/components/Typography';

import { InfoBox, InfoBoxLabel, InfoBoxValue, CurrencyKey } from 'src/shared/commonStyles';

import NetworkInfo from '../NetworkInfo';

import { TxErrorMessage } from '../commonStyles';

export const CloseLoanCard = ({
	toggleGweiPopup,
	gasInfo,
	ethRate,
	isInteractive = true,
	selectedLoan,
	walletInfo: { currentWallet },
	updateLoan,
	collateralPair,
	onLoanClosed,
}) => {
	const { t } = useTranslation();

	const [gasLimit, setLocalGasLimit] = useState(gasInfo.gasLimit);
	const [txErrorMessage, setTxErrorMessage] = useState(null);

	let collateralAmount = null;
	let loanAmount = null;
	let loanID = null;

	if (selectedLoan != null) {
		collateralAmount = selectedLoan.collateralAmount;
		loanAmount = selectedLoan.loanAmount;
		loanID = selectedLoan.loanID;
	}

	const { collateralCurrencyKey, loanCurrencyKey } = collateralPair;

	const handleSubmit = async () => {
		const {
			snxJS: { EtherCollateral },
		} = snxJSConnector;

		setTxErrorMessage(null);

		try {
			const loanIDStr = loanID.toString();

			const gasEstimate = await EtherCollateral.contract.estimate.closeLoan(loanIDStr);
			const updatedGasEstimate = normalizeGasLimit(Number(gasEstimate));
			setLocalGasLimit(updatedGasEstimate);

			await EtherCollateral.closeLoan(loanIDStr, {
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

	const showGweiPopup = () => toggleGweiPopup(true);

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
								values={{ currencyKey: loanCurrencyKey }}
								components={[<CurrencyKey />]}
							/>
						</InfoBoxLabel>
						<InfoBoxValue>
							{t('common.wallet.balance-currency', { balance: loanAmount })}
						</InfoBoxValue>
					</InfoBox>
				</LoanInfoContainer>
				<NetworkInfo
					gasPrice={gasInfo.gasPrice}
					gasLimit={gasLimit}
					ethRate={ethRate}
					onEditButtonClick={showGweiPopup}
				/>
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
	toggleGweiPopup: PropTypes.func.isRequired,
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
});

const mapDispatchToProps = {
	toggleGweiPopup,
	updateLoan,
};

export default connect(mapStateToProps, mapDispatchToProps)(CloseLoanCard);
