import React, { FC, memo } from 'react';
import { useMediaQuery } from 'react-responsive';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { labelMediumCSS } from 'components/Typography/Label';
import Link from 'components/Link';

import { ROUTES } from 'constants/routes';
import { APP_HEADER_HEIGHT } from 'constants/ui';

import { FlexDivCentered } from 'shared/commonStyles';

import { mediumMediaQuery } from 'shared/media';

import { RootState } from 'ducks/types';
import { getIsLoggedIn } from 'ducks/wallet/walletDetails';

import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import UserInfo from './UserInfo';
import SupportLink from './SupportLink';

import MobileAppHeader from './MobileAppHeader';

import { MENU_LINKS, MENU_LINKS_LOGGED_IN } from './constants';

type StateProps = {
	isLoggedIn: boolean;
};

type Props = {
	showThemeToggle?: boolean;
	className?: string;
	isOnSplashPage?: boolean;
};

type AppHeaderProps = StateProps & Props;

export const AppHeader: FC<AppHeaderProps> = memo((props) => {
	const { showThemeToggle = true, isOnSplashPage, isLoggedIn, ...rest } = props;
	const { t } = useTranslation();

	const isTabletOrMobile = useMediaQuery({ query: mediumMediaQuery });

	if (isTabletOrMobile) {
		return <MobileAppHeader {...props} />;
	}

	return (
		<Container isOnSplashPage={isOnSplashPage} {...rest}>
			<Content>
				<MenuItemsLeft>
					<MenuItem>
						<StyledLogoLink to={ROUTES.Home}>
							<Logo />
						</StyledLogoLink>
					</MenuItem>
					{MENU_LINKS.map(({ i18nLabel, link }) => (
						<MenuLinkItem key={link}>
							<MenuLink to={link}>{t(i18nLabel)}</MenuLink>
						</MenuLinkItem>
					))}
					{isLoggedIn &&
						MENU_LINKS_LOGGED_IN.map(({ i18nLabel, link }) => (
							<MenuLinkItem key={link}>
								<MenuLink to={link}>{t(i18nLabel)}</MenuLink>
							</MenuLinkItem>
						))}
				</MenuItemsLeft>
				<MenuItemsRight>
					<MenuItem>
						<SupportLink isOnSplashPage={isOnSplashPage} />
					</MenuItem>
					{showThemeToggle && (
						<MenuItem>
							<ThemeToggle />
						</MenuItem>
					)}
					<MenuItem>
						<UserInfo isOnSplashPage={isOnSplashPage} />
					</MenuItem>
				</MenuItemsRight>
			</Content>
		</Container>
	);
});

const StyledLogoLink = styled(Link)`
	height: 24px;
`;

export const Container = styled.header<{ isOnSplashPage?: boolean }>`
	height: ${APP_HEADER_HEIGHT};
	background-color: ${(props) =>
		props.isOnSplashPage ? props.theme.colors.surfaceL1 : props.theme.colors.surfaceL3};
	border-color: ${({ theme }) => theme.colors.accentL1};
	border-style: solid;
	border-width: 1px 0;
`;

const Content = styled(FlexDivCentered)`
	width: 100%;
	height: 100%;
	justify-content: space-between;
	margin: 0 auto;
	padding: 0 8px;
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
	color: ${({ theme }) => theme.colors.fontTertiary};
	text-transform: uppercase;
	height: 32px;
	&:hover {
		color: ${({ theme }) => theme.colors.fontPrimary};
		background-color: ${({ theme }) => theme.colors.accentL1};
	}
	&.active {
		background-color: ${({ theme }) => theme.colors.accentL2};
		color: ${({ theme }) => theme.colors.fontPrimary};
	}
`;

const MenuItems = styled(FlexDivCentered)`
	height: 100%;
`;

const MenuItemsLeft = styled(MenuItems)`
	${MenuItem} {
		&:first-child {
			padding-left: 12px;
		}
		padding-right: 18px;
	}
`;

const MenuItemsRight = styled(MenuItems)`
	${MenuItem} {
		padding-left: 18px;
	}
`;

const mapStateToProps = (state: RootState): StateProps => ({
	isLoggedIn: getIsLoggedIn(state),
});

export default connect<StateProps, {}, Props, RootState>(mapStateToProps)(AppHeader);
