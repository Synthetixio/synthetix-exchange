import ROUTES from 'constants/routes';

export const MENU_LINKS = [
	{
		i18nLabel: 'header.links.markets',
		link: ROUTES.Markets,
	},
	{
		i18nLabel: 'header.links.synths',
		link: ROUTES.Synths.Home,
	},
	{
		i18nLabel: 'header.links.trade',
		link: ROUTES.Trade,
	},
	{
		i18nLabel: 'header.links.loans',
		link: ROUTES.Loans,
	},
	{
		i18nLabel: 'header.links.options',
		link: ROUTES.Options.Home,
	},
];

export const MENU_LINKS_LOGGED_IN = [
	{
		i18nLabel: 'header.links.assets',
		link: ROUTES.Assets.Home,
	},
];
