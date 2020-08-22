import React, { FC, createContext, useContext } from 'react';
import { OptionsMarketInfo } from 'pages/Options/types';

const MarketContext = createContext<OptionsMarketInfo | null>(null);

type MarketContextProps = {
	children: React.ReactNode;
	optionsMarket: OptionsMarketInfo;
};

export const MarketProvider: FC<MarketContextProps> = ({ children, optionsMarket }) => (
	<MarketContext.Provider value={optionsMarket}>{children}</MarketContext.Provider>
);

export const useMarketContext = () => useContext(MarketContext) as OptionsMarketInfo;
