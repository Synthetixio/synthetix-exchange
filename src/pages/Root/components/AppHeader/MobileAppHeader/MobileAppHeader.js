import React, { useState, memo } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';

import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { labelMediumCSS } from 'components/Typography/Label';
import Link from 'components/Link';

import { ReactComponent as MenuHamburgerIcon } from 'assets/images/menu-hamburger.svg';
import { ReactComponent as MenuCloseIcon } from 'assets/images/menu-close.svg';

import { ROUTES } from 'constants/routes';
import { LINKS } from 'constants/links';
import { APP_HEADER_HEIGHT, MOBILE_APP_HEADER_HEIGHT, Z_INDEX } from 'constants/ui';

import { FlexDivCentered } from 'shared/commonStyles';
import { media } from 'shared/media';

import { getCurrentTheme, toggleTheme } from 'ducks/ui';

import { isLightTheme } from 'styles/theme';

import Logo from '../Logo';
import UserInfo from '../UserInfo';

import Overlay from './Overlay';
import Dropdown from './Dropdown';

export const MobileAppHeader = memo(
	({ showThemeToggle, currentTheme, toggleTheme, isOnSplashPage, isLoggedIn, ...rest }) => {
		const [menuOpen, setMenuOpen] = useState(false);
		const { t } = useTranslation();

		const toggleMenu = () => setMenuOpen(!menuOpen);

		return (
			<>
				<Container isOnSplashPage={isOnSplashPage} {...rest}>
					<Content>
						<MenuItemsLeft>
							<MenuItem>
								<StyledLogoLink to={ROUTES.Home}>
									<Logo />
								</StyledLogoLink>
							</MenuItem>
						</MenuItemsLeft>
						<MenuItemsRight>
							<MenuItem>
								<UserInfo />
							</MenuItem>
							<MenuItem>
								<MenuToggleButton onClick={toggleMenu}>
									{menuOpen ? <MenuCloseIcon /> : <MenuHamburgerIcon />}
								</MenuToggleButton>
							</MenuItem>
						</MenuItemsRight>
					</Content>
				</Container>
				<MenuPusher />
				{menuOpen && (
					<>
						<Overlay onClick={toggleMenu} />
						<StyledDropdown isOnSplashPage={isOnSplashPage}>
							<DropdownMenuLink to={ROUTES.Markets} onClick={toggleMenu}>
								{t('header.links.markets')}
							</DropdownMenuLink>
							<DropdownMenuLink to={ROUTES.Synths.Home} onClick={toggleMenu}>
								{t('header.links.synths')}
							</DropdownMenuLink>
							<DropdownMenuLink to={ROUTES.Trade} onClick={toggleMenu}>
								{t('header.links.trade')}
							</DropdownMenuLink>
							<DropdownMenuLink to={ROUTES.Loans} onClick={toggleMenu}>
								{t('header.links.loans')}
							</DropdownMenuLink>
							{isLoggedIn && (
								<DropdownMenuLink to={ROUTES.Assets.Home} onClick={toggleMenu}>
									{t('header.links.assets')}
								</DropdownMenuLink>
							)}
							<DropdownMenuLink to={LINKS.Support} isExternal={true} onClick={toggleMenu}>
								{t('header.links.support')}
							</DropdownMenuLink>
							{showThemeToggle && (
								<DropdownMenuItem
									onClick={() => {
										toggleMenu();
										toggleTheme();
									}}
								>
									{isLightTheme(currentTheme) ? t('header.theme.dark') : t('header.theme.light')}
								</DropdownMenuItem>
							)}
						</StyledDropdown>
					</>
				)}
			</>
		);
	}
);

MobileAppHeader.defaultProps = {
	showThemeToggle: true,
};

MobileAppHeader.propTypes = {
	showThemeToggle: PropTypes.bool,
	currentTheme: PropTypes.string.isRequired,
	toggleTheme: PropTypes.func.isRequired,
	className: PropTypes.string,
	isOnSplashPage: PropTypes.bool,
	isLoggedIn: PropTypes.bool,
};

const Container = styled.header`
	height: ${APP_HEADER_HEIGHT};
	background-color: ${(props) =>
		props.isOnSplashPage ? props.theme.colors.surfaceL1 : props.theme.colors.surfaceL3};
	border-color: ${(props) => props.theme.colors.accentL1};
	border-style: solid;
	border-width: 1px 0;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: ${Z_INDEX.APP_HEADER};
	${media.small`
		height: ${MOBILE_APP_HEADER_HEIGHT};
	`};
`;

const StyledLogoLink = styled(Link)`
	${media.small`
		width: 75px;
		height: 24px;
	`}
`;

const Content = styled(FlexDivCentered)`
	width: 100%;
	height: 100%;
	justify-content: space-between;
	margin: 0 auto;
`;

const MenuItem = styled(FlexDivCentered)`
	height: 100%;
	padding: 0 14px;

	${media.small`
		padding: 0 13px;
	`}
`;

const MenuItems = styled(FlexDivCentered)`
	height: 100%;
`;

const MenuItemsLeft = styled(MenuItems)`
	${MenuItem} {
		border-right: 1px solid ${(props) => props.theme.colors.accentL1};
	}
`;

const MenuItemsRight = styled(MenuItems)`
	${MenuItem} {
		border-left: 1px solid ${(props) => props.theme.colors.accentL1};
	}
`;

const StyledDropdown = styled(Dropdown)`
	${(props) =>
		props.isOnSplashPage &&
		css`
			background-color: ${(props) => props.theme.colors.surfaceL1};
		`}
`;

const dropdownItemCSS = css`
	${labelMediumCSS};
	padding: 20px 24px;
	display: flex;
	align-items: center;
	color: ${(props) => props.theme.colors.fontTertiary};
	text-transform: uppercase;
	&:hover {
		color: ${(props) => props.theme.colors.fontPrimary};
		background-color: ${(props) => props.theme.colors.accentL1};
	}
	cursor: pointer;
	${media.small`
		padding: 20px 24px;
	`}
`;

const DropdownMenuLink = styled(Link)`
	${dropdownItemCSS};
	&.active {
		background-color: ${(props) => props.theme.colors.accentL2};
		color: ${(props) => props.theme.colors.fontPrimary};
	}
`;

const DropdownMenuItem = styled.div.attrs({ role: 'button' })`
	${dropdownItemCSS};
`;

const MenuToggleButton = styled.button`
	background: transparent;
	border: 0;
	margin: 0;
	padding: 0;
	cursor: pointer;
	width: 24px;
	height: 24px;
	outline: none;

	${media.small`
		width: 16px;
		height: 16px;
	`}

	> svg {
		${media.small`
			width: 16px;
			height: 16px;
		`}
	}
`;

const MenuPusher = styled.div`
	padding-top: ${APP_HEADER_HEIGHT};

	${media.small`
		padding-top: ${MOBILE_APP_HEADER_HEIGHT};
	`}
`;

const mapStateToProps = (state) => ({
	currentTheme: getCurrentTheme(state),
});

const mapDispatchToProps = {
	toggleTheme,
};

export default connect(mapStateToProps, mapDispatchToProps)(MobileAppHeader);
