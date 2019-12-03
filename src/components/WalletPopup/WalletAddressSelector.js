/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import snxJSConnector, { connectToWallet } from '../../utils/snxJSConnector';
import { hasWeb3, SUPPORTED_WALLETS, onMetamaskAccountChange } from '../../utils/networkUtils';
import { updateWalletStatus } from '../../ducks/wallet';
import { toggleWalletPopup } from '../../ducks/ui';
import { getWalletInfo } from '../../ducks';

import { HeadingMedium } from '../Typography';

const WalletAddressSelector = ({ toggleWalletPopup, walletInfo: { derivationPath } }) => {
	return <Container>kfjdsf sdlkfj sdklfj</Container>;
};

const Container = styled.div`
	text-align: center;
	width: 100%;
`;

const mapStateToProps = state => {
	return {
		walletInfo: getWalletInfo(state),
	};
};

const mapDispatchToProps = {
	updateWalletStatus,
	toggleWalletPopup,
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletAddressSelector);
