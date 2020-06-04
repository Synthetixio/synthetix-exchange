import isEmpty from 'lodash/isEmpty';
import compact from 'lodash/compact';

import { getGasInfo } from 'utils/networkUtils';
import snxJSConnector from 'utils/snxJSConnector';

import { bytesFormatter, bigNumberFormatter, parseBytes32String } from 'utils/formatters';

import { SYNTHS_MAP, CurrencyKey } from 'constants/currency';
import { BigNumberish } from 'ethers/utils';

const getNetworkPrices = async () => {
	return await getGasInfo();
};

const getFrozenSynths = async () => {
	const frozenSynths = await (snxJSConnector as any).synthSummaryUtilContract.frozenSynths();

	return compact(frozenSynths.map(parseBytes32String));
};

export const getExchangeData = async () => {
	try {
		const [networkPrices, frozenSynths] = await Promise.all([
			getNetworkPrices(),
			getFrozenSynths(),
		]);
		return {
			networkPrices,
			frozenSynths,
		};
	} catch (e) {
		console.log('Error while fetching exchange data', e);
	}
};

export const fetchSynthsBalance = async (walletAddress: string) => {
	let balances: Record<
		CurrencyKey,
		{
			balance: number;
			balanceBN: BigNumberish;
			usdBalance: number;
		}
	> = {};

	const [balanceResults, totalBalanceResults] = await Promise.all([
		(snxJSConnector as any).synthSummaryUtilContract.synthsBalances(walletAddress),
		(snxJSConnector as any).synthSummaryUtilContract.totalSynthsInKey(
			walletAddress,
			bytesFormatter(SYNTHS_MAP.sUSD)
		),
	]);

	const [synthsKeys, synthsBalances, synthsUSDBalances] = balanceResults;

	synthsKeys.forEach((key: string, i: string) => {
		const synthName = parseBytes32String(key) as CurrencyKey;
		balances[synthName] = {
			balance: bigNumberFormatter(synthsBalances[i]),
			balanceBN: synthsBalances[i],
			usdBalance: bigNumberFormatter(synthsUSDBalances[i]),
		};
	});

	return {
		balances: isEmpty(balances) ? 0 : balances,
		usdBalance: totalBalanceResults ? bigNumberFormatter(totalBalanceResults) : 0,
	};
};

export const fetchEthBalance = async (walletAddress: string) => {
	const balance = await (snxJSConnector as any).provider.getBalance(walletAddress);
	const usdBalance = await (snxJSConnector as any).snxJS.ExchangeRates.effectiveValue(
		bytesFormatter(SYNTHS_MAP.sETH),
		balance,
		bytesFormatter(SYNTHS_MAP.sUSD)
	);

	return {
		balance: bigNumberFormatter(balance),
		usdBalance: bigNumberFormatter(usdBalance),
	};
};
