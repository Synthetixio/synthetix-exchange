import { CurrencyKey } from 'constants/currency';

export type Phase = 'bidding' | 'trading' | 'maturity' | 'expiry';

export type Side = 'long' | 'short';

export type OptionsTransactionType = 'refund' | 'bid';

export type OptionsTransaction = {
	hash: string;
	type: OptionsTransactionType;
	account: string;
	currencyKey: CurrencyKey;
	timestamp: number;
	side: Side;
	amount: number;
	market: string;
};

export type OptionsTransactions = OptionsTransaction[];

export type OptionsTransactionsMap = Record<string, OptionsTransactions>;

export type OptionsMarket = {
	address: string;
	timestamp: number;
	creator: string;
	currencyKey: CurrencyKey;
	strikePrice: number;
	biddingEndDate: number;
	maturityDate: number;
	expiryDate: number;
	isOpen: boolean;
	longPrice: number;
	shortPrice: number;
	poolSize: number;
	asset: string;
	phase: Phase;
	phaseNum: number;
	timeRemaining: number;
};

export type OptionsMarketInfo = {
	address: string;
	currencyKey: CurrencyKey;
	strikePrice: number;
	biddingEndDate: number;
	maturityDate: number;
	expiryDate: number;
	longPrice: number;
	shortPrice: number;
	asset: string;
	phase: Phase;
	timeRemaining: number;
};

export type OptionsMarkets = OptionsMarket[];
export type OptionsMarketsMap = Record<string, OptionsMarket>;
