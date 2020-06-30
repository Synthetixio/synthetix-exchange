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

export type OptionValue = {
	long: number;
	short: number;
};

export type OptionsTransactions = OptionsTransaction[];

export type OptionsTransactionsMap = Record<string, OptionsTransactions>;

export type HistoricalOptionsMarketInfo = {
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
	finalPrice: number;
	strikePrice: number;
	biddingEndDate: number;
	maturityDate: number;
	expiryDate: number;
	longPrice: number;
	shortPrice: number;
	asset: string;
	phase: Phase;
	timeRemaining: number;
	result: Side;
	totalBids: OptionValue;
	totalClaimableSupplies: OptionValue;
	totalSupplies: OptionValue;
	deposits: {
		deposited: number;
		exercisableDeposits: number;
	};
	creator: string;
	options: OptionValue;
	fees: {
		creatorFee: number;
		poolFee: number;
		refundFee: number;
	};
	creatorLimits: {
		capitalRequirement: number;
		skewLimit: number;
	};
};

export type AccountMarketInfo = {
	claimable: OptionValue;
	balances: OptionValue;
	bids: OptionValue;
};

export type OptionsMarkets = HistoricalOptionsMarketInfo[];
export type OptionsMarketsMap = Record<string, HistoricalOptionsMarketInfo>;
