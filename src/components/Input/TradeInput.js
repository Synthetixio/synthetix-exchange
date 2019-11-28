import React from 'react';
import styled, { withTheme } from 'styled-components';

import GenericInput from './Input';
import { DataMedium } from '../Typography';

const Input = ({ synth = 'sBTC', theme: { colors } }) => {
	return (
		<Container>
			<Synth>
				<SynthIcon src={`/images/synths/${synth}-icon.svg`}></SynthIcon>
				<SynthName>{synth}</SynthName>
			</Synth>
			<GenericInput placeholder="0" color={colors.fontPrimary}></GenericInput>
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
	width: 16px;
	height: 16px;
	margin-right: 6px;
`;

const SynthName = styled(DataMedium)`
	text-transform: none;
	color: ${props => props.theme.colors.fontSecondary};
`;

export default withTheme(Input);
