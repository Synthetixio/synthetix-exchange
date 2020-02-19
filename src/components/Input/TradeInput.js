import React from 'react';
import styled, { withTheme } from 'styled-components';

import PropTypes from 'prop-types';
import GenericInput from './Input';
import { DataMedium } from '../Typography';
import { FlexDivCentered, FlexDiv, Message } from '../../shared/commonStyles';
import { SYNTHS_MAP } from '../../constants/currency';

const TradeInput = ({
	label,
	synth = SYNTHS_MAP.sUSD,
	theme: { colors },
	onChange,
	amount,
	inputProps,
	errorMessage,
}) => {
	const handleOnChange = e => onChange(e, e.target.value);
	return (
		<>
			{label != null && <Label>{label}</Label>}
			<Container>
				<Synth>
					<SynthIcon src={`/images/synths/${synth}.svg`}></SynthIcon>
					<SynthName>{synth}</SynthName>
				</Synth>
				<GenericInput
					type="number"
					value={amount}
					placeholder="0"
					color={colors.fontPrimary}
					onChange={handleOnChange}
					{...inputProps}
				/>
				{errorMessage && (
					<StyledMessage type="error" floating={true}>
						{errorMessage}
					</StyledMessage>
				)}
			</Container>
		</>
	);
};

TradeInput.propTypes = {
	label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
	synth: PropTypes.string.isRequired,
	theme: PropTypes.object.isRequired,
	onChange: PropTypes.func.isRequired,
	amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	errorMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

const Label = styled(FlexDivCentered)`
	justify-content: space-between;
	margin-bottom: 6px;
`;

const Container = styled(FlexDiv)`
	width: 100%;
	background-color: ${props => props.theme.colors.surfaceL3};
	position: relative;
`;

const Synth = styled(FlexDivCentered)`
	border: 1px solid ${props => props.theme.colors.accentLight};
	border-right: none;
	padding: 0 10px;
`;

const SynthIcon = styled.img`
	width: 22px;
	height: 22px;
	margin-right: 6px;
`;

const SynthName = styled(DataMedium)`
	text-transform: none;
	color: ${props => props.theme.colors.fontSecondary};
`;

export const StyledMessage = styled(Message)`
	top: calc(100% + 10px);
`;

export default withTheme(TradeInput);
