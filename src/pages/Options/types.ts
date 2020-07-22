import { CurrencyKey } from 'constants/currency';
import { BigNumberish } from 'ethers/utils';

export type Phase = 'bidding' | 'trading' | 'maturity' | 'expiry';

export type Side = 'long' | 'short';

export type OptionsTransactionType = 'refund' | 'bid' | 'exercise' | 'claim';

export type OptionsTransaction = {
	hash: string;
	type: OptionsTransactionType;
	account: string;
	currencyKey: CurrencyKey;
	timestamp: number;
	side: Side;
	amount: number | string;
	market: string;
	status?: 'pending' | 'confirmed';
	claimedShort?: number;
	claimedLong?: number;
};

export type OptionValue = {
	long: number;
	short: number;
};

export type BNOptionValue = {
	totalLongBN: BigNumberish;
	totalShortBN: BigNumberish;
	depositedBN: BigNumberish;
	feeBN: BigNumberish;
	refundFeeBN: BigNumberish;
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
	isResolved: boolean;
	address: string;
	currencyKey: CurrencyKey;
	priceUpdatedAt: number;
	currentPrice: number;
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
	BN: BNOptionValue;
	withdrawalsEnabled: boolean;
};

export type AccountMarketInfo = {
	claimable: OptionValue;
	balances: OptionValue;
	bids: OptionValue;
};

export type OptionsMarkets = HistoricalOptionsMarketInfo[];
export type OptionsMarketsMap = Record<string, HistoricalOptionsMarketInfo>;

export type TradeCardPhaseProps = {
	optionsMarket: OptionsMarketInfo;
	accountMarketInfo: AccountMarketInfo;
};
