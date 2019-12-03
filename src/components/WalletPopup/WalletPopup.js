import React from 'react';
import styled, { keyframes } from 'styled-components';
import { connect } from 'react-redux';

import { walletPopupIsVisible } from '../../ducks';
import { toggleWalletPopup } from '../../ducks/ui';

import WalletTypeSelector from './WalletTypeSelector';

const WalletPopup = ({ popupIsVisible, toggleWalletPopup }) => {
	return (
		<Popup isVisible={popupIsVisible}>
			<Container>
				<CloseButton onClick={() => toggleWalletPopup(false)}>
					<CloseIcon src="/images/close-cross.svg" />
				</CloseButton>
				<WalletTypeSelector />
			</Container>
		</Popup>
	);
};

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const Popup = styled.div`
	z-index: 1;
	background-color: ${props => props.theme.colors.surfaceL1};
	position: absolute;
	display: ${props => (props.isVisible ? 'block' : 'none')}
	animation: ${props => (props.isVisible ? fadeIn : fadeOut)} .2s ease-in;
	width: 100%;
	height: 100vh;
	top: 0;
	left: 0;
	position: relative;

`;

const Container = styled.div`
	width: 100%;
	max-width: 1024px;
	margin: 0 auto;
	display: flex;
	height: 100%;
	align-items: center;
	flex-direction: column;
	justify-content: center;
`;

const CloseButton = styled.button`
	border: none;
	background: none;
	cursor: pointer;
	position: absolute;
	right: 5%;
	top: 5%;
`;

const CloseIcon = styled.img`
	width: 22px;
	height: 22px;
`;

const mapStateToProps = state => {
	return {
		popupIsVisible: walletPopupIsVisible(state),
	};
};

const mapDispatchToProps = {
	toggleWalletPopup,
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletPopup);
