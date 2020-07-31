import { CurrencyKey } from './currency';

export const TRANSACTION_STATUS = {
	WAITING: 'waiting',
	PENDING: 'pending',
	CONFIRMED: 'confirmed',
	FAILED: 'failed',
	CANCELLED: 'cancelled',
	CANCELLING: 'cancelling',
};

export type OrderType = 'limit' | 'market';

export type Transaction = {
	id?: number;
	timestamp: number;
	base: CurrencyKey;
	quote: CurrencyKey;
	fromAmount: number;
	toAmount: number;
	orderType: 'limit' | 'market';
	status: string;
	priceUSD: string;
	totalUSD: string;
	orderId: number;
	hash?: string;
};

export type Transactions = Transaction[];

export type LimitOrder = {
	account: string;
	deposit: number;
	timestamp: number;
	hash: string;
	sourceAmount: number;
	destinationCurrencyKey: CurrencyKey;
	executionFee: number;
	id: number;
	minDestinationAmount: number;
	sourceCurrencyKey: CurrencyKey;
	status: string;
};

export type LimitOrders = LimitOrder[];

export const GAS_LIMIT_BUFFER = 5000;
export const DEFAULT_GAS_LIMIT = 500000;
