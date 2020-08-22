import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import OutsideClickHandler from 'react-outside-click-handler';

import { ReactComponent as ArrowDownIcon } from '../../assets/images/arrow-down.svg';

import { DataSmall } from '../Typography';

import { Z_INDEX } from '../../constants/ui';

import Currency from '../../components/Currency';

export const ButtonFilter = ({ children, onClick, active, ...rest }) => (
	<Button onClick={onClick} active={active} {...rest}>
		<ButtonLabel>{children}</ButtonLabel>
	</Button>
);

export const ButtonFilterWithDropdown = ({
	children,
	active,
	synths = [],
	onClick,
	quote,
	...rest
}) => {
	const [isVisible, setIsVisible] = useState(false);

	return (
		<OutsideClickHandler onOutsideClick={() => setIsVisible(false)}>
			<ButtonContainer>
				<Button onClick={() => setIsVisible(!isVisible)} active={active} {...rest}>
					<ButtonLabel>{children}</ButtonLabel>
					<StyledArrowDownIcon />
				</Button>
				<DropDown isVisible={isVisible}>
					<List>
						{synths.map((synth) => (
							<Synth
								key={synth.name}
								isActive={synth.name === quote}
								onClick={() => {
									setIsVisible(false);
									onClick(synth);
								}}
							>
								<Currency.Name currencyKey={synth.name} showIcon={true} />
							</Synth>
						))}
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

const StyledArrowDownIcon = styled(ArrowDownIcon)`
	width: 6px;
	height: 6px;
	margin-left: 8px;
`;

const DropDown = styled.div`
	border-radius: 1px;
	overflow-x: visible;
	overflow-y: hidden;
	position: absolute;
	background-color: ${(props) => props.theme.colors.accentL1};
	border: 1px solid ${(props) => props.theme.colors.accentL2};
	visibility: ${(props) => (props.isVisible ? 'visible' : 'hidden')};
	z-index: ${Z_INDEX.DROPDOWN};
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
		background-color: ${(props) => props.theme.colors.accentL2};
	}
	background-color: ${(props) =>
		props.isActive ? props.theme.colors.accentL2 : props.theme.colors.accentL1};
`;

const fullRow = css`
	flex: 1;
	margin: 0 6px;
	&:first-child {
		margin-right: 6px;
		margin-left: 0;
	}
	&:last-child {
		margin-right: 0;
		margin-left: 6px;
	}
`;

const Button = styled.button`
	border-radius: 1px;
	outline: none;
	height: ${(props) => (props.height ? props.height : '32px')};
	cursor: pointer;
	padding: 0 6px;
	background-color: ${(props) =>
		props.active ? props.theme.colors.accentL2 : props.theme.colors.accentL1};
	& > * {
		color: ${(props) =>
			props.active ? props.theme.colors.fontSecondary : props.theme.colors.fontTertiary} !important;
	}
	&:hover {
		background-color: ${(props) => props.theme.colors.accentL2};
	}
	border: none;
	${(props) => props.fullRow && fullRow}
`;

const ButtonLabel = styled(DataSmall)`
	text-transform: none;
	color: ${(props) => props.theme.colors.fontTertiary};
	font-family: 'apercu-medium', sans-serif;
`;
