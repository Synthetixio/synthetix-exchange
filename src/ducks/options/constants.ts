import BigNumber from 'bignumber.js';
import { toBigNumber } from 'utils/formatters';
import { Phase, Side } from './types';

export const PHASE: Record<Phase, BigNumber> = {
	bidding: toBigNumber(0),
	trading: toBigNumber(1),
	maturity: toBigNumber(2),
	expiry: toBigNumber(3),
};

export const SIDE: Record<Side, BigNumber> = {
	long: toBigNumber(0),
	short: toBigNumber(1),
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
