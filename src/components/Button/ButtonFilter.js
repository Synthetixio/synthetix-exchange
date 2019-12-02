import React, { useState } from 'react';
import styled from 'styled-components';
import OutsideClickHandler from 'react-outside-click-handler';
import { DataSmall } from '../Typography';

export const ButtonFilter = ({ children, onClick, height, active }) => {
	return (
		<Button onClick={onClick} height={height} active={active}>
			<ButtonLabel>{children}</ButtonLabel>
		</Button>
	);
};

export const ButtonFilterWithDropdown = ({ children, active, synths = [], onClick, quote }) => {
	const [isVisible, setIsVisible] = useState(false);
	return (
		<OutsideClickHandler onOutsideClick={() => setIsVisible(false)}>
			<ButtonContainer>
				<Button onClick={() => setIsVisible(!isVisible)} active={active}>
					<ButtonLabel>{children}</ButtonLabel>
					<AngleDownIcon src="/images/arrow-down.svg" />
				</Button>
				<DropDown isVisible={isVisible}>
					<List>
						{synths.map(synth => {
							return (
								<Synth
									isActive={synth.name === quote}
									onClick={() => {
										setIsVisible(false);
										onClick(synth);
									}}
								>
									<SynthIcon src={`/images/synths/${synth.name}.svg`}></SynthIcon>
									<SynthLabel>{synth.name}</SynthLabel>
								</Synth>
							);
						})}
					</List>
				</DropDown>
			</ButtonContainer>
		</OutsideClickHandler>
	);
};

const ButtonContainer = styled.div`
	position: relative;
	& > * {
		min-width: 100%;
	}
`;

const AngleDownIcon = styled.img`
	width: 6px;
	height: 6px;
	margin-left: 8px;
`;

const DropDown = styled.div`
	border-radius: 1px;
	overflow-x: visible;
	overflow-y: hidden;
	position: absolute;
	background-color: ${props => props.theme.colors.accentDark};
	border: 1px solid ${props => props.theme.colors.accentLight};
	visibility: ${props => (props.isVisible ? 'visible' : 'hidden')};
	z-index: 100;
`;

const List = styled.ul`
	margin: 0;
	padding: 0;
	list-style: none;
	overflow: auto;
	max-height: 400px;
`;

const Synth = styled.li`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 8px 16px;
	cursor: pointer;
	&:hover {
		background-color: ${props => props.theme.colors.accentLight};
	}
	background-color: ${props =>
		props.isActive ? props.theme.colors.accentLight : props.theme.colors.accentDark};
`;

const SynthIcon = styled.img`
	width: 22px;
	height: 22px;
	margin-right: 8px;
`;

const SynthLabel = styled(DataSmall)`
	text-transform: none;
	font-size: 14px;
`;

const Button = styled.button`
	border-radius: 1px;
	outline: none;
	height: ${props => (props.height ? props.height : '32px')};
	cursor: pointer;
	padding: 0 6px;
	background-color: ${props =>
		props.active ? props.theme.colors.accentLight : props.theme.colors.accentDark};
	& > * {
		color: ${props =>
			props.active ? props.theme.colors.fontSecondary : props.theme.colors.fontTertiary} !important;
	}
	&:hover {
		background-color: ${props => props.theme.colors.accentLight};
	}
	border: none;
`;

const ButtonLabel = styled(DataSmall)`
	text-transform: none;
	color: ${props => props.theme.colors.fontTertiary};
	font-family: 'apercu-medium';
`;
