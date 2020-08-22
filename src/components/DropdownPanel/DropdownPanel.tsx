import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import OutsideClickHandler from 'react-outside-click-handler';

import { APP_HEADER_HEIGHT, CARD_HEIGHT, SECTION_MARGIN, Z_INDEX } from 'constants/ui';

type DropdownPanelProps = {
	header: React.ReactNode;
	body: React.ReactNode;
	isOpen: boolean;
	height?: string;
	width?: string;
	onHeaderClick: () => void;
	handleClose: () => void;
};

const DropdownPanel: FC<DropdownPanelProps> = ({
	header,
	body,
	isOpen,
	onHeaderClick,
	handleClose,
	width,
	height,
	...rest
}) => (
	<OutsideClickHandler onOutsideClick={handleClose}>
		<Container isOpen={isOpen} width={width} height={height} {...rest}>
			<Header
				className="header"
				isOpen={isOpen}
				width={width}
				height={height}
				onClick={onHeaderClick}
			>
				{header}
			</Header>
			<Body className="body" width={width} height={height} isOpen={isOpen}>
				{body}
			</Body>
		</Container>
	</OutsideClickHandler>
);

const isOpen = css<{ height?: string }>`
	height: ${(props) =>
		props.height ||
		`calc(100vh  - 6px - ${APP_HEADER_HEIGHT} - ${SECTION_MARGIN} - ${CARD_HEIGHT})`};
`;

const contentIsVisible = css`
	overflow: visible;
`;

type CommonStyleProps = {
	width?: string;
	height?: string;
	isOpen: boolean;
};

const Container = styled.div<CommonStyleProps>`
	position: relative;
	width: ${(props) => props.width || '100%'};
	overflow: hidden;
	${(props) => props.isOpen && contentIsVisible}
	z-index: ${Z_INDEX.DROPDOWN_PANEL};
`;

const Header = styled.div<CommonStyleProps>`
	cursor: pointer;

	.arrow {
		transition: transform 0.3s ease-in-out;
		${(props) =>
			props.isOpen &&
			css`
				transform: rotate(${Math.PI}rad);
			`}
	}
`;

const Body = styled.div<CommonStyleProps>`
	position: absolute;
	width: 100%;
	top: 100%;
	height: 0;
	overflow: hidden;
	border-color: ${(props) => props.theme.colors.accentL1};
	border-width: 0 1px 1px 1px;
	border-style: solid;
	background-color: ${(props) => props.theme.colors.surfaceL2};
	${(props) => props.isOpen && isOpen}
`;

export default DropdownPanel;
