import React, { memo } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import Link from 'src/components/Link';
import { labelSmallCSS } from 'src/components/Typography/Label';

import { ReactComponent as ChartsSquareIcon } from 'src/assets/images/charts-square.svg';
import { ReactComponent as ClockSquareIcon } from 'src/assets/images/clock-square.svg';
import { ReactComponent as ArrowsSquareIcon } from 'src/assets/images/arrows-square.svg';

import { ROUTES } from 'src/constants/routes';

const MenuLinks = [
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
	{
		route: ROUTES.Assets.Transfers,
		i18nKey: 'assets.navigation.transfers',
		icon: <ArrowsSquareIcon />,
	},
];

const AssetsNavigation = memo(() => {
	const { t } = useTranslation();

	return (
		<div>
			<List>
				{MenuLinks.map(({ route, i18nKey, icon }) => (
					<li key={route}>
						<ListItemLink to={route}>
							<span>{t(i18nKey)}</span>
							{icon}
						</ListItemLink>
					</li>
				))}
			</List>
		</div>
	);
});

const ListItemLink = styled(Link)`
	${labelSmallCSS};
	width: 170px;
	border-bottom: 1px solid ${props => props.theme.colors.accentL2};
	font-size: 12px;
	padding: 10px 16px;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: space-between;
	text-transform: uppercase;
	color: ${props => props.theme.colors.fontSecondary};
	background-color: ${props => props.theme.colors.surfaceL2};
	&:hover {
		color: ${props => props.theme.colors.fontPrimary};
		background-color: ${props => props.theme.colors.accentL1};
	}
	&.active {
		background-color: ${props => props.theme.colors.accentL2};
		color: ${props => props.theme.colors.fontPrimary};
	}
`;

const List = styled.ul`
	border: 1px solid ${props => props.theme.colors.accentL2};
	> * {
		&:last-child > ${ListItemLink} {
			border: 0;
		}
	}
`;

export default AssetsNavigation;
