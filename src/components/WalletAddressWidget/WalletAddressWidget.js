import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { DataMedium } from '../Typography';

import { toggleWalletPopup } from '../../ducks/ui';
import { getWalletInfo } from '../../ducks';

import { shortenAddress } from '../../utils/formatters';

const WalletAddressWidget = ({ walletInfo, toggleWalletPopup }) => {
	const { currentWallet } = walletInfo;
	return (
		<Container onClick={() => toggleWalletPopup(true)}>
			<GreenDot></GreenDot>
			<AddressLabel>{shortenAddress(currentWallet)}</AddressLabel>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	height: 32px;
	padding: 0 8px;
	borde-radius: 1px;
	justify-content: space-between;
	align-items: center;
	border-radius: 1px;
	cursor: pointer;
	border: none;
	background-color: ${props => props.theme.colors.accentDark};
`;

const GreenDot = styled.div`
	width: 14px;
	height: 14px;
	background-color: ${props => props.theme.colors.green};
	border-radius: 50%;
	margin-right: 8px;
`;

const AddressLabel = styled(DataMedium)`
	color: ${props => props.theme.colors.fontTertiary};
`;

const mapStateToProps = state => {
	return {
		walletInfo: getWalletInfo(state),
	};
};

const mapDispatchToProps = {
	toggleWalletPopup,
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletAddressWidget);
