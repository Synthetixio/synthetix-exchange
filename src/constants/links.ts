import { CurrencyKey } from './currency';

export const LINKS = {
	Support: 'https://synthetix.community/docs/other',
	Tokens: 'https://www.synthetix.io/tokens/',
	Trading: {
		DexAG: 'https://dex.ag/',
		Uniswap: 'https://uniswap.exchange/',
		OneInchLink: (base: CurrencyKey, quote: CurrencyKey) =>
			`https://1inch.exchange/#/${base}/${quote}`,
	},
	Learn: {
		Litepaper: 'https://docs.synthetix.io/litepaper/',
		Tokens: 'https://docs.synthetix.io/tokens/',
		Blog: 'https://blog.synthetix.io/',
	},
	Products: {
		Mintr: 'https://mintr.synthetix.io',
		Dashboard: 'https://dashboard.synthetix.io/',
	},
	Social: {
		Twitter: 'https://twitter.com/synthetix_io',
		Medium: 'https://blog.synthetix.io/',
		Discord: 'https://discordapp.com/invite/AEdUHzt',
		GitHub: 'https://github.com/synthetixio',
	},
	Misc: {
		EthereumOrg: 'https://ethereum.org/',
		DefiNetwork: 'https://defi.network/',
		Messari: 'https://messari.io/asset/synthetix',
	},
	Blog: {
		HowBinaryOptionsWork: 'https://blog.synthetix.io/how-binary-options-work/',
		HowFeeReclamationRebatesWork: 'https://blog.synthetix.io/how-fee-reclamation-rebates-work/',
	},
};
