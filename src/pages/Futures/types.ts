export type MarketSummary<T = number> = {
	currentFundingRate: T;
	exchangeFee: T;
	market: string;
	marketDebt: T;
	marketSize: T;
	marketSkew: T;
	maxLeverage: T;
	price: T;
	asset: string;
};

export type MarketSummaryMap = Record<string, MarketSummary>;
