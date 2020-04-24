import { getGasInfo } from '../utils/networkUtils';
import snxJSConnector from '../utils/snxJSConnector';
import { bytesFormatter, bigNumberFormatter, parseBytes32String } from '../utils/formatters';
import isEmpty from 'lodash/isEmpty';

const getExchangeFeeRate = async () => {
	const { formatEther } = snxJSConnector.snxJS.utils;
	const exchangeFeeRate = await snxJSConnector.snxJS.FeePool.exchangeFeeRate();
	return 100 * Number(formatEther(exchangeFeeRate));
};

const getNetworkPrices = async () => {
	return await getGasInfo();
};

const getFrozenSynths = async () => {
	const frozenSynths = [];
	const result = await snxJSConnector.synthSummaryUtilContract.frozenSynths();
	result.forEach(synth => {
		const synthKeyString = parseBytes32String(synth);
		if (synthKeyString) {
			frozenSynths.push(synthKeyString);
		}
	});
	return frozenSynths;
};

export const getExchangeData = async synths => {
	try {
		const [exchangeFeeRate, networkPrices, frozenSynths] = await Promise.all([
			getExchangeFeeRate(),
			getNetworkPrices(),
			getFrozenSynths(synths),
		]);
		return {
			exchangeFeeRate,
			networkPrices,
			frozenSynths,
		};
	} catch (e) {
		console.log('Error while fetching exchange data', e);
	}
};

export const fetchSynthsBalance = async walletAddress => {
	let balances = {};
	const [balanceResults, totalBalanceResults] = await Promise.all([
		snxJSConnector.synthSummaryUtilContract.synthsBalances(walletAddress),
		snxJSConnector.synthSummaryUtilContract.totalSynthsInKey(walletAddress, bytesFormatter('sUSD')),
	]);
	const [synthsKeys, synthsBalances, synthsUSDBalances] = balanceResults;

	synthsKeys.forEach((key, i) => {
		const synthName = parseBytes32String(key);
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

export const fetchEthBalance = async walletAddress => {
	const balance = await snxJSConnector.provider.getBalance(walletAddress);
	const usdBalance = await snxJSConnector.snxJS.ExchangeRates.effectiveValue(
		bytesFormatter('sETH'),
		balance,
		bytesFormatter('sUSD')
	);
	return {
		balance: bigNumberFormatter(balance),
		usdBalance: bigNumberFormatter(usdBalance),
	};
};
