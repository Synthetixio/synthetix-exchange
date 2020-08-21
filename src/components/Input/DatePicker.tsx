import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';

import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import { inputCSS } from './Input';
import { Message } from 'shared/commonStyles';

import { InputContainer } from './common';

type DatePickerProps = ReactDatePickerProps & {
	className?: string;
	errorMessage?: React.ReactNode;
};

export const DatePicker: FC<DatePickerProps> = ({ className, errorMessage, ...rest }) => {
	const { t } = useTranslation();

	return (
		<DatePickerContainer className={className} hasError={!!errorMessage}>
			<ReactDatePicker
				dateFormat="MMM d, yyyy h:mm aa"
				placeholderText={t('common.select-date')}
				autoComplete="off"
				{...rest}
			/>
			{errorMessage != null && (
				<ErrorMessage size="sm" floating={true} type="error">
					{errorMessage}
				</ErrorMessage>
			)}
		</DatePickerContainer>
	);
};

const DatePickerContainer = styled(InputContainer)<{ hasError?: boolean }>`
	.react-datepicker-wrapper {
		width: 100%;
	}
	.react-datepicker {
		font-family: ${(props) => props.theme.fonts.regular};
		font-size: 0.8rem;
		background-color: ${(props) => props.theme.colors.white};
		color: ${(props) => props.theme.colors.fontSecondary};
		border: 1px solid #aeaeae;
		border-radius: 2px;
		display: inline-block;
		position: relative;
	}
	.react-datepicker__input-container input {
		${inputCSS};
		&::placeholder {
			text-transform: uppercase;
		}
		&:disabled {
			opacity: 0.3;
		}
		${(props) =>
			props.hasError &&
			css`
				border-color: ${(props) => props.theme.colors.red} !important;
			`}
	}
`;

const ErrorMessage = styled(Message)`
	margin-top: 4px;
`;

export default DatePicker;
