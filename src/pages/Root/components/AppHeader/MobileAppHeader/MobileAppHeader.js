import React, { useState, memo } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';

import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { labelMediumCSS } from 'src/components/Typography/Label';
import Link from 'src/components/Link';

import { ReactComponent as MenuHamburgerIcon } from 'src/assets/images/menu-hamburger.svg';
import { ReactComponent as MenuCloseIcon } from 'src/assets/images/menu-close.svg';

import { ROUTES } from 'src/constants/routes';
import { LINKS } from 'src/constants/links';
import { APP_HEADER_HEIGHT, MOBILE_APP_HEADER_HEIGHT } from 'src/constants/ui';

import { FlexDivCentered } from 'src/shared/commonStyles';
import { media } from 'src/shared/media';

import { getCurrentTheme } from 'src/ducks';
import { toggleTheme } from 'src/ducks/ui';

import { isLightTheme } from 'src/styles/theme';

import Logo from '../Logo';
import UserInfo from '../UserInfo';

import Overlay from './Overlay';
import Dropdown from './Dropdown';

export const MobileAppHeader = memo(
	({ showThemeToggle, currentTheme, toggleTheme, isOnSplashPage, ...rest }) => {
		const [menuOpen, setMenuOpen] = useState(false);
		const { t } = useTranslation();

		const toggleMenu = () => setMenuOpen(!menuOpen);

		return (
			<>
				<Container {...rest}>
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
				{menuOpen && (
					<>
						<Overlay onClick={toggleMenu} />
						<StyledDropdown isOnSplashPage={isOnSplashPage}>
							<DropdownMenuLink to={ROUTES.Trade} onClick={toggleMenu}>
								{t('header.links.trade')}
							</DropdownMenuLink>
							<DropdownMenuLink to={ROUTES.Loans} onClick={toggleMenu}>
								{t('header.links.loans')}
							</DropdownMenuLink>
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
};

const Container = styled.header`
	height: ${APP_HEADER_HEIGHT};
	background-color: ${props =>
		props.isOnSplashPage ? props.theme.colors.surfaceL1 : props.theme.colors.surfaceL3};
	border-color: ${props => props.theme.colors.accentDark};
	border-style: solid;
	border-width: 1px 0;
	${media.small`
		height: ${MOBILE_APP_HEADER_HEIGHT}
	`}
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
		border-right: 1px solid ${props => props.theme.colors.accentDark};
	}
`;

const MenuItemsRight = styled(MenuItems)`
	${MenuItem} {
		border-left: 1px solid ${props => props.theme.colors.accentDark};
	}
`;

const StyledDropdown = styled(Dropdown)`
	${props =>
		props.isOnSplashPage &&
		css`
			background-color: ${props => props.theme.colors.surfaceL1};
		`}
`;

const dropdownItemCSS = css`
	${labelMediumCSS};
	padding: 20px 24px;
	display: flex;
	align-items: center;
	color: ${props => props.theme.colors.fontTertiary};
	text-transform: uppercase;
	&:hover {
		color: ${props => props.theme.colors.fontPrimary};
		background-color: ${props => props.theme.colors.accentDark};
	}
	cursor: pointer;
`;

const DropdownMenuLink = styled(Link)`
	${dropdownItemCSS};
	&.active {
		background-color: ${props => props.theme.colors.accentLight};
		color: ${props => props.theme.colors.fontPrimary};
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

const mapStateToProps = state => ({
	currentTheme: getCurrentTheme(state),
});

const mapDispatchToProps = {
	toggleTheme,
};

export default connect(mapStateToProps, mapDispatchToProps)(MobileAppHeader);
