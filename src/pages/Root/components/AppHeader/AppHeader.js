import React, { memo } from 'react';
import { useMediaQuery } from 'react-responsive';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import { labelMediumCSS } from 'src/components/Typography/Label';
import Link from 'src/components/Link';

import { ROUTES } from 'src/constants/routes';
import { APP_HEADER_HEIGHT } from 'src/constants/ui';

import { FlexDivCentered } from 'src/shared/commonStyles';

import { mediumMediaQuery, breakpoint } from 'src/shared/media';

import { getIsLoggedIn } from 'src/ducks/wallet';

import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import UserInfo from './UserInfo';
import SupportLink from './SupportLink';

import MobileAppHeader from './MobileAppHeader';

export const AppHeader = memo(props => {
	const { showThemeToggle, isOnSplashPage, isLoggedIn, ...rest } = props;
	const { t } = useTranslation();

	const isTabletOrMobile = useMediaQuery({ query: mediumMediaQuery });

	if (isTabletOrMobile) {
		return <MobileAppHeader {...props} />;
	}

	return (
		<Container isOnSplashPage={isOnSplashPage} {...rest}>
			<Content isOnSplashPage={isOnSplashPage}>
				<MenuItemsLeft>
					<MenuItem>
						<Link to={ROUTES.Home}>
							<Logo />
						</Link>
					</MenuItem>
					<MenuLinkItem>
						<MenuLink to={ROUTES.Trade}>{t('header.links.trade')}</MenuLink>
					</MenuLinkItem>
					<MenuLinkItem>
						<MenuLink to={ROUTES.Loans}>{t('header.links.loans')}</MenuLink>
					</MenuLinkItem>
					{isLoggedIn && (
						<MenuLinkItem>
							<MenuLink to={ROUTES.Assets.Home}>{t('header.links.assets')}</MenuLink>
						</MenuLinkItem>
					)}
				</MenuItemsLeft>
				<MenuItemsRight>
					<MenuItem>
						<SupportLink />
					</MenuItem>
					{showThemeToggle && (
						<MenuItem>
							<ThemeToggle />
						</MenuItem>
					)}
					<MenuItem>
						<UserInfo />
					</MenuItem>
				</MenuItemsRight>
			</Content>
		</Container>
	);
});

AppHeader.defaultProps = {
	showThemeToggle: true,
};

AppHeader.propTypes = {
	showThemeToggle: PropTypes.bool,
	className: PropTypes.string,
	isOnSplashPage: PropTypes.bool,
	isLoggedIn: PropTypes.bool,
};

export const Container = styled.header`
	height: ${APP_HEADER_HEIGHT};
	background-color: ${props =>
		props.isOnSplashPage ? props.theme.colors.surfaceL1 : props.theme.colors.surfaceL3};
	border-color: ${props => props.theme.colors.accentL1};
	border-style: solid;
	border-width: 1px 0;
`;

const Content = styled(FlexDivCentered)`
	width: 100%;
	height: 100%;
	justify-content: space-between;
	margin: 0 auto;
	padding: 0 16px;
	${props =>
		props.isOnSplashPage &&
		css`
			max-width: ${breakpoint.extraLarge}px;
		`}
`;

const MenuItem = styled(FlexDivCentered)`
	height: 100%;
`;

const MenuLinkItem = styled(MenuItem)`
	padding: 0;
`;

const MenuLink = styled(Link)`
	${labelMediumCSS};
	padding: 6px 10px;
	display: flex;
	align-items: center;
	color: ${props => props.theme.colors.fontTertiary};
	text-transform: uppercase;
	height: 32px;
	&:hover {
		color: ${props => props.theme.colors.fontPrimary};
		background-color: ${props => props.theme.colors.accentL1};
	}
	&.active {
		background-color: ${props => props.theme.colors.accentL2};
		color: ${props => props.theme.colors.fontPrimary};
	}
`;

const MenuItems = styled(FlexDivCentered)`
	height: 100%;
`;

const MenuItemsLeft = styled(MenuItems)`
	${MenuItem} {
		padding-right: 18px;
	}
`;

const MenuItemsRight = styled(MenuItems)`
	${MenuItem} {
		padding-left: 18px;
	}
`;

const mapStateToProps = state => ({
	isLoggedIn: getIsLoggedIn(state),
});

export default connect(mapStateToProps, null)(AppHeader);
