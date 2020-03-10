import React, { memo } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { labelMediumCSS } from 'src/components/Typography/Label';

import { ROUTES } from 'src/constants/routes';
import { APP_HEADER_HEIGHT } from 'src/constants/ui';

import { FlexDivCentered, Link } from 'src/shared/commonStyles';

import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import UserInfo from './UserInfo';
import SupportLink from './SupportLink';

export const AppHeader = memo(({ showUserInfo, showThemeToggle, showSupportLink, ...rest }) => {
	const { t } = useTranslation();

	return (
		<Container {...rest}>
			<Content>
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
				</MenuItemsLeft>
				<MenuItemsRight>
					{showSupportLink && (
						<MenuItem>
							<SupportLink />
						</MenuItem>
					)}
					{showThemeToggle && (
						<MenuItem>
							<ThemeToggle />
						</MenuItem>
					)}
					{showUserInfo && (
						<MenuItem>
							<UserInfo />
						</MenuItem>
					)}
				</MenuItemsRight>
			</Content>
		</Container>
	);
});

AppHeader.defaultProps = {
	showUserInfo: true,
	showThemeToggle: true,
	showSupportLink: true,
};

AppHeader.propTypes = {
	showUserInfo: PropTypes.bool,
	showThemeToggle: PropTypes.bool,
	showSupportLink: PropTypes.bool,
	className: PropTypes.string,
};

const Container = styled.header`
	height: ${APP_HEADER_HEIGHT};
	background-color: ${props => props.theme.colors.surfaceL3};
	border-color: ${props => props.theme.colors.accentDark};
	border-style: solid;
	border-width: 1px 0;
	overflow: hidden;
`;

const Content = styled(FlexDivCentered)`
	width: 100%;
	height: 100%;
	justify-content: space-between;
	margin: 0 auto;
	padding: 0 16px;
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
		background-color: ${props => props.theme.colors.accentDark};
	}
	&.active {
		background-color: ${props => props.theme.colors.accentLight};
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

export default AppHeader;
