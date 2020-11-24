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

export type MarketDetails<T = number> = {
	baseAsset: string;
	exchangeFee: T;
	fundingParameters: {
		maxFundingRate: T;
		maxFundingRateSkew: T;
		maxFundingRateDelta: T;
	};
	marketSizeDetails: {
		entryMarginSumMinusNotionalSkew: T;
		marketDebt: T;
		marketSize: T;
		marketSkew: T;
		pendingOrderValue: T;
		proportionalSkew: T;
		sides: {
			long: T;
			short: T;
		};
	};
	limits: { maxLeverage: T; maxMarketDebt: T; minInitialMargin: T };
	market: string;
	priceDetails: {
		price: T;
		currentRoundId: T;
		isInvalid: true;
	};
};
