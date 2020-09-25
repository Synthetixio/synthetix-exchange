import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import Card from 'components/Card';
import { ButtonPrimary } from 'components/Button';
import { TxErrorMessage } from '../commonStyles';
import { HeadingSmall } from 'components/Typography';
import { getEthRate } from 'ducks/rates';
import { getWalletBalancesMap } from 'ducks/wallet/walletBalances';
import { getWalletInfo } from 'ducks/wallet/walletDetails';
import { useTranslation } from 'react-i18next';
import {
	InfoBox,
	InfoBoxLabel,
	InfoBoxValue,
	FormInputRow,
	FormInputLabel,
	FormInputLabelSmall,
	LinkTextSmall,
	FlexDivRowCentered,
} from 'shared/commonStyles';
import { GWEI_UNIT } from 'utils/networkUtils';
import { normalizeGasLimit } from 'utils/transactions';
import { updateLoan, LOAN_STATUS } from 'ducks/loans/myLoans';
import NetworkInfo from 'components/NetworkInfo';
import { getContract, getContractType, getLoansCollateralPair } from 'ducks/loans/contractInfo';
import { getGasInfo } from 'ducks/transaction';
import NumericInputWithCurrency from 'components/Input/NumericInputWithCurrency';
// import { getCurrencyKeyBalance } from 'utils/balances';
import { ActionTypes } from '../../Actions';
import DropdownPanel from 'components/DropdownPanel';
import SelectCRatioBody from 'pages/shared/components/SelectCRatio/SelectCRatioBody';
import { media } from 'shared/media';

const ModifyCollateral = ({
	selectedLoan,
	gasInfo,
	ethRate,
	walletInfo: { currentWallet },
	walletBalance,
	updateLoan,
	collateralPair,
	contract,
	onLoanModified,
	type,
}) => {
	let collateralAmount = selectedLoan.collateralAmount;
	let loanAmount = selectedLoan.loanAmount;
	let currentInterest = selectedLoan.currentInterest;
	let loanID = selectedLoan.loanID;
	let currentCRatio = ((collateralAmount * ethRate) / (loanAmount + currentInterest)) * 100;
	const { t } = useTranslation();
	const [gasLimit, setLocalGasLimit] = useState(gasInfo.gasLimit);
	const [txErrorMessage, setTxErrorMessage] = useState(null);
	const [collateralAmountErrorMessage, setCollateralAmountErrorMessage] = useState(null);
	const [cRatio, setCRatio] = useState(currentCRatio);
	const [cRatioDropdownOpen, setcRatioDropdownOpen] = useState(false);
	const setDropdownIsOpen = (isOpen, cRatio) => {
		setCRatio(cRatio);
		setcRatioDropdownOpen(isOpen);
	};
	const [collateralDifference, setCollateralDifference] = useState(0);

	const {
		collateralCurrencyKey,
		// loanCurrencyKey,
		// issuanceRatio,
		// minLoanSize,
	} = collateralPair;

	// const collateralCurrencyBalance = getCurrencyKeyBalance(walletBalance, collateralCurrencyKey);
	// const loanCurrencyBalance = getCurrencyKeyBalance(walletBalance, loanCurrencyKey);

	const handleSubmit = async () => {
		setTxErrorMessage(null);

		try {
			const loanIDStr = loanID?.toString();

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

			onLoanModified();
		} catch (e) {
			setTxErrorMessage(t('common.errors.unknown-error-try-again'));
		}
	};

	useEffect(() => {
		const newCollateral = ((Number(cRatio) / 100) * (loanAmount + currentInterest)) / ethRate;
		setCollateralDifference(
			type === ActionTypes.ADD ? newCollateral - collateralAmount : collateralAmount - newCollateral
		);
	}, [cRatio, collateralAmount, currentInterest, ethRate, loanAmount, type]);

	useEffect(() => {
		setCollateralAmountErrorMessage(null);
		if (type === ActionTypes.ADD) {
			if (cRatio < currentCRatio) {
				setCollateralAmountErrorMessage(t('common.errors.c-ratio-below'));
			}
		} else {
			if (cRatio > currentCRatio) {
				setCollateralAmountErrorMessage(t('common.errors.c-ratio-above'));
			}
		}
	}, [cRatio, currentCRatio, t, type]);

	const hasError = !!collateralAmountErrorMessage;

	return (
		<StyledCard isInteractive={true}>
			<Card.Header>
				<HeadingSmall>
					{type === ActionTypes.ADD
						? t('loans.loan-card.add-collateral.title')
						: t('loans.loan-card.withdraw-collateral.title')}
				</HeadingSmall>
			</Card.Header>
			<Card.Body>
				<LoanInfoContainer>
					<FormInputRow>
						<NumericInputWithCurrency
							currencyKey={collateralCurrencyKey}
							value={`${collateralDifference.toFixed(2) || collateralAmount}`}
							label={
								<>
									<FormInputLabel>
										{type === ActionTypes.ADD
											? t('loans.loan-card.add-collateral.subtitle')
											: t('loans.loan-card.withdraw-collateral.subtitle')}
									</FormInputLabel>
									<FormInputLabelSmall>
										{t('loans.loan-card.current-collateral', {
											collateralAmount: selectedLoan.collateralAmount,
											currencyKey: collateralCurrencyKey,
										})}
									</FormInputLabelSmall>
								</>
							}
							disabled={true}
							errorMessage={collateralAmountErrorMessage}
						/>
					</FormInputRow>
					<InfoBox>
						<InfoBoxLabel>{t('loans.loan-card.new-c-ratio')}</InfoBoxLabel>
						<FieldRow>
							<InfoBoxValue>{Number(cRatio).toFixed()}%</InfoBoxValue>
							<StyledDropdownPanel
								height="auto"
								isOpen={cRatioDropdownOpen}
								handleClose={() => setDropdownIsOpen(false, cRatio)}
								width="170px"
								onHeaderClick={() => setDropdownIsOpen(!cRatioDropdownOpen, cRatio)}
								header={
									<GasEditFields>
										<LinkTextSmall>{t('common.actions.edit')}</LinkTextSmall>
									</GasEditFields>
								}
								body={
									<SelectCRatioBody
										setCRatio={setCRatio}
										cRatio={cRatio}
										setDropdownIsOpen={setDropdownIsOpen}
									/>
								}
							/>
						</FieldRow>
					</InfoBox>
				</LoanInfoContainer>
				<NetworkInfo gasPrice={gasInfo.gasPrice} gasLimit={gasLimit} ethRate={ethRate} />
				<ButtonPrimary
					onClick={handleSubmit}
					disabled={!selectedLoan || !currentWallet || hasError}
				>
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

const StyledCard = styled(Card)`
	${(props) =>
		!props.isInteractive &&
		css`
			opacity: 0.3;
			pointer-events: none;
		`}
`;

const StyledDropdownPanel = styled(DropdownPanel)`
	${media.medium`
		width: auto;
	`}
	.body {
		border-width: 1px 1px 1px 1px;
		margin-top: 20px;
	}
	z-index: 100;
`;

const GasEditFields = styled.div`
	display: flex;
	justify-content: space-between;
	float: right;
	text-align: center;
	cursor: pointer;
`;

const FieldRow = styled(FlexDivRowCentered)`
	justify-content: space-between;
`;

const LoanInfoContainer = styled.div`
	display: grid;
	grid-row-gap: 15px;
`;

const mapStateToProps = (state) => ({
	gasInfo: getGasInfo(state),
	ethRate: getEthRate(state),
	walletInfo: getWalletInfo(state),
	walletBalance: getWalletBalancesMap(state),
	contract: getContract(state),
	contractType: getContractType(state),
	collateralPair: getLoansCollateralPair(state),
});

const mapDispatchToProps = {
	updateLoan,
};

export default connect(mapStateToProps, mapDispatchToProps)(ModifyCollateral);
