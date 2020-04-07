import React, { memo, useState, useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { ELEMENT_BORDER_RADIUS } from 'src/constants/ui';

import { shortenAddress } from 'src/utils/formatters';

import { getCurrentTheme, setBlurBackgroundIsVisible } from 'src/ducks/ui';
import { getWalletInfo } from 'src/ducks/wallet/walletDetails';

import { ReactComponent as MenuArrowDownIcon } from 'src/assets/images/menu-arrow-down.svg';

import { Dot } from 'src/shared/commonStyles';
import { DataMedium } from 'src/components/Typography';

import DropdownPanel from 'src/components/DropdownPanel';
import WalletMenu from '../WalletMenu';

import { media } from 'src/shared/media';

export const AccountInfo = memo(({ walletInfo, setBlurBackgroundIsVisible }) => {
	const { currentWallet, networkName } = walletInfo;
	const [walletDropdownIsOpen, setWalletDropdownIsOpen] = useState(false);

	const setDropdownIsOpen = isOpen => {
		if (!isOpen && !walletDropdownIsOpen) return;
		setWalletDropdownIsOpen(isOpen);
		setBlurBackgroundIsVisible(isOpen);
	};

	useEffect(() => {
		return () => {
			setBlurBackgroundIsVisible(false);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return currentWallet != null ? (
		<DropdownPanel
			height="auto"
			isOpen={walletDropdownIsOpen}
			handleClose={() => setDropdownIsOpen(false)}
			width="300px"
			onHeaderClick={() => setDropdownIsOpen(!walletDropdownIsOpen)}
			header={
				<UserInfoContainer>
					<WalletInfo>
						<GreenDot />
						<WalletAddress>{shortenAddress(currentWallet)}</WalletAddress>
						<NetworkLabel>{networkName}</NetworkLabel>
						<MenuArrowDownIcon />
					</WalletInfo>
				</UserInfoContainer>
			}
			body={<WalletMenu setDropdownIsOpen={setDropdownIsOpen} />}
		/>
	) : null;
});

AccountInfo.propTypes = {
	walletInfo: PropTypes.object.isRequired,
};

const UserInfoContainer = styled.div`
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
	justify-items: center;
	cursor: pointer;
`;

const GreenDot = styled(Dot)`
	background: ${props => props.theme.colors.green};
`;

const WalletAddress = styled(DataMedium)`
	color: ${props => props.theme.colors.fontTertiary};
	text-transform: uppercase;
`;

const NetworkLabel = styled(DataMedium)`
	text-transform: uppercase;
	background: ${props => props.theme.colors.accentL1};
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
	setBlurBackgroundIsVisible,
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountInfo);
