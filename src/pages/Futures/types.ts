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

export type PositionDetails<T = number> = {
	accruedFunding: T;
	liquidationPrice: T;
	notionalValue: T;
	order: {
		pending: false;
		margin: T;
		leverage: T;
		fee: T;
		roundId: T;
	};
	position: {
		margin: T;
		size: T;
		entryPrice: T;
		entryIndex: T;
	};
	profitLoss: T;
	remainingMargin: T;
	isLong: boolean;
	isShort: boolean;
	hasPosition: boolean;
	hasOpenOrder: boolean;
	hasOrderOrPosition: boolean;
	hasConfirmedOrder: boolean;
};

export type Side = 'long' | 'short';
