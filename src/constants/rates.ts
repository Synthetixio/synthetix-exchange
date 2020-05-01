import { CurrencyKey } from './currency';

export type RateUpdate = {
	block: number;
	synth: CurrencyKey;
	timestamp: number;
	date: string;
	hash: string;
	rate: number;
};

export type RateUpdates = RateUpdate[];
