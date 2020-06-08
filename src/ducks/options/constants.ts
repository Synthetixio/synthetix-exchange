import BigNumber from 'bignumber.js';
import { toBigNumber } from 'utils/formatters';
import { Phase, Side, OptionsMarket } from './types';

export const PHASE: Record<Phase, BigNumber> = {
	Bidding: toBigNumber(0),
	Trading: toBigNumber(1),
	Maturity: toBigNumber(2),
	Destruction: toBigNumber(3),
};

export const SIDE: Record<Side, BigNumber> = {
	Long: toBigNumber(0),
	Short: toBigNumber(1),
};

export const getPhase = (optionsMarket: OptionsMarket): Phase => {
	const now = Date.now();

	if (optionsMarket.endOfBidding <= now) {
		return 'Bidding';
	}

	if (optionsMarket.maturityDate <= now) {
		return 'Trading';
	}

	if (optionsMarket.destructionDate <= now) {
		return 'Maturity';
	}

	return 'Destruction';
};
