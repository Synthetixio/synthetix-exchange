import React, { memo, useState, useEffect, FC } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ELEMENT_BORDER_RADIUS, CREATE_ORDER_CARD_WIDTH } from 'constants/ui';

import { shortenAddress } from 'utils/formatters';

import { RootState } from 'ducks/types';
import { showWalletPopup, setBlurBackgroundIsVisible } from 'ducks/ui';
import { getWalletInfo, WalletDetailsSliceState } from 'ducks/wallet/walletDetails';

import { ReactComponent as MenuArrowDownIcon } from 'assets/images/menu-arrow-down.svg';
import { ReactComponent as WalletIcon } from 'assets/images/wallet.svg';

import { Dot } from 'shared/commonStyles';
import { DataMedium } from 'components/Typography';

import { Button } from 'components/Button';
import DropdownPanel from 'components/DropdownPanel';
import WalletMenu from '../WalletMenu';

import { media } from 'shared/media';

type StateProps = {
	walletInfo: WalletDetailsSliceState;
};

type DispatchProps = {
	showWalletPopup: typeof showWalletPopup;
	setBlurBackgroundIsVisible: typeof setBlurBackgroundIsVisible;
};

type Props = {
	isOnSplashPage?: boolean;
};

type UserInfoProps = StateProps & DispatchProps & Props;

export const UserInfo: FC<UserInfoProps> = memo(
	({ showWalletPopup, walletInfo, setBlurBackgroundIsVisible, isOnSplashPage }) => {
		const { t } = useTranslation();
		const { currentWallet, networkName } = walletInfo;
		const [walletDropdownIsOpen, setWalletDropdownIsOpen] = useState<boolean>(false);

		const setDropdownIsOpen = (isOpen: boolean) => {
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
			<StyledDropdownPanel
				height="auto"
				isOpen={walletDropdownIsOpen}
				handleClose={() => setDropdownIsOpen(false)}
				width={CREATE_ORDER_CARD_WIDTH}
				onHeaderClick={() => setDropdownIsOpen(!walletDropdownIsOpen)}
				header={
					<UserInfoContainer isOnSplashPage={isOnSplashPage}>
						<WalletInfo>
							<StatusDot />
							<WalletAddress>{shortenAddress(currentWallet)}</WalletAddress>
							<NetworkLabel>{networkName}</NetworkLabel>
						</WalletInfo>
						<WalletIconContainer isOnSplashPage={isOnSplashPage}>
							<WalletIcon />
							<MenuArrowDownIcon className="arrow" />
						</WalletIconContainer>
					</UserInfoContainer>
				}
				body={<WalletMenu setDropdownIsOpen={setDropdownIsOpen} />}
			/>
		) : (
			<StyledButton palette="primary" size="sm" onClick={showWalletPopup}>
				{t('header.connect-wallet')}
			</StyledButton>
		);
	}
);

const StyledDropdownPanel = styled(DropdownPanel)`
	${media.medium`
		width: auto;
	`}
	.body {
		border-width: 1px 1px 1px 1px;
		margin-top: 17px;
	}
`;

const UserInfoContainer = styled.div<{ isOnSplashPage?: boolean }>`
	height: 32px;
	border-radius: ${ELEMENT_BORDER_RADIUS};
	display: grid;
	grid-auto-flow: column;
	background-color: ${({ theme }) => theme.colors.accentL1};
	border: 1px solid ${({ theme }) => theme.colors.accentL2};

	${(props) =>
		props.isOnSplashPage &&
		css`
			background-color: ${props.theme.colors.surfaceL3};
			border: 0;
		`};

	${media.medium`
		height: auto;
		padding: 0;
		border: 0;
		background: none;
	`}
`;

const WalletInfo = styled.div`
	height: 100%;
	display: grid;
	grid-auto-flow: column;
	grid-gap: 10px;
	align-items: center;
	justify-items: center;
	padding: 0 12px;
	cursor: pointer;
	${media.medium`
		padding: 0;
	`}
`;

const WalletIconContainer = styled(WalletInfo)<{ isOnSplashPage?: boolean }>`
	grid-gap: 8px;
	background-color: ${({ theme }) => theme.colors.accentL2};
	${(props) =>
		props.isOnSplashPage &&
		css`
			background-color: ${props.theme.colors.surfaceL3};
			border: 1px solid ${props.theme.colors.accentL1};
		`};
	${media.medium`
		display: none;
	`}
`;

const StatusDot = styled(Dot)`
	width: 12px;
	height: 12px;
	background-color: ${({ theme }) => theme.colors.green};
`;

const WalletAddress = styled(DataMedium)`
	font-family: ${({ theme }) => theme.fonts.medium};
	color: ${({ theme }) => theme.colors.fontTertiary};
	text-transform: uppercase;
`;

const NetworkLabel = styled(DataMedium)`
	text-transform: uppercase;
	background-color: ${({ theme }) => theme.colors.accentL2};
	color: ${({ theme }) => theme.colors.fontTertiary};
	border-radius: 25px;
	font-size: 10px;
	padding: 2px 10px;
`;

const StyledButton = styled(Button)`
	${media.small`
		font-size: 11px;
		height: 24px;
		line-height: 24px;
		padding: 0 8px;
	`}
`;

const mapStateToProps = (state: RootState): StateProps => ({
	walletInfo: getWalletInfo(state),
});

const mapDispatchToProps: DispatchProps = {
	showWalletPopup,
	setBlurBackgroundIsVisible,
};

export default connect<StateProps, DispatchProps, Props, RootState>(
	mapStateToProps,
	mapDispatchToProps
)(UserInfo);
