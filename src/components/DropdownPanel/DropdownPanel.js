import React, { memo } from 'react';
import styled, { css } from 'styled-components';
import OutsideClickHandler from 'react-outside-click-handler';

import { APP_HEADER_HEIGHT, CARD_HEIGHT, SECTION_MARGIN, Z_INDEX } from 'src/constants/ui';

const DropdownPanel = memo(({ header, body, isOpen, onHeaderClick, handleClose, ...rest }) => {
	return (
		<OutsideClickHandler onOutsideClick={handleClose}>
			<Container isOpen={isOpen} {...rest}>
				<Header isOpen={isOpen} onClick={onHeaderClick} className="dropdown-panel-header">
					{header}
				</Header>
				{isOpen && (
					<Body isOpen={isOpen} className="dropdown-panel-body">
						{body}
					</Body>
				)}
			</Container>
		</OutsideClickHandler>
	);
});

const isOpen = css`
	height: ${(props) =>
		props.height ||
		`calc(100vh  - 6px - ${APP_HEADER_HEIGHT} - ${SECTION_MARGIN} - ${CARD_HEIGHT})`};
`;

const contentIsVisible = css`
	overflow: visible;
`;

const Container = styled.div`
	position: relative;
	width: ${(props) => props.width || '100%'};
	overflow: hidden;
	${(props) => props.isOpen && contentIsVisible}
	z-index: ${Z_INDEX.DROPDOWN_PANEL};
`;

const Header = styled.div`
	cursor: pointer;
	& svg {
		transition: transform 0.3s ease-in-out;
		transform: ${(props) => `rotate(${props.isOpen ? -Math.PI : -Math.Pi}rad)`};
	}
`;

const Body = styled.div`
	position: absolute;
	width: 100%;
	top: 100%;
	height: 0;
	overflow: hidden;
	border-left: 1px solid ${(props) => props.theme.colors.accentL1};
	border-right: 1px solid ${(props) => props.theme.colors.accentL1};
	border-bottom: 1px solid ${(props) => props.theme.colors.accentL1};
	background: ${(props) => props.theme.colors.surfaceL2};
	${(props) => props.isOpen && isOpen}
`;

export default DropdownPanel;
