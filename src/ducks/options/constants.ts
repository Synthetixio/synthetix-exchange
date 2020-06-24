import { Phase, Side } from './types';

export const PHASE: Record<Phase, number> = {
	bidding: 0,
	trading: 1,
	maturity: 2,
	expiry: 3,
};

export const SIDE: Record<Side, number> = {
	long: 0,
	short: 1,
};

export const getPhaseAndEndDate = (
	biddingEndDate: number,
	maturityDate: number,
	expiryDate: number
): { phase: Phase; timeRemaining: number } => {
	const now = Date.now();

	if (biddingEndDate > now) {
		return {
			phase: 'bidding',
			timeRemaining: biddingEndDate,
		};
	}

	if (maturityDate > now) {
		return {
			phase: 'trading',
			timeRemaining: maturityDate,
		};
	}

	if (expiryDate > now) {
		return {
			phase: 'maturity',
			timeRemaining: expiryDate,
		};
	}

	// TODO: need to check if this is correct

	return {
		phase: 'expiry',
		timeRemaining: expiryDate,
	};
};
