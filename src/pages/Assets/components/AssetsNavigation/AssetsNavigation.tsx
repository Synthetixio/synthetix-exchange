import React, { FC } from 'react';
import { Route } from 'react-router-dom';
import styled from 'styled-components';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Link from 'components/Link';
import { labelSmallCSS } from 'components/Typography/Label';

import { toggleHideSmallValueAssets, getHideSmallValueAssets } from 'ducks/ui';

import { ReactComponent as ChartsSquareIcon } from 'assets/images/charts-square.svg';
import { ReactComponent as ClockSquareIcon } from 'assets/images/clock-square.svg';
// import { ReactComponent as ArrowsSquareIcon } from 'assets/images/arrows-square.svg';
import { ReactComponent as ArrowsRotatedSquareIcon } from 'assets/images/arrows-rotated-square.svg';

import { ROUTES } from 'constants/routes';
import { RootState } from 'ducks/types';

const MENU_LINKS: Array<{ route: string; i18nKey: string; icon: React.ReactNode }> = [
	{
		route: ROUTES.Assets.Overview,
		i18nKey: 'assets.navigation.overview',
		icon: <ClockSquareIcon />,
	},
	{
		route: ROUTES.Assets.Exchanges,
		i18nKey: 'assets.navigation.exchanges',
		icon: <ChartsSquareIcon />,
	},
	/* Transfers page is disabled for now.
	{
		route: ROUTES.Assets.Transfers,
		i18nKey: 'assets.navigation.transfers',
		icon: <ArrowsSquareIcon />,
	},
	*/
	{
		route: ROUTES.Assets.Options.Home,
		i18nKey: 'assets.navigation.options',
		icon: <ArrowsRotatedSquareIcon />,
	},
];

const mapStateToProps = (state: RootState) => ({
	hideSmallValueAssets: getHideSmallValueAssets(state),
});

const mapDispatchToProps = {
	toggleHideSmallValueAssets,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type AssetsNavigationProps = PropsFromRedux;

const AssetsNavigation: FC<AssetsNavigationProps> = ({
	toggleHideSmallValueAssets,
	hideSmallValueAssets,
}) => {
	const { t } = useTranslation();

	return (
		<Container>
			<List>
				{MENU_LINKS.map(({ route, i18nKey, icon }) => (
					<li key={route}>
						<ListItemLink to={route}>
							<span>{t(i18nKey)}</span>
							{icon}
						</ListItemLink>
					</li>
				))}
			</List>
			<Route
				path={ROUTES.Assets.Overview}
				render={() => (
					<SmallValueAssets onClick={() => toggleHideSmallValueAssets()} role="button">
						{hideSmallValueAssets
							? t('assets.balances.show-small-value')
							: t('assets.balances.hide-small-value')}
					</SmallValueAssets>
				)}
			/>
		</Container>
	);
};

const Container = styled.div`
	background-color: ${(props) => props.theme.colors.surfaceL2};
	padding: 20px;
`;

const ListItemLink = styled(Link)`
	${labelSmallCSS};
	width: 170px;
	border-bottom: 1px solid ${(props) => props.theme.colors.accentL2};
	font-size: 12px;
	padding: 10px 16px;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: space-between;
	text-transform: uppercase;
	color: ${(props) => props.theme.colors.fontSecondary};
	background-color: ${(props) => props.theme.colors.surfaceL2};
	&:hover {
		color: ${(props) => props.theme.colors.fontPrimary};
		background-color: ${(props) => props.theme.colors.accentL1};
	}
	&.active {
		background-color: ${(props) => props.theme.colors.accentL2};
		color: ${(props) => props.theme.colors.fontPrimary};
	}
`;

const List = styled.ul`
	border: 1px solid ${(props) => props.theme.colors.accentL2};
	> * {
		&:last-child > ${ListItemLink} {
			border: 0;
		}
	}

	margin-bottom: 24px;
`;

const SmallValueAssets = styled.div`
	${labelSmallCSS};
	background-color: ${(props) => props.theme.colors.accentL1};
	border: 1px solid ${(props) => props.theme.colors.accentL2};
	color: ${(props) => props.theme.colors.fontSecondary};
	cursor: pointer;
	width: 170px;
	padding: 5px;
	box-sizing: border-box;
	text-align: center;
	&:hover {
		color: ${(props) => props.theme.colors.fontPrimary};
		background-color: ${(props) => props.theme.colors.accentL2};
	}
`;

export default connector(AssetsNavigation);
