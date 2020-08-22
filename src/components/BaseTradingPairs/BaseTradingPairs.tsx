import React, { FC } from 'react';

import { BASE_TRADING_PAIRS, CurrencyKey, getMarketPairByMC } from 'constants/currency';
import { buildTradeLink } from 'constants/routes';

import Link from 'components/Link';
import Currency from 'components/Currency';

type BaseTradingPairsProps = {
	currencyKey: CurrencyKey;
};

const BaseTradingPairs: FC<BaseTradingPairsProps> = ({ currencyKey }) => (
	<>
		{BASE_TRADING_PAIRS.filter((quote) => quote !== currencyKey).map((quote) => {
			const { base: baseCurrencyKey, quote: quoteCurrencyKey } = getMarketPairByMC(
				currencyKey,
				quote
			);

			return (
				<Link
					to={buildTradeLink(baseCurrencyKey, quoteCurrencyKey)}
					key={`${currencyKey}-${quote}`}
				>
					<Currency.Pair
						key={quote}
						baseCurrencyKey={baseCurrencyKey}
						quoteCurrencyKey={quoteCurrencyKey}
					/>
				</Link>
			);
		})}
	</>
);

export default BaseTradingPairs;
