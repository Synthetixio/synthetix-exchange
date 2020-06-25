import React, { FC } from 'react';

import BiddingPhaseCard from './BiddingPhaseCard';
import TradingPhaseCard from './TradingPhaseCard';
import MaturityPhaseCard from './MaturityPhaseCard';

import { useMarketContext } from '../contexts/MarketContext';

const TradeCard: FC = () => {
	const optionsMarket = useMarketContext();

	return (
		<>
			{optionsMarket.phase === 'bidding' && <BiddingPhaseCard optionsMarket={optionsMarket} />}
			{optionsMarket.phase === 'trading' && <TradingPhaseCard optionsMarket={optionsMarket} />}
			{optionsMarket.phase === 'maturity' && <MaturityPhaseCard optionsMarket={optionsMarket} />}
		</>
	);
};

export default TradeCard;
