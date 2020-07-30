import orderBy from 'lodash/orderBy';
import { SynthDefinitionMap } from 'ducks/synths';
import { PHASE, getPhaseAndEndDate } from '../constants';
import { OptionsMarkets } from '../types';

export const sortOptionsMarkets = (markets: OptionsMarkets, synthsMap: SynthDefinitionMap) =>
	orderBy(
		markets.map((optionsMarket) => {
			const { phase, timeRemaining } = getPhaseAndEndDate(
				optionsMarket.biddingEndDate,
				optionsMarket.maturityDate,
				optionsMarket.expiryDate
			);

			return {
				...optionsMarket,
				phase,
				asset: synthsMap[optionsMarket.currencyKey]?.asset || optionsMarket.currencyKey,
				timeRemaining,
				phaseNum: PHASE[phase],
			};
		}),
		['phaseNum', 'timeRemaining']
	);
