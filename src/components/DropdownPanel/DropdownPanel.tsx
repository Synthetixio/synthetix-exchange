import React, { FC, memo } from 'react';
import styled, { css } from 'styled-components';
import OutsideClickHandler from 'react-outside-click-handler';

import { APP_HEADER_HEIGHT, CARD_HEIGHT, SECTION_MARGIN, Z_INDEX } from 'constants/ui';

type DropdownPanelProps = {
	header: React.ReactNode;
	body: React.ReactNode;
	isOpen: boolean;
	width?: string;
	onHeaderClick: () => void;
	handleClose: () => void;
};

const DropdownPanel: FC<DropdownPanelProps> = memo(
	({ header, body, isOpen, onHeaderClick, handleClose, ...rest }) => (
		<OutsideClickHandler onOutsideClick={handleClose}>
			<Container isOpen={isOpen} {...rest}>
				<Header isOpen={isOpen} onClick={onHeaderClick} {...rest}>
					{header}
				</Header>
				<Body isOpen={isOpen} {...rest}>
					{body}
				</Body>
			</Container>
		</OutsideClickHandler>
	)
);

const isOpen = css<{ height?: string }>`
	height: ${(props) =>
		props.height ||
		`calc(100vh  - 6px - ${APP_HEADER_HEIGHT} - ${SECTION_MARGIN} - ${CARD_HEIGHT})`};
`;

const contentIsVisible = css`
	overflow: visible;
`;

const Container = styled.div<{ width?: string; isOpen: boolean }>`
	position: relative;
	width: ${(props) => props.width || '100%'};
	overflow: hidden;
	${(props) => props.isOpen && contentIsVisible}
	z-index: ${Z_INDEX.DROPDOWN_PANEL};
`;

const Header = styled.div<{ isOpen: boolean }>`
	cursor: pointer;
	& svg {
		transition: transform 0.3s ease-in-out;
		${(props) =>
			props.isOpen &&
			css`
				transform: rotate(${Math.PI}rad);
			`}
	}
`;

const Body = styled.div<{ isOpen: boolean }>`
	position: absolute;
	width: 100%;
	top: 100%;
	height: 0;
	overflow: hidden;
	border-left: 1px solid ${(props) => props.theme.colors.accentL1};
	border-right: 1px solid ${(props) => props.theme.colors.accentL1};
	border-bottom: 1px solid ${(props) => props.theme.colors.accentL1};
	background-color: ${(props) => props.theme.colors.surfaceL2};
	${(props) => props.isOpen && isOpen}
`;

export default DropdownPanel;
