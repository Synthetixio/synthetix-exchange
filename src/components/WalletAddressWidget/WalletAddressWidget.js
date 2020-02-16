import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { DataMedium } from '../Typography';

import { toggleWalletPopup } from '../../ducks/ui';

import { shortenAddress } from '../../utils/formatters';

import { Dot } from '../../shared/commonStyles';

const WalletAddressWidget = ({ walletInfo, toggleWalletPopup }) => {
	const { currentWallet } = walletInfo;
	const showWalletPopup = () => toggleWalletPopup(true);

	return (
		<Container onClick={showWalletPopup}>
			<GreenDot />
			<AddressLabel>{shortenAddress(currentWallet)}</AddressLabel>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	height: 32px;
	padding: 8px;
	border-radius: 1px;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;
	border: none;
	background-color: ${props => props.theme.colors.accentDark};
`;

const GreenDot = styled(Dot)`
	background-color: ${props => props.theme.colors.green};
	margin-right: 8px;
`;

const AddressLabel = styled(DataMedium)`
	color: ${props => props.theme.colors.fontTertiary};
`;

const mapDispatchToProps = {
	toggleWalletPopup,
};

export default connect(null, mapDispatchToProps)(WalletAddressWidget);
