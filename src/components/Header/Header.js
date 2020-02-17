import React from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import Logo from '../Logo';
import ThemeSwitcher from '../ThemeSwitcher';
import WalletAddressWidget from '../WalletAddressWidget';

import { ButtonPrimarySmall } from '../Button';
import { LabelMedium, DataMedium } from '../Typography';
import { toggleWalletPopup } from '../../ducks/ui';
import { getWalletInfo, getCurrentTheme } from '../../ducks';

const Header = ({ toggleWalletPopup, walletInfo, theme }) => {
	const { currentWallet, networkName } = walletInfo;
	const { t } = useTranslation();

	return (
		<Container>
			<HeaderBlock>
				<Logo theme={theme} />
				<Network>
					<NetworkLabel>{networkName || 'mainnet'}</NetworkLabel>
				</Network>

				<NetworkLabel style={{ fontStyle: 'italic' }}>{'[Beta version]'}</NetworkLabel>
			</HeaderBlock>
			<HeaderBlock>
				{/* <HeaderLink to={'/trade'}>
					<HeaderLabel>Trade</HeaderLabel>
				</HeaderLink>
				<HeaderLink to={'/'}>
					<HeaderLabel>Markets</HeaderLabel>
				</HeaderLink>
				<HeaderLink to={'/'}>
					<HeaderLabel>Tokens</HeaderLabel>
				</HeaderLink>
				<HeaderLabel style={{ margin: '0 24px' }}>A / 诶</HeaderLabel> */}
				<HeaderAnchor href="https://help.synthetix.io/hc/en-us" target="_blank">
					<HeaderLabel>Support</HeaderLabel>
				</HeaderAnchor>
				<ThemeSwitcher />
				{currentWallet ? (
					<WalletAddressWidget />
				) : (
					<ButtonPrimarySmall onClick={() => toggleWalletPopup(true)}>
						{t('header.connect-wallet')}
					</ButtonPrimarySmall>
				)}
			</HeaderBlock>
		</Container>
	);
};

const Container = styled.div`
	height: 56px;
	background-color: ${props => props.theme.colors.surfaceL3};
	display: flex;
	align-items: center;
	padding: 0 24px;
	justify-content: space-between;
`;

const Network = styled.div`
	display: flex;
	align-items: center;
	height: 32px;
	background-color: ${props => props.theme.colors.accentDark};
	margin-left: 26px;
	padding: 0 12px;
`;

const HeaderBlock = styled.div`
	display: flex;
	align-items: center;
	& > * {
		margin: 0 12px;
	}
`;

const HeaderLabel = styled(LabelMedium)`
	text-transform: uppercase;
	color: ${props => props.theme.colors.fontTertiary};
	&:hover {
		color: ${props => props.theme.colors.fontSecondary};
	}
`;

// const HeaderLink = styled(Link)`
// 	text-decoration: none;
// 	&:hover {
// 		text-decoration: underline;
// 	}
// `;

const HeaderAnchor = styled.a`
	text-decoration: none;
`;

const NetworkLabel = styled(DataMedium)`
	text-transform: uppercase;
	color: ${props => props.theme.colors.fontTertiary};
`;

const mapStateToProps = state => {
	return {
		walletInfo: getWalletInfo(state),
		theme: getCurrentTheme(state),
	};
};

const mapDispatchToProps = {
	toggleWalletPopup,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
