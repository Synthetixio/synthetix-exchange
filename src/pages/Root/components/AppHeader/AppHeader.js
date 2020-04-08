import React, { memo } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import Link from 'src/components/Link';
import { Button } from 'src/components/Button';

import { ROUTES } from 'src/constants/routes';
import { APP_HEADER_HEIGHT } from 'src/constants/ui';

import { FlexDivCentered } from 'src/shared/commonStyles';

import { getIsLoggedIn } from 'src/ducks/wallet/walletDetails';
import { showLeaderboardPopup } from 'src/ducks/ui';

import Logo from './Logo';
import UserInfo from './UserInfo';

export const AppHeader = memo(props => {
	const { isOnSplashPage, isLoggedIn, showLeaderboardPopup, ...rest } = props;

	return (
		<Container isOnSplashPage={isOnSplashPage} {...rest}>
			<Content isOnSplashPage={isOnSplashPage}>
				<MenuItemsLeft>
					<MenuItem>
						<Link to={ROUTES.Home}>
							<Logo />
						</Link>
					</MenuItem>
				</MenuItemsLeft>
				<MenuItemsRight>
					<MenuItem>
						<Button onClick={showLeaderboardPopup} size="sm" palette="secondary">
							Leaderboard
						</Button>
					</MenuItem>
					{isLoggedIn && (
						<MenuItem>
							<UserInfo isOnSplashPage={isOnSplashPage} />
						</MenuItem>
					)}
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
	${props =>
		props.isOnSplashPage
			? css`
					background: ${props => props.theme.colors.surfaceL1};
			  `
			: css`
					border-color: ${props => props.theme.colors.accentL1};
					border-style: solid;
					border-width: 1px 0;
					background: ${props => props.theme.colors.surfaceL3};
			  `}
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

const mapDispatchToProps = {
	showLeaderboardPopup,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppHeader);
