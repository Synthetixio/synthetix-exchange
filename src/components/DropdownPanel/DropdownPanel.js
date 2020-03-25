import React, { memo } from 'react';
import styled, { css } from 'styled-components';
import OutsideClickHandler from 'react-outside-click-handler';

import { ReactComponent as ArrowDownIcon } from 'src/assets/images/arrow-down.svg';

import { APP_HEADER_HEIGHT, CARD_HEIGHT, SECTION_MARGIN, Z_INDEX } from 'src/constants/ui';

const DropdownPanel = memo(({ header, body, isOpen, onHeaderClick, handleClose }) => {
	return (
		<OutsideClickHandler onOutsideClick={handleClose}>
			<Container isOpen={isOpen}>
				<Header onClick={onHeaderClick}>
					{header}
					<HeaderIcon isOpen={isOpen} />
				</Header>
				<Body isOpen={isOpen}>{body}</Body>
			</Container>
		</OutsideClickHandler>
	);
});

const isOpen = css`
	height: ${`calc(100vh  - 6px - ${APP_HEADER_HEIGHT} - ${SECTION_MARGIN} - ${CARD_HEIGHT})`};
`;

const contentIsVisible = css`
	overflow: visible;
`;

const Container = styled.div`
	position: relative;
	width: 300px;
	overflow: hidden;
	${props => props.isOpen && contentIsVisible}
	z-index: ${Z_INDEX.DROPDOWN_PANEL};
`;

const Header = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10px 12px;
	background-color: ${props => props.theme.colors.accentL1};
	cursor: pointer;
`;

const HeaderIcon = styled(ArrowDownIcon)`
	width: 12px;
	height: 8px;
	transform: ${props => `rotate(${props.isOpen ? -Math.PI : -Math.Pi}rad)`};
	transition: transform 0.3s ease-in-out;
`;

const Body = styled.div`
	position: absolute;
	width: 300px;
	padding: 12px 0;
	height: 0;
	overflow: hidden;
	border-left: 1px solid ${props => props.theme.colors.accentL1};
	border-right: 1px solid ${props => props.theme.colors.accentL1};
	background-color: ${props => props.theme.colors.surfaceL2};
	${props => props.isOpen && isOpen}
`;

export default DropdownPanel;
