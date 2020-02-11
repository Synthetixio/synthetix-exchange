import React from 'react';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';

import Logo from '../Logo';
import ThemeSwitcher from '../ThemeSwitcher';
import WalletAddressWidget from '../WalletAddressWidget';

import { ButtonPrimarySmall } from '../Button';
import { DataMedium } from '../Typography';
import { labelMediumCSS } from '../Typography/Label';
import { toggleWalletPopup } from '../../ducks/ui';
import { getWalletInfo, getCurrentTheme } from '../../ducks';

import { ROUTES } from '../../constants/routes';
import { LINKS } from '../../constants/links';
import { HEADER_HEIGHT } from '../../constants/ui';

import { FlexDivCentered, ExternalLink, Link } from '../../shared/commonStyles';

const Header = ({ toggleWalletPopup, walletInfo, theme }) => {
	const { currentWallet, networkName } = walletInfo;
	const { t } = useTranslation();

	const showWalletPopup = () => toggleWalletPopup(true);

	return (
		<Container>
			<HeaderSection>
				<Link to={ROUTES.Root}>
					<Logo theme={theme} />
				</Link>
				<Network>
					<NetworkLabel>{networkName}</NetworkLabel>
				</Network>
			</HeaderSection>
			<HeaderSection>
				<MenuLink to={ROUTES.Trade}>{t('header.links.exchange')}</MenuLink>
				<MenuLink to={ROUTES.Loans}>{t('header.links.loans')}</MenuLink>
				<ExternalMenuLink href={LINKS.Support}>{t('header.links.support')}</ExternalMenuLink>
				<ThemeSwitcher />
				{currentWallet != null ? (
					<WalletAddressWidget />
				) : (
					<ButtonPrimarySmall onClick={showWalletPopup}>
						{t('header.connect-wallet')}
					</ButtonPrimarySmall>
				)}
			</HeaderSection>
		</Container>
	);
};

const Container = styled(FlexDivCentered)`
	height: ${HEADER_HEIGHT};
	background-color: ${props => props.theme.colors.surfaceL3};
	padding: 0 24px;
	justify-content: space-between;
`;

const Network = styled(FlexDivCentered)`
	height: 32px;
	background-color: ${props => props.theme.colors.accentDark};
	margin-left: 26px;
	padding: 0 12px;
`;

const HeaderSection = styled(FlexDivCentered)`
	& > * {
		margin: 0 12px;
	}
`;

const menuLinkCSS = css`
	${labelMediumCSS};
	padding: 6px 20px;
	color: ${props => props.theme.colors.fontTertiary};
	&:hover {
		background-color: ${props => props.theme.colors.accentLight};
		color: ${props => props.theme.colors.fontSecondary};
	}
`;

const MenuLink = styled(Link)`
	${menuLinkCSS};
	&.active {
		background-color: ${props => props.theme.colors.accentLight};
		color: ${props => props.theme.colors.fontSecondary};
	}
`;

const ExternalMenuLink = styled(ExternalLink)`
	${menuLinkCSS}
`;

const NetworkLabel = styled(DataMedium)`
	text-transform: uppercase;
	color: ${props => props.theme.colors.fontTertiary};
`;

const mapStateToProps = state => ({
	walletInfo: getWalletInfo(state),
	theme: getCurrentTheme(state),
});

const mapDispatchToProps = {
	toggleWalletPopup,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
