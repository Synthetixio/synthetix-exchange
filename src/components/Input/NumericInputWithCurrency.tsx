import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';

import { SYNTHS_MAP, CurrencyKey } from 'constants/currency';

import { FlexDivCentered, Message } from 'shared/commonStyles';

import { ButtonPrimary } from '../Button';
import Currency from '../Currency';

import NumericInput from './NumericInput';

import { Label, InputContainer } from './common';

type NumericInputWithCurrencyProps = {
	className?: string;
	label?: React.ReactNode;
	errorMessage?: React.ReactNode;
	currencyKey?: CurrencyKey;
	currencyIconProps?: object;
	inputProps?: object;
	onMaxButtonClick?: () => void;
	value: string | number;
	onChange: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void;
	showIcon?: boolean;
	disabled?: boolean;
};

const TradeInput: FC<NumericInputWithCurrencyProps> = ({
	className,
	label,
	currencyKey = SYNTHS_MAP.sUSD,
	currencyIconProps = {},
	onChange,
	value,
	inputProps,
	errorMessage,
	onMaxButtonClick,
	showIcon = true,
	disabled = false,
}) => {
	const { t } = useTranslation();
	const hasMaxButton = onMaxButtonClick != null;

	return (
		<>
			{label != null && <Label>{label}</Label>}
			<Container className={className}>
				<CurrencyContainer className="currency-container">
					<StyledCurrencyName
						currencyKey={currencyKey}
						showIcon={showIcon}
						iconProps={currencyIconProps}
					/>
				</CurrencyContainer>
				<StyledNumericInput
					className="input"
					disabled={disabled}
					value={value}
					placeholder="0"
					onChange={(e) => onChange(e, e.target.value)}
					hasMaxButton={hasMaxButton}
					{...inputProps}
				/>
				{errorMessage && (
					<StyledMessage type="error" floating={true} size="sm">
						{errorMessage}
					</StyledMessage>
				)}
				{hasMaxButton && <MaxButton onClick={onMaxButtonClick}>{t('common.max')}</MaxButton>}
			</Container>
		</>
	);
};

const MaxButton = styled(ButtonPrimary).attrs({ size: 'sm' })`
	position: absolute;
	right: 10px;
	top: 50%;
	transform: translateY(-50%);
	height: 25px;
	line-height: unset;
`;

const StyledNumericInput = styled(NumericInput)<{ hasMaxButton?: boolean }>`
	${(props) =>
		props.hasMaxButton &&
		css`
			padding-right: 72px;
		`};
	color: ${(props) => props.theme.colors.fontPrimary};
`;

const Container = styled(InputContainer)`
	display: flex;
	background-color: ${(props) => props.theme.colors.surfaceL3};
`;

const CurrencyContainer = styled(FlexDivCentered)`
	border: 1px solid ${(props) => props.theme.colors.accentL2};
	border-right: none;
	padding: 0 10px;
`;

const StyledCurrencyName = styled(Currency.Name)`
	color: ${(props) => props.theme.colors.fontSecondary};
`;

export const StyledMessage = styled(Message)`
	top: calc(100% + 10px);
`;

export default TradeInput;
