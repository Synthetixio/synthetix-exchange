import BigNumber from 'bignumber.js';
import { toBigNumber } from 'utils/formatters';
import { Phase, Side, OptionsMarket } from './types';

export const PHASE: Record<Phase, BigNumber> = {
	bidding: toBigNumber(0),
	trading: toBigNumber(1),
	maturity: toBigNumber(2),
	destruction: toBigNumber(3),
};

export const SIDE: Record<Side, BigNumber> = {
	long: toBigNumber(0),
	short: toBigNumber(1),
};

export const getPhase = (optionsMarket: OptionsMarket): Phase => {
	const now = Date.now();

	if (optionsMarket.endOfBidding > now) {
		return 'bidding';
	}

	if (optionsMarket.maturityDate > now) {
		return 'trading';
	}

	if (optionsMarket.destructionDate > now) {
		return 'maturity';
	}

	return 'destruction';
};
