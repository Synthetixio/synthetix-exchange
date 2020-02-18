import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import snxJSConnector from '../../../../../utils/snxJSConnector';
import { GWEI_UNIT } from '../../../../../utils/networkUtils';

import { getGasInfo, getEthRate, getWalletInfo } from '../../../../../ducks';
import { toggleGweiPopup } from '../../../../../ducks/ui';
import { closeLoan } from '../../../../../ducks/loans';

import { ButtonPrimary } from '../../../../../components/Button';
import Card from '../../../../../components/Card';
import { HeadingSmall } from '../../../../../components/Typography';

import {
	InfoBox,
	InfoBoxLabel,
	InfoBoxValue,
	CurrencyKey,
} from '../../../../../shared/commonStyles';

import { COLLATERAL_PAIR } from '../../../constants';

import NetworkInfo from '../NetworkInfo';

import { TxErrorMessage } from '../commonStyles';

const { COLLATERAL_CURRENCY_KEY, BORROWED_CURRENCY_KEY } = COLLATERAL_PAIR;

export const CloseLoanCard = ({
	toggleGweiPopup,
	gasInfo,
	ethRate,
	isInteractive = true,
	selectedLoan,
	walletInfo: { currentWallet },
	closeLoan,
}) => {
	const { t } = useTranslation();

	const [gasLimit, setLocalGasLimit] = useState(gasInfo.gasLimit);
	const [txErrorMessage, setTxErrorMessage] = useState(null);

	let collateralValue = null;
	let amountBorrowed = null;
	let loanId = null;

	if (selectedLoan != null) {
		collateralValue = selectedLoan.collateralValue;
		amountBorrowed = selectedLoan.amountBorrowed;
		loanId = selectedLoan.loanId;
	}

	const handleSubmit = async () => {
		const {
			snxJS: { EtherCollateral },
		} = snxJSConnector;

		setTxErrorMessage(null);

		try {
			const loanIdStr = loanId.toString();

			const gasEstimate = await EtherCollateral.contract.estimate.closeLoan(loanIdStr);
			const updatedGasEstimate = Number(gasEstimate);
			setLocalGasLimit(updatedGasEstimate);

			const tx = await EtherCollateral.closeLoan(loanIdStr, {
				gasPrice: gasInfo.gasPrice * GWEI_UNIT,
				gasLimit: updatedGasEstimate,
			});

			console.log(tx);

			closeLoan({
				loanId,
			});
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
								values={{ currencyKey: COLLATERAL_CURRENCY_KEY }}
								components={[<CurrencyKey />]}
							/>
						</InfoBoxLabel>
						<InfoBoxValue>
							{t('common.wallet.balance-currency', { balance: collateralValue })}
						</InfoBoxValue>
					</InfoBox>
					<InfoBox>
						<InfoBoxLabel>
							<Trans
								i18nKey="loans.loan-card.close-loan.currency-burned"
								values={{ currencyKey: BORROWED_CURRENCY_KEY }}
								components={[<CurrencyKey />]}
							/>
						</InfoBoxLabel>
						<InfoBoxValue>
							{t('common.wallet.balance-currency', { balance: amountBorrowed })}
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
};

const StyledCard = styled(Card)`
	${props =>
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

const mapStateToProps = state => ({
	gasInfo: getGasInfo(state),
	ethRate: getEthRate(state),
	walletInfo: getWalletInfo(state),
});

const mapDispatchToProps = {
	toggleGweiPopup,
	closeLoan,
};

export default connect(mapStateToProps, mapDispatchToProps)(CloseLoanCard);
