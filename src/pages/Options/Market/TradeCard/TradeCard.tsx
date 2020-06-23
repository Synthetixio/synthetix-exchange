import React, { FC } from 'react';

import { OptionsMarketInfo } from 'ducks/options/types';

import BiddingPhaseCard from './BiddingPhaseCard';
import TradingPhaseCard from './TradingPhaseCard';
import MaturityPhaseCard from './MaturityPhaseCard';

type TradeCardProps = {
	optionsMarket: OptionsMarketInfo;
};

const TradeCard: FC<TradeCardProps> = ({ optionsMarket }) => (
	<>
		{optionsMarket.phase === 'bidding' && <BiddingPhaseCard optionsMarket={optionsMarket} />}
		{optionsMarket.phase === 'trading' && <TradingPhaseCard optionsMarket={optionsMarket} />}
		{optionsMarket.phase === 'maturity' && <MaturityPhaseCard optionsMarket={optionsMarket} />}
	</>
);

export default TradeCard;
