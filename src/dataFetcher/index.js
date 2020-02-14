import snxData from 'synthetix-data';
import { getGasInfo } from '../utils/networkUtils';
import snxJSConnector from '../utils/snxJSConnector';
import { bytesFormatter, bigNumberFormatter, parseBytes32String } from '../utils/formatters';
import isEmpty from 'lodash/isEmpty';
import { subDays } from 'date-fns';

const getExchangeRates = async () => {
	let synthsRates = {};
	const [keys, rates] = await snxJSConnector.synthSummaryUtilContract.synthsRates();
	keys.forEach((key, i) => {
		const synthName = parseBytes32String(key);
		synthsRates[synthName] = Number(bigNumberFormatter(rates[i]));
	});
	return { synthsRates, ethRate: synthsRates['sETH'] };
};

const getExchangeFeeRate = async () => {
	const { formatEther } = snxJSConnector.snxJS.utils;
	const exchangeFeeRate = await snxJSConnector.snxJS.FeePool.exchangeFeeRate();
	return 100 * Number(formatEther(exchangeFeeRate));
};

const getNetworkPrices = async () => {
	return await getGasInfo();
};

const getFrozenSynths = async () => {
	const frozenSynths = {};
	const result = await snxJSConnector.synthSummaryUtilContract.frozenSynths();
	result.forEach(synth => {
		const synthKeyString = parseBytes32String(synth);
		if (synthKeyString) frozenSynths[synthKeyString] = true;
	});
	return frozenSynths;
};

const getTopSynthByVolume = async () => {
	const yesterday = Math.trunc(subDays(new Date(), 1).getTime() / 1000);
	const volume = await snxData.exchanges.since({ timestampInSecs: yesterday });
	return volume.reduce((acc, next) => {
		if (acc[next.toCurrencyKey]) {
			acc[next.toCurrencyKey] += next.toAmountInUSD;
		} else acc[next.toCurrencyKey] = next.toAmountInUSD;
		if (acc[next.fromCurrency]) {
			acc[next.fromCurrency] += next.fromAmountInUSD;
		} else acc[next.fromCurrency] = next.fromAmountInUSD;
		return acc;
	}, {});
};

export const getExchangeData = async synths => {
	try {
		const [
			exchangeRates,
			exchangeFeeRate,
			networkPrices,
			frozenSynths,
			topSynthByVolume,
		] = await Promise.all([
			getExchangeRates(synths),
			getExchangeFeeRate(),
			getNetworkPrices(),
			getFrozenSynths(synths),
			getTopSynthByVolume(),
		]);
		return {
			exchangeRates,
			exchangeFeeRate,
			networkPrices,
			frozenSynths,
			topSynthByVolume,
		};
	} catch (e) {
		console.log('Error while fetching exchange data', e);
	}
};

const getSynthsBalance = async walletAddress => {
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

const getEthBalance = async walletAddress => {
	const balance = await snxJSConnector.provider.getBalance(walletAddress);
	const usdBalance = await snxJSConnector.snxJS.Synthetix.effectiveValue(
		bytesFormatter('sETH'),
		balance,
		bytesFormatter('sUSD')
	);
	return {
		balance: bigNumberFormatter(balance),
		usdBalance: bigNumberFormatter(usdBalance),
	};
};

export const getWalletBalances = async (walletAddress, synths) => {
	try {
		const [synthsBalance, ethBalance] = await Promise.all([
			getSynthsBalance(walletAddress, synths),
			getEthBalance(walletAddress),
		]);
		return { synths: synthsBalance, eth: ethBalance };
	} catch (e) {
		console.log('Error while fetching wallet balances', e);
	}
};
