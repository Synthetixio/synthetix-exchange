import React, { memo } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import { useMediaQuery } from 'react-responsive';

import PropTypes from 'prop-types';

import { Button } from 'src/components/Button';

import { APP_HEADER_HEIGHT } from 'src/constants/ui';

import { FlexDivCentered } from 'src/shared/commonStyles';

import { showLeaderboardPopup, showDashboardPopup } from 'src/ducks/ui';

import { mediumMediaQuery, media } from 'src/shared/media';

import Logo from './Logo';
import UserInfo from './UserInfo';

export const AppHeader = memo(props => {
	const { isOnSplashPage, showLeaderboardPopup, showDashboardPopup, ...rest } = props;

	const isTabletOrMobile = useMediaQuery({ query: mediumMediaQuery });

	return (
		<Container isOnSplashPage={isOnSplashPage} {...rest}>
			<Content isOnSplashPage={isOnSplashPage}>
				<MenuItemsLeft>
					<MenuItem>
						<Logo key="app-header" />
					</MenuItem>
				</MenuItemsLeft>
				<MenuItemsRight>
					{(!isTabletOrMobile || isOnSplashPage) && (
						<MenuItemButtons>
							<Button onClick={showDashboardPopup} size="sm" palette="secondary">
								Dashboard
							</Button>
							<Button onClick={showLeaderboardPopup} size="sm" palette="secondary">
								Leaderboard
							</Button>
						</MenuItemButtons>
					)}
					{!isOnSplashPage && (
						<MenuItem>
							<UserInfo isTabletOrMobile={isTabletOrMobile} />
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
};

export const Container = styled.header`
	height: ${APP_HEADER_HEIGHT};
	${props =>
		props.isOnSplashPage
			? css`
					background: ${props => props.theme.colors.surfaceL2};
			  `
			: css`
					border-color: ${props => props.theme.colors.accentL1};
					${media.small`
						border-color: #3230b0;
					`}
					${media.medium`
						border-color: #3230b0;
					`}
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
		&:first-child {
			padding-right: 0;
		}
	}
`;

const MenuItemsRight = styled(MenuItems)`
	${MenuItem} {
		padding-left: 18px;
		&:first-child {
			padding-left: 0;
		}
	}
`;

const MenuItemButtons = styled(MenuItems)`
	& > button + button {
		margin-left: 12px;
	}
`;

const mapDispatchToProps = {
	showLeaderboardPopup,
	showDashboardPopup,
};

export default connect(null, mapDispatchToProps)(AppHeader);
