import React from 'react';
import styled, { withTheme } from 'styled-components';

import GenericInput from './Input';
import { DataMedium } from '../Typography';

const Input = ({ synth = 'sUSD', theme: { colors }, onAmountChange, amount }) => {
	return (
		<Container>
			<Synth>
				<SynthIcon src={`/images/synths/${synth}.svg`}></SynthIcon>
				<SynthName>{synth}</SynthName>
			</Synth>
			<GenericInput
				value={amount}
				placeholder="0"
				color={colors.fontPrimary}
				onChange={e => onAmountChange(e.target.value)}
			></GenericInput>
		</Container>
	);
};

const Container = styled.div`
	width: 100%;
	display: flex;
	background-color: ${props => props.theme.colors.surfaceL3};
`;

const Synth = styled.div`
	display: flex;
	align-items: center;
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

export default withTheme(Input);
