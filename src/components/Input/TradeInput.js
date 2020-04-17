import React from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { SYNTHS_MAP } from '../../constants/currency';

import { FlexDivCentered, FlexDiv, Message } from '../../shared/commonStyles';

import { ButtonPrimary } from '../Button';
import Currency from '../Currency';

import GenericInput from './Input';

const TradeInput = ({
	label,
	synth = SYNTHS_MAP.sUSD,
	onChange,
	amount,
	inputProps,
	errorMessage,
	onMaxButtonClick,
}) => {
	const { t } = useTranslation();
	const handleOnChange = (e) => onChange(e, e.target.value);
	const hasMaxButton = onMaxButtonClick != null;

	return (
		<>
			{label != null && <Label>{label}</Label>}
			<Container>
				<Synth>
					<StyledCurrencyName currencyKey={synth} showIcon={true} />
				</Synth>
				<StyledGenericInput
					type="number"
					value={amount}
					placeholder="0"
					onChange={handleOnChange}
					{...inputProps}
					hasMaxButton={hasMaxButton}
				/>
				{errorMessage && (
					<StyledMessage type="error" floating={true}>
						{errorMessage}
					</StyledMessage>
				)}
				{hasMaxButton && <MaxButton onClick={onMaxButtonClick}>{t('common.max')}</MaxButton>}
			</Container>
		</>
	);
};

TradeInput.propTypes = {
	label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
	synth: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	errorMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
	onMaxButtonClick: PropTypes.func,
};

const MaxButton = styled(ButtonPrimary).attrs({ size: 'sm' })`
	position: absolute;
	right: 10px;
	top: 50%;
	transform: translateY(-50%);
	height: 25px;
	line-height: unset;
`;

const StyledGenericInput = styled(GenericInput)`
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
	background: ${(props) => props.theme.colors.surfaceL3};
	position: relative;
`;

const Synth = styled(FlexDivCentered)`
	border: 1px solid ${(props) => props.theme.colors.accentL2Solid};
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
