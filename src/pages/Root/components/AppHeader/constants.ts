import ROUTES from 'constants/routes';

export type MenuLink = {
	i18nLabel: string;
	link: string;
	isBeta?: boolean;
};

export type MenuLinks = MenuLink[];

export const MENU_LINKS: MenuLinks = [
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
		isBeta: true,
	},
];

export const MENU_LINKS_WALLET_CONNECTED: MenuLinks = [
	{
		i18nLabel: 'header.links.assets',
		link: ROUTES.Assets.Home,
	},
];
