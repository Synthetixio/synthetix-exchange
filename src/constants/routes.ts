import history from '../utils/history';
import { CurrencyKey } from './currency';

export const ROUTES = {
	Home: '/',
	Trade: '/trade',
	TradeMatch: '/trade/:baseCurrencyKey-:quoteCurrencyKey',
	Loans: '/loans',
	Assets: {
		Home: '/assets',
		Overview: '/assets/overview',
		Exchanges: '/assets/exchanges',
		Transfers: '/assets/transfers',
	},
	Markets: '/markets',
	Synths: {
		Home: '/synths',
		OverviewMatch: '/synths/:currencyKey',
	},
};

export const buildSynthOverviewLink = (currencyKey: CurrencyKey) =>
	`${ROUTES.Synths.Home}/${currencyKey}`;

export const buildTradeLink = (baseCurrencyKey: CurrencyKey, quoteCurrencyKey: CurrencyKey) =>
	`${ROUTES.Trade}/${baseCurrencyKey}-${quoteCurrencyKey}`;

export const navigateTo = (
	path: string,
	replacePath: boolean = false,
	scrollToTop: boolean = false
) => {
	if (scrollToTop) {
		window.scrollTo(0, 0);
	}
	replacePath ? history.replace(path) : history.push(path);
};

export const navigateToTrade = (
	baseCurrencyKey: CurrencyKey,
	quoteCurrencyKey: CurrencyKey,
	replacePath: boolean = false
) => navigateTo(buildTradeLink(baseCurrencyKey, quoteCurrencyKey), replacePath);

export const navigateToSynthOverview = (
	currencyKey: CurrencyKey,
	replacePath: boolean = false,
	scrollToTop: boolean = true
) => navigateTo(buildSynthOverviewLink(currencyKey), replacePath, scrollToTop);

export default ROUTES;
