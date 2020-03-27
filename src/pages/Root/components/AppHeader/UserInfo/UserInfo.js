import React, { memo } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { ELEMENT_BORDER_RADIUS } from 'src/constants/ui';

import { shortenAddress } from 'src/utils/formatters';

import { showWalletPopup, getCurrentTheme } from 'src/ducks/ui';
import { getWalletInfo } from 'src/ducks/wallet/walletDetails';

// TODO: bring this back when implement the new dropdown
// import { ReactComponent as MenuArrowDownIcon } from 'src/assets/images/menu-arrow-down.svg';

import { Dot } from 'src/shared/commonStyles';
import { DataMedium } from 'src/components/Typography';

import { ButtonPrimary } from 'src/components/Button';

import { media } from 'src/shared/media';

export const AccountInfo = memo(({ showWalletPopup, walletInfo }) => {
	const { t } = useTranslation();
	const { currentWallet, networkName } = walletInfo;

	return currentWallet != null ? (
		<Container>
			<WalletInfo onClick={showWalletPopup} role="button">
				<GreenDot />
				<WalletAddress>{shortenAddress(currentWallet)}</WalletAddress>
				<NetworkLabel>{networkName}</NetworkLabel>
			</WalletInfo>
			{/* <MenuArrowDownIcon /> */}
		</Container>
	) : (
		<StyledButtonPrimary size="sm" onClick={showWalletPopup}>
			{t('header.connect-wallet')}
		</StyledButtonPrimary>
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
	border: 1px solid ${props => props.theme.colors.accentL1};

	${media.small`
		height: auto;
		padding: 0;
		border: 0;
	`}
	${media.medium`
		height: auto;
		padding: 0;
		border: 0;
	`}
`;

const WalletInfo = styled.div`
	display: grid;
	grid-auto-flow: column;
	grid-gap: 10px;
	align-items: center;
	cursor: pointer;
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
	background-color: ${props => props.theme.colors.accentL1};
	color: ${props => props.theme.colors.fontTertiary};
	border-radius: 25px;
	font-size: 12px;
	padding: 3px 10px;
`;

const StyledButtonPrimary = styled(ButtonPrimary)`
	${media.small`
		font-size: 11px;
		height: 24px;
		line-height: 24px;
		padding: 0 8px;
	`}
`;

const mapStateToProps = state => ({
	walletInfo: getWalletInfo(state),
	currentTheme: getCurrentTheme(state),
});

const mapDispatchToProps = {
	showWalletPopup,
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountInfo);
