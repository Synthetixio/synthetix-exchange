import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';

import { SYNTHS_MAP, CurrencyKey } from 'constants/currency';

import { FlexDivCentered, FlexDiv, Message } from 'shared/commonStyles';

import { ButtonPrimary } from '../Button';
import Currency from '../Currency';

import { NumericInput } from './Input';

type TradeInputProps = {
	label?: React.ReactNode;
	errorMessage?: React.ReactNode;
	currencyKey?: CurrencyKey;
	inputProps?: object;
	onMaxButtonClick?: () => void;
	value: string | number;
	onChange: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void;
};

const TradeInput: FC<TradeInputProps> = ({
	label,
	currencyKey = SYNTHS_MAP.sUSD,
	onChange,
	value,
	inputProps,
	errorMessage,
	onMaxButtonClick,
}) => {
	const { t } = useTranslation();
	const hasMaxButton = onMaxButtonClick != null;

	return (
		<>
			{label != null && <Label>{label}</Label>}
			<Container>
				<CurrencyContainer>
					<StyledCurrencyName currencyKey={currencyKey} showIcon={true} />
				</CurrencyContainer>
				<StyledNumericInput
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

const Label = styled(FlexDivCentered)`
	justify-content: space-between;
	margin-bottom: 6px;
`;

const Container = styled(FlexDiv)`
	width: 100%;
	background-color: ${(props) => props.theme.colors.surfaceL3};
	position: relative;
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
