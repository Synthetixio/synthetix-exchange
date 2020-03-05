import React, { memo } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { ELEMENT_BORDER_RADIUS } from 'src/constants/ui';

import { shortenAddress } from 'src/utils/formatters';

import { showWalletPopup } from 'src/ducks/ui';
import { getWalletInfo, getCurrentTheme } from 'src/ducks';

import { Dot } from 'src/shared/commonStyles';
import { DataMedium } from 'src/components/Typography';

import { ButtonPrimary } from 'src/components/Button';

export const AccountInfo = memo(({ showWalletPopup, walletInfo }) => {
	const { t } = useTranslation();
	const { currentWallet, networkName } = walletInfo;

	return currentWallet != null ? (
		<Container onClick={showWalletPopup}>
			<GreenDot />
			<WalletAddress>{shortenAddress(currentWallet)}</WalletAddress>
			<NetworkLabel>{networkName}</NetworkLabel>
		</Container>
	) : (
		<ButtonPrimary size="sm" onClick={showWalletPopup}>
			{t('header.connect-wallet')}
		</ButtonPrimary>
	);
});

AccountInfo.propTypes = {
	walletInfo: PropTypes.object.isRequired,
	showWalletPopup: PropTypes.func.isRequired,
};

const Container = styled.div`
	height: 40px;
	display: grid;
	grid-auto-flow: column;
	grid-gap: 10px;
	align-items: center;

	padding: 8px;
	border-radius: ${ELEMENT_BORDER_RADIUS};
	cursor: pointer;
	border: 1px solid ${props => props.theme.colors.accentDark};
`;

const GreenDot = styled(Dot)`
	background-color: ${props => props.theme.colors.green};
`;

const WalletAddress = styled(DataMedium)`
	color: ${props => props.theme.colors.fontTertiary};
	text-transform: uppercase;
`;

const NetworkLabel = styled(DataMedium)`
	text-transform: uppercase;
	background-color: ${props => props.theme.colors.accentDark};
	color: ${props => props.theme.colors.fontTertiary};
	border-radius: 25px;
	font-size: 12px;
	padding: 3px 10px;
`;

const mapStateToProps = state => ({
	walletInfo: getWalletInfo(state),
	currentTheme: getCurrentTheme(state),
});

const mapDispatchToProps = {
	showWalletPopup,
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountInfo);
