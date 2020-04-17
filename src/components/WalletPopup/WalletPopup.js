import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { getWalletInfo } from '../../ducks/wallet/walletDetails';
import { toggleWalletPopup } from '../../ducks/ui';

import { ReactComponent as CloseCrossIcon } from '../../assets/images/close-cross.svg';

import { LabelMedium } from '../Typography';
import WalletTypeSelector from './WalletTypeSelector';
import WalletAddressSelector from './WalletAddressSelector';
import { Z_INDEX } from '../../constants/ui';

const WalletPopup = ({ toggleWalletPopup, walletInfo }) => {
	const { currentWallet } = walletInfo;
	const [CurrentScreen, setCurrentScreen] = useState(WalletTypeSelector);

	useEffect(() => {
		setCurrentScreen(currentWallet ? WalletAddressSelector : WalletTypeSelector);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Popup>
			<Container>
				{CurrentScreen === WalletAddressSelector ? (
					<BackButton onClick={() => setCurrentScreen(WalletTypeSelector)}>
						<LabelMedium>Back to wallet selection</LabelMedium>
					</BackButton>
				) : null}
				<CloseButton onClick={() => toggleWalletPopup(false)}>
					<CloseCrossIcon width="22" height="22" />
				</CloseButton>
				<CurrentScreen
					selectAddressScreen={() => setCurrentScreen(WalletAddressSelector)}
					goBack={() => setCurrentScreen(WalletTypeSelector)}
				/>
			</Container>
		</Popup>
	);
};

const Popup = styled.div`
	z-index: ${Z_INDEX.MODAL};
	background: ${(props) => props.theme.colors.surfaceL1};
	position: absolute;
	width: 100%;
	height: 100vh;
	top: 0;
	left: 0;
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

const BackButton = styled.button`
	border: none;
	background: none;
	cursor: pointer;
	position: absolute;
	left: 5%;
	top: 5%;
	span {
		color: ${(props) => props.theme.colors.fontTertiary};
		font-size: 18px;
		&:hover {
			text-decoration: underline;
		}
	}
`;

const CloseButton = styled.button`
	border: none;
	background: none;
	cursor: pointer;
	position: absolute;
	right: 5%;
	top: 5%;
`;

const mapStateToProps = (state) => {
	return {
		walletInfo: getWalletInfo(state),
	};
};

const mapDispatchToProps = {
	toggleWalletPopup,
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletPopup);
