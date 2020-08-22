import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';

import { OptionsTransaction } from 'pages/Options/types';

import {
	GridDivRow,
	CurrencyKey,
	FlexDiv,
	FlexDivRow,
	resetButtonCSS,
	QuestionMarkIcon,
} from 'shared/commonStyles';

import { SYNTHS_MAP } from 'constants/currency';
import { USD_SIGN } from 'constants/currency';
import { SLIPPAGE_THRESHOLD } from 'constants/ui';

import { formatCurrencyWithKey, formatCurrencyWithSign } from 'utils/formatters';

import NumericInput from 'components/Input/NumericInput';
import NumericInputWithCurrency from 'components/Input/NumericInputWithCurrency';
import { formLabelSmallCSS } from 'components/Typography/Form';
import SideIcon from '../../components/SideIcon';

import { CurrentPosition } from './types';
import { labelMediumCSS } from 'components/Typography/Label';

import { ReactComponent as QuestionMark } from 'assets/images/question-mark.svg';

type TradeSideProps = {
	isActive: boolean;
	side: OptionsTransaction['side'];
	type: OptionsTransaction['type'];
	amount: OptionsTransaction['amount'] | string;
	price: string | number;
	onPriceChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onClick: () => void;
	onMaxClick: () => void;
	transKey?: string;
	currentPosition: CurrentPosition;
	priceShift: number;
};

const TradeSide: FC<TradeSideProps> = ({
	isActive,
	type,
	side,
	amount,
	price,
	onPriceChange,
	onAmountChange,
	onClick,
	transKey,
	currentPosition,
	priceShift,
	onMaxClick,
}) => {
	const { t } = useTranslation();

	const amountInputId = `${type}-${side}-amount`;
	const priceInputId = `${type}-${side}-price`;

	return (
		<Container isActive={isActive} onClick={onClick}>
			<Section>
				<FormRow>
					<SideIndication isHighlighted={isActive}>
						{t(`options.common.${side}`)} <StyledSideIcon side={side} />
					</SideIndication>
				</FormRow>
				<FormRow>
					<FormControl>
						<FormInputLabelRow>
							<FormInputLabel htmlFor={amountInputId}>
								{t(`${transKey}.amount-label`)}
							</FormInputLabel>
							<MaxButton
								onClick={() => {
									if (isActive) {
										onMaxClick();
									} else onClick();
								}}
							>
								{t('common.max')}
							</MaxButton>
						</FormInputLabelRow>
						<StyledNumericInputWithCurrency
							currencyKey={SYNTHS_MAP.sUSD}
							value={amount}
							onChange={onAmountChange}
							showIcon={false}
							inputProps={{
								id: amountInputId,
								min: '0',
							}}
						/>
					</FormControl>
				</FormRow>
				<FormRow>
					<FormControl>
						<FormLabelRow>
							<FormInputLabel htmlFor={priceInputId}>{t(`${transKey}.price-label`)}</FormInputLabel>
							<FlexDiv>
								<FormInputPriceShiftLabel highlighted={priceShift > SLIPPAGE_THRESHOLD}>
									{formatCurrencyWithSign(USD_SIGN, priceShift, 3)}
								</FormInputPriceShiftLabel>
								{type === 'bid' ? (
									<Tooltip
										title={<span>{t('options.market.trade-card.shared.price-shift')}</span>}
										placement="bottom"
										arrow={true}
									>
										<QuestionMarkIcon>
											<QuestionMark />
										</QuestionMarkIcon>
									</Tooltip>
								) : null}
							</FlexDiv>
						</FormLabelRow>
						<StyledNumericInput
							id={priceInputId}
							value={price}
							onChange={onPriceChange}
							placeholder="0"
							step="0.1"
							min="0"
							max="1"
						/>
					</FormControl>
				</FormRow>
			</Section>
			<CurrentPositionSection>
				<SectionTitle>
					{t('options.market.trade-card.bidding.common.current-position')}
				</SectionTitle>
				<SectionBody>
					{t('options.market.trade-card.bidding.common.bid')}{' '}
					<StyledCurrencyKey>
						{formatCurrencyWithKey(SYNTHS_MAP.sUSD, currentPosition.bid)}
					</StyledCurrencyKey>
				</SectionBody>
				<SectionBody>
					{t('options.market.trade-card.bidding.common.payout')}{' '}
					<StyledCurrencyKey>
						{formatCurrencyWithKey(SYNTHS_MAP.sUSD, currentPosition.payout)}
					</StyledCurrencyKey>
				</SectionBody>
			</CurrentPositionSection>
		</Container>
	);
};

const FormInputLabelRow = styled(FlexDivRow)`
	align-items: center;
`;

const Section = styled.div`
	${formLabelSmallCSS};
`;

const StyledSideIcon = styled(SideIcon)`
	margin-left: 8px;
`;

const Container = styled(GridDivRow)<{ isActive: boolean }>`
	position: relative;
	padding: 12px;
	grid-gap: 12px;
	> ${Section} {
		padding: 12px;
		background-color: ${(props) =>
			props.isActive ? props.theme.colors.surfaceL3 : props.theme.colors.surfaceL2};

		border: 1px solid ${(props) => props.theme.colors.accentL2};
	}
	${(props) =>
		!props.isActive &&
		css`
			cursor: pointer;
		`};
`;

const FormInputLabel = styled.label`
	color: ${(props) => props.theme.colors.fontSecondary};
	text-align: left;
	cursor: pointer;
`;

const FormInputPriceShiftLabel = styled(FormInputLabel)<{ highlighted: boolean }>`
	${(props) =>
		props.highlighted &&
		css`
			font-weight: 600;
			color: ${(props) => props.theme.colors.red};
		`}
`;

const FormRow = styled.div`
	padding-bottom: 12px;
`;

const FormControl = styled(GridDivRow)`
	grid-gap: 8px;
`;

const FormLabelRow = styled(FlexDiv)`
	justify-content: space-between;
`;

const StyledNumericInput = styled(NumericInput)`
	background-color: ${(props) => props.theme.colors.surfaceL2};
	border-color: ${(props) =>
		props.theme.isDarkTheme ? props.theme.colors.accentL1 : props.theme.colors.accentL2};
`;

const StyledNumericInputWithCurrency = styled(NumericInputWithCurrency)`
	.input {
		background-color: ${(props) => props.theme.colors.surfaceL2};
		border-color: ${(props) =>
			props.theme.isDarkTheme ? props.theme.colors.accentL1 : props.theme.colors.accentL2};
	}

	.currency-container {
		background-color: ${(props) => props.theme.colors.surfaceL3};
		border-color: ${(props) =>
			props.theme.isDarkTheme ? props.theme.colors.accentL1 : props.theme.colors.accentL2};
		> span {
			color: ${(props) => props.theme.colors.fontPrimary};
		}
	}
`;

const SideIndication = styled.div<{ isHighlighted: boolean }>`
	${labelMediumCSS};
	color: ${(props) => props.theme.colors.fontPrimary};
	background-color: ${(props) =>
		props.isHighlighted ? props.theme.colors.accentL1 : props.theme.colors.surfaceL3};
	border: 1px solid
		${(props) => (props.isHighlighted ? props.theme.colors.accentL2 : 'transparent')};
	border-radius: 2px;
	height: 32px;
	padding: 8px;
	text-align: center;
	cursor: ${(props) => (props.isHighlighted ? 'default' : 'pointer')};
`;

const CurrentPositionSection = styled(Section)`
	text-align: center;
	color: ${(props) => props.theme.colors.fontTertiary};
`;

const SectionTitle = styled.div`
	padding-bottom: 8px;
`;

const StyledCurrencyKey = styled(CurrencyKey)`
	color: ${(props) => props.theme.colors.fontPrimary};
`;

const SectionBody = styled.div`
	padding-bottom: 3px;
`;

const MaxButton = styled.button`
	${resetButtonCSS};
	color: ${(props) => props.theme.colors.buttonHover};
	text-transform: uppercase;
	font-size: 12px;
`;

export default TradeSide;
