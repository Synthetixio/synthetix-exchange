import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import Card from 'components/Card';
import { ButtonPrimary } from 'components/Button';
import { TxErrorMessage } from '../LoanCards/commonStyles';
import { HeadingSmall, DataSmall } from 'components/Typography';
import { getEthRate } from 'ducks/rates';
import { getNetworkId, getWalletInfo } from 'ducks/wallet/walletDetails';
import { useTranslation, Trans } from 'react-i18next';
import {
	InfoBox,
	InfoBoxLabel,
	InfoBoxValue,
	FormInputLabel,
	FormInputLabelSmall,
	CurrencyKey,
} from 'shared/commonStyles';
import NetworkInfo from 'components/NetworkInfo';
import { getLoansCollateralPair } from 'ducks/loans/contractInfo';
import { getGasInfo } from 'ducks/transaction';
import NumericInputWithCurrency from 'components/Input/NumericInputWithCurrency';
import { getCurrencyKeyBalance } from 'utils/balances';
import snxJSConnector from 'utils/snxJSConnector';
import { GWEI_UNIT } from 'utils/networkUtils';
import { normalizeGasLimit } from 'utils/transactions';
import { getEtherscanTxLink } from 'utils/explorers';
import { fetchLiquidations } from 'ducks/loans/allLiquidations';

const LiquidateCard = ({
	collateralPair,
	networkId,
	walletInfo: { currentWallet },
	walletBalance,
	gasInfo,
	ethRate,
	selectedLiquidation,
	isInteractive,
	notify,
}) => {
	const { t } = useTranslation();
	const [liquidateAmount, setLiquidateAmount] = useState('');
	const [liquidateAmountErrorMessage, setLiquidateAmountErrorMessage] = useState(null);
	const { collateralCurrencyKey, loanCurrencyKey } = collateralPair;
	const loanCurrencyBalance = getCurrencyKeyBalance(walletBalance, loanCurrencyKey);
	const [gasLimit, setLocalGasLimit] = useState(gasInfo.gasLimit);
	const [txErrorMessage, setTxErrorMessage] = useState(null);
	const [transactionHash, setTransactionHash] = useState(null);

	useEffect(() => {
		if (selectedLiquidation) {
			setLiquidateAmount(selectedLiquidation.totalDebtToCover);
		}
	}, [selectedLiquidation]);

	const handleSubmit = async () => {
		const {
			snxJS: { EtherCollateralsUSD },
			utils,
		} = snxJSConnector;

		setTxErrorMessage(null);

		let contract = EtherCollateralsUSD.contract;

		try {
			const loanIDStr = selectedLiquidation.loanId.toString();
			const loanOwner = selectedLiquidation.account;
			const debtToCover = utils.parseEther(liquidateAmount.toString());

			const gasEstimate = await contract.estimate.liquidateLoan(loanOwner, loanIDStr, debtToCover);
			const updatedGasEstimate = normalizeGasLimit(Number(gasEstimate));
			setLocalGasLimit(updatedGasEstimate);

			const tx = await contract.liquidateLoan(loanOwner, loanIDStr, debtToCover, {
				gasPrice: gasInfo.gasPrice * GWEI_UNIT,
				gasLimit: updatedGasEstimate,
			});

			if (notify) {
				const { emitter } = notify.hash(tx.hash);
				emitter.on('txConfirmed', () => {
					setTransactionHash(tx.hash);
					setLiquidateAmount('');
					fetchLiquidations();
					return {
						onclick: () => window.open(getEtherscanTxLink(tx.hash), '_blank'),
					};
				});
			}
		} catch (e) {
			setTxErrorMessage(t('common.errors.unknown-error-try-again'));
		}
	};

	useEffect(() => {
		setLiquidateAmountErrorMessage(null);
		if (selectedLiquidation && liquidateAmount !== '') {
			if (currentWallet && liquidateAmount > selectedLiquidation.totalDebtToCover) {
				setLiquidateAmountErrorMessage(t('common.errors.amount-exceeds-liquidatable'));
			}
		}
	}, [liquidateAmount, t, currentWallet, loanCurrencyBalance, selectedLiquidation]);

	return (
		<StyledCard isInteractive={isInteractive}>
			<Card.Header>
				<HeadingSmall>{t('loans.liquidations.card.title')}</HeadingSmall>
			</Card.Header>
			<Card.Body>
				<LoanInfoContainer>
					<NumericInputWithCurrency
						currencyKey={loanCurrencyKey}
						value={`${liquidateAmount}`}
						label={
							<>
								<FormInputLabel>
									<Trans
										i18nKey="loans.liquidations.card.amount"
										values={{ currencyKey: loanCurrencyKey }}
										components={[<CurrencyKey />]}
									/>
								</FormInputLabel>
								<FormInputLabelSmall>
									{t('loans.liquidations.card.total', {
										debtAmount: selectedLiquidation ? selectedLiquidation.totalDebtToCover : 0,
									})}
								</FormInputLabelSmall>
							</>
						}
						onChange={(_, val) => {
							setLiquidateAmount(val);
						}}
						errorMessage={liquidateAmountErrorMessage}
					/>
					<InfoBox>
						<InfoBoxLabel>
							<Trans i18nKey="loans.liquidations.card.receive" components={[<CurrencyKey />]} />
						</InfoBoxLabel>
						<InfoBoxValue>{`${
							selectedLiquidation ? liquidateAmount / ethRate : 0
						} ${collateralCurrencyKey}`}</InfoBoxValue>
					</InfoBox>
					<InfoBox>
						<InfoBoxLabel>
							<Trans i18nKey="loans.liquidations.card.bonus" components={[<CurrencyKey />]} />
						</InfoBoxLabel>
						<InfoBoxValue>{`${
							selectedLiquidation
								? (liquidateAmount / ethRate) * selectedLiquidation.penaltyPercentage
								: 0
						} ${collateralCurrencyKey}`}</InfoBoxValue>
					</InfoBox>
				</LoanInfoContainer>
				<NetworkInfo gasPrice={gasInfo.gasPrice} gasLimit={gasLimit} ethRate={ethRate} />
				<ButtonPrimary onClick={handleSubmit} disabled={!selectedLiquidation || !currentWallet}>
					{t('common.actions.liquidate')}
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

const StyledCard = styled(Card)`
	${(props) =>
		!props.isInteractive &&
		css`
			opacity: 0.3;
			pointer-events: none;
		`}
`;

const StyledLink = styled(DataSmall)`
	text-decoration: none;
	color: ${(props) => props.theme.colors.fontPrimary};
`;

const LoanInfoContainer = styled.div`
	display: grid;
	grid-row-gap: 15px;
`;

const mapStateToProps = (state) => ({
	collateralPair: getLoansCollateralPair(state),
	walletInfo: getWalletInfo(state),
	gasInfo: getGasInfo(state),
	ethRate: getEthRate(state),
	networkId: getNetworkId(state),
});

const mapDispatchToProps = {
	fetchLiquidations,
};

export default connect(mapStateToProps, mapDispatchToProps)(LiquidateCard);
