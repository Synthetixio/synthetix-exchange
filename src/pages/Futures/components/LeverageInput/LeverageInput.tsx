import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';

import { Message } from 'shared/commonStyles';

import { ButtonPrimary } from 'components/Button';

import NumericInput from 'components/Input/NumericInput';
import { Label, InputContainer } from 'components/Input/common';

type NumericInputWithCurrencyProps = {
	label?: React.ReactNode;
	errorMessage?: React.ReactNode;
	inputProps?: object;
	onLongButtonClick: () => void;
	onShortButtonClick: () => void;
	isLong: boolean;
	value: string | number;
	onChange: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void;
	disabled?: boolean;
};

const TradeInput: FC<NumericInputWithCurrencyProps> = ({
	label,
	onChange,
	value,
	isLong,
	inputProps,
	errorMessage,
	onLongButtonClick,
	onShortButtonClick,
	disabled = false,
}) => {
	const { t } = useTranslation();

	return (
		<>
			{label != null && <Label>{label}</Label>}
			<Container>
				<StyledNumericInput
					className="input"
					disabled={disabled}
					value={value}
					placeholder="1"
					onChange={(e) => onChange(e, e.target.value)}
					{...inputProps}
				/>
				{errorMessage && (
					<StyledMessage type="error" floating={true} size="sm">
						{errorMessage}
					</StyledMessage>
				)}
				<ButtonWrapper>
					<LongButton isActive={isLong} onClick={onLongButtonClick}>
						{t('futures.futures-order-card.button.long')}
					</LongButton>
					<ShortButton isActive={!isLong} onClick={onShortButtonClick}>
						{t('futures.futures-order-card.button.short')}
					</ShortButton>
				</ButtonWrapper>
			</Container>
		</>
	);
};

const ButtonWrapper = styled.div`
	position: absolute;
	right: 10px;
	top: 50%;
	transform: translateY(-50%);
	height: 28px;
	background: ${(props) => props.theme.colors.accentL1};
	padding: 4px;
	display: flex;
	align-items: center;
`;

const Button = styled(ButtonPrimary).attrs({ size: 'sm' })<{ isActive: boolean }>`
	height: 100%;
	line-height: unset;
	border-radius: 0;
	background: none;
	color: ${(props) => props.theme.colors.fontTertiary};
	&:hover {
		&:not(:disabled) {
			background-color: transparent;
		}
	}
`;

const LongButton = styled(Button)<{ isActive: boolean }>`
	${(props) =>
		props.isActive &&
		css`
			color: ${(props) => props.theme.colors.white};
			background: ${(props) => props.theme.colors.green};
			&:hover {
				background: ${(props) => props.theme.colors.green} !important;
			}
		`};
`;

const ShortButton = styled(Button)<{ isActive: boolean }>`
	${(props) =>
		props.isActive &&
		css`
			color: ${(props) => props.theme.colors.white};
			background: ${(props) => props.theme.colors.red};
			&:hover {
				background: ${(props) => props.theme.colors.red} !important;
			}
		`};
`;

const StyledNumericInput = styled(NumericInput)`
	padding-right: 72px;
	color: ${(props) => props.theme.colors.fontPrimary};
`;

const Container = styled(InputContainer)`
	display: flex;
	background-color: ${(props) => props.theme.colors.surfaceL3};
`;

export const StyledMessage = styled(Message)`
	top: calc(100% + 10px);
`;

export default TradeInput;
