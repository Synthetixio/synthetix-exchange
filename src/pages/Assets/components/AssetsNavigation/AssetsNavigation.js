import React, { memo } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import Link from 'src/components/Link';
import { labelSmallCSS } from 'src/components/Typography/Label';

import { ReactComponent as ChartsSquareIcon } from 'src/assets/images/charts-square.svg';
import { ReactComponent as ClockSquareIcon } from 'src/assets/images/clock-square.svg';

import { ROUTES } from 'src/constants/routes';

const MenuLinks = [
	{
		route: ROUTES.Assets.Overview,
		i18nKey: 'assets.navigation.overview',
		icon: <ClockSquareIcon />,
	},
	{
		route: ROUTES.Assets.Transactions,
		i18nKey: 'assets.navigation.transactions',
		icon: <ChartsSquareIcon />,
	},
];

const AssetsNavigation = memo(() => {
	const { t } = useTranslation();

	return (
		<ul>
			{MenuLinks.map(({ route, i18nKey, icon }) => (
				<li key={route}>
					<ListItemLink to={route}>
						<span>{t(i18nKey)}</span>
						{icon}
					</ListItemLink>
				</li>
			))}
		</ul>
	);
});

const ListItemLink = styled(Link)`
	${labelSmallCSS};
	width: 170px;
	border: 1px solid ${props => props.theme.colors.accentL2};
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

export default AssetsNavigation;
