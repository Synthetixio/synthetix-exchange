import React, { FC, useState, memo, useContext } from 'react';
import styled, { css, ThemeContext } from 'styled-components';
import { connect } from 'react-redux';

import { useTranslation } from 'react-i18next';

import { labelMediumCSS } from 'components/Typography/Label';
import Link from 'components/Link';

import { ReactComponent as MenuHamburgerIcon } from 'assets/images/menu-hamburger.svg';
import { ReactComponent as MenuCloseIcon } from 'assets/images/menu-close.svg';

import { ROUTES } from 'constants/routes';
import { LINKS } from 'constants/links';
import { APP_HEADER_HEIGHT, MOBILE_APP_HEADER_HEIGHT, Z_INDEX } from 'constants/ui';

import { FlexDivCentered } from 'shared/commonStyles';
import { media } from 'shared/media';

import { toggleTheme } from 'ducks/ui';
import { RootState } from 'ducks/types';

import Logo from '../Logo';
import UserInfo from '../UserInfo';

import Overlay from './Overlay';
import Dropdown from './Dropdown';

import { MENU_LINKS, MENU_LINKS_LOGGED_IN } from '../constants';

type DispatchProps = {
	toggleTheme: typeof toggleTheme;
};

type Props = {
	isLoggedIn: boolean;
	showThemeToggle?: boolean;
	className?: string;
	isOnSplashPage?: boolean;
};

type MobileAppHeaderProps = DispatchProps & Props;

export const MobileAppHeader: FC<MobileAppHeaderProps> = memo(
	({ showThemeToggle = true, toggleTheme, isOnSplashPage, isLoggedIn, ...rest }) => {
		const [menuOpen, setMenuOpen] = useState(false);
		const { t } = useTranslation();

		const toggleMenu = () => setMenuOpen(!menuOpen);
		const theme = useContext(ThemeContext);

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
								<UserInfo isOnSplashPage={isOnSplashPage} />
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
							{MENU_LINKS.map(({ i18nLabel, link }) => (
								<DropdownMenuLink to={link} onClick={toggleMenu} key={link}>
									{t(i18nLabel)}
								</DropdownMenuLink>
							))}
							{isLoggedIn &&
								MENU_LINKS_LOGGED_IN.map(({ i18nLabel, link }) => (
									<DropdownMenuLink to={ROUTES.Assets.Home} onClick={toggleMenu}>
										{t(i18nLabel)}
									</DropdownMenuLink>
								))}
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
									{theme.isLightTheme ? t('header.theme.dark') : t('header.theme.light')}
								</DropdownMenuItem>
							)}
						</StyledDropdown>
					</>
				)}
			</>
		);
	}
);

const Container = styled.header<{ isOnSplashPage?: boolean }>`
	height: ${APP_HEADER_HEIGHT};
	background-color: ${(props) =>
		props.isOnSplashPage ? props.theme.colors.surfaceL1 : props.theme.colors.surfaceL3};
	border-color: ${(props) => props.theme.colors.accentL1};
	border-style: solid;
	border-width: 1px 0;
	position: fixed;
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

const StyledDropdown = styled(Dropdown)<{ isOnSplashPage?: boolean }>`
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

const mapDispatchToProps: DispatchProps = {
	toggleTheme,
};

export default connect<{}, DispatchProps, Props, RootState>(
	null,
	mapDispatchToProps
)(MobileAppHeader);
